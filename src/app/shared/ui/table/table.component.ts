import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  TemplateRef,
  Type,
  output,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { BaseQueryParams } from "@core/query-params";

import { UiButtonComponent } from "@shared/ui/button";
import { UiCheckboxComponent } from "@shared/ui/input/checkbox/checkbox.component";
import { UiFlexComponent } from "@shared/ui/flex/flex.component";
import { UiLabelComponent } from "@shared/ui/label";
import { IconChevronLeftComponent } from "@shared/icons/chevron-left-icon";
import { IconChevronRightComponent } from "@shared/icons/chevron-right-icon";
import { extractProblemMessage } from "@utils/problem-detail";

import { UiTableSortableHeaderComponent } from "./table-sortable-header.component";
import { UiTableToolbarComponent } from "./table-toolbar.component";
import { UiTablePaginationFooterComponent } from "./table-pagination-footer.component";

import {
  TableAction,
  TableCellContext,
  TableColumn,
  TableFetchResult,
  TableSelection,
} from "./table.types";
import { cloneQuery, tableWidthClass } from "./table.utils";

/**
 * `UiTable` — orquestador.
 *
 * El consumer pasa:
 *  - `[query]`: el valor actual del `BaseQueryParams` (signal derivado
 *    en el padre, tipicamente via `[query]="admin.query()"`).
 *  - `(queryChange)`: emite el query mutado cuando el usuario interactua
 *    (sort, search, pageSize, prev/next). El padre lo aplica sobre su
 *    signal: `admin.query.set($event)`.
 *  - `[fetchData]`: funcion invocada por el `effect()` interno cada vez
 *    que `query` cambia.
 *
 * **Modos de carga** (mutuamente excluyentes):
 *  - **auto**: `[fetchData]` presente → llama la funcion cada vez que
 *    cambia `query` y renderiza el resultado.
 *  - **controlado**: `[data]` presente → el padre empuja los datos
 *    (con `[total]`/`[pageCount]`/`[loading]`/`[error]` opcionales).
 *
 * **Acciones**: si pasas `[actions]`, el UiTable renderiza una columna
 * final con `UiButton` por accion (horizontal, `noWrap`). Si prefieres
 * control total (como en `modulos-admin-list`), declara tu propia
 * columna `key: "acciones"` con `cell: TemplateRef<TableCellContext<T>>`
 * y NO pases `[actions]`.
 */
@Component({
  selector: "UiTable",
  standalone: true,
  imports: [
    NgTemplateOutlet,
    UiButtonComponent,
    UiCheckboxComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiTablePaginationFooterComponent,
    UiTableSortableHeaderComponent,
    UiTableToolbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class UiTableComponent<
  TQuery extends BaseQueryParams = BaseQueryParams,
  TRow = unknown,
> {
  /**
   * Valor actual del query (read-only). Tipicamente `[query]="admin.query()"`.
   * Es el `WritableSignal` del padre lo que mantiene el estado; el padre
   * lo aplica al UiTable via `[query]` y consume los cambios via
   * `(queryChange)`.
   */
  readonly query = input.required<TQuery>();

  /**
   * Emite un NUEVO `TQuery` (clonado y mutado) cuando el usuario
   * interactua. El padre debe hacer `admin.query.set($event)` para
   * propagarlo a su signal y que el `effect()` interno re-dispare el fetch.
   */
  readonly queryChange = output<TQuery>();

  // ----- Modo AUTO ---------------------------------------------------------
  readonly fetchData = input<(q: TQuery) => Promise<TableFetchResult<TRow>>>();

  // ----- Modo CONTROLADO ---------------------------------------------------
  readonly data = input<TRow[] | undefined>(undefined);
  readonly total = input<number | null | undefined>(undefined);
  readonly pageCount = input<number | null | undefined>(undefined);
  readonly loading = input<boolean | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);

  // ----- Visual / estructura ----------------------------------------------
  readonly columns = input<TableColumn<TRow>[]>([]);
  readonly actions = input<TableAction<TRow>[]>([]);

  readonly actionVariant = input<"primary" | "secondary" | "tertiary">("secondary");

  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly variant = input<"card" | "flat">("card");
  readonly searchPlaceholder = input<string>("Buscar…");
  readonly emptyText = input<string>("Sin resultados.");
  readonly rangeLabelTemplate = input<string>("Mostrando {from}–{to} de {total}");
  readonly pageLabelTemplate = input<string>("Página {page} de {total}");
  readonly className = input<string>("");

  readonly searchable = input<boolean>(false);
  readonly selectable = input<boolean>(false);
  readonly paginated = input<boolean>(false);
  readonly hasActions = input<boolean>(true);

  readonly pageSizeOptions = input<number[]>([]);
  readonly trackByKey = input<string>("id");
  readonly searchIcon = input<Type<unknown> | undefined>(undefined);
  readonly prevIcon = input<Type<unknown>>(ChevronLeftIcon);
  readonly nextIcon = input<Type<unknown>>(ChevronRightIcon);

  readonly rowSelect = output<TableSelection<TRow>>();

  // ----- Estado interno del modo AUTO --------------------------------------
  private readonly _autoData = signal<TRow[]>([]);
  private readonly _autoTotal = signal<number | null>(null);
  private readonly _autoPageCount = signal<number | null>(null);
  private readonly _autoLoading = signal<boolean>(false);
  private readonly _autoError = signal<string | null>(null);
  private _fetchSeq = 0;

  /** UI-only state (no parte del query). */
  protected readonly selectedRows = signal<TRow[]>([]);

  // ----- Derivados ---------------------------------------------------------
  protected readonly isAutoMode = computed<boolean>(
    () => this.fetchData() !== undefined,
  );

  protected readonly effectiveData = computed<TRow[]>(() => {
    if (this.isAutoMode()) return this._autoData();
    return this.data() ?? [];
  });
  protected readonly effectiveTotal = computed<number | null>(() => {
    if (this.isAutoMode()) return this._autoTotal();
    return this.total() ?? null;
  });
  protected readonly effectivePageCount = computed<number | null>(() => {
    if (this.isAutoMode()) return this._autoPageCount();
    return this.pageCount() ?? null;
  });
  protected readonly effectiveLoading = computed<boolean>(() => {
    if (this.isAutoMode()) return this._autoLoading();
    return this.loading() ?? false;
  });
  protected readonly effectiveError = computed<string | null>(() => {
    if (this.isAutoMode()) return this._autoError();
    return this.error() ?? null;
  });

  protected readonly currentSearch = computed<string>(() => this.query().search);
  protected readonly currentPage = computed<number>(() => this.query().page);
  protected readonly currentPageSize = computed<number>(() => this.query().pageSize);
  protected readonly currentSortBy = computed<string | null>(() => this.query().sortBy);
  protected readonly currentSortDir = computed<"asc" | "desc" | null>(
    () => this.query().sortDir,
  );

  protected readonly totalPages = computed<number>(() => {
    if (!this.paginated()) return 1;
    const pc = this.effectivePageCount();
    if (pc !== null) return Math.max(1, pc);
    const total = this.effectiveTotal();
    if (total !== null) return Math.max(1, Math.ceil(total / this.currentPageSize()));
    return Math.max(1, Math.ceil(this.effectiveData().length / this.currentPageSize()));
  });

  protected readonly selectAllState = computed<{
    checked: boolean;
    indeterminate: boolean;
  }>(() => {
    const page = this.effectiveData();
    if (!page.length) return { checked: false, indeterminate: false };
    const sel = this.selectedRows();
    const onPage = page.filter((r) => sel.includes(r));
    return {
      checked: onPage.length === page.length,
      indeterminate: onPage.length > 0 && onPage.length < page.length,
    };
  });

  protected readonly rangeLabel = computed<string>(() => {
    if (!this.paginated()) return "";
    const total = this.effectiveTotal() ?? this.effectiveData().length;
    if (!total) {
      return this.rangeLabelTemplate()
        .replace("{from}", "0")
        .replace("{to}", "0")
        .replace("{total}", "0");
    }
    const size = Math.max(1, this.currentPageSize());
    const start = (this.currentPage() - 1) * size + 1;
    const end = Math.min(start + size - 1, total);
    return this.rangeLabelTemplate()
      .replace("{from}", String(start))
      .replace("{to}", String(end))
      .replace("{total}", String(total));
  });

  constructor() {
    effect(() => {
      const fetch = this.fetchData();
      if (!fetch) return;
      const q = this.query();
      void this.runFetch(q, fetch);
    });
  }

  private async runFetch(
    q: TQuery,
    fetch: (q: TQuery) => Promise<TableFetchResult<TRow>>,
  ): Promise<void> {
    const seq = ++this._fetchSeq;
    this._autoLoading.set(true);
    this._autoError.set(null);
    try {
      const result = await fetch(q);
      if (seq !== this._fetchSeq) return;
      if (Array.isArray(result)) {
        this._autoData.set(result as TRow[]);
        this._autoTotal.set(result.length);
        this._autoPageCount.set(null);
      } else {
        this._autoData.set(result.items);
        this._autoTotal.set(result.total);
        this._autoPageCount.set(
          typeof result.totalPages === "number" ? result.totalPages : null,
        );
      }
    } catch (err) {
      if (seq !== this._fetchSeq) return;
      this._autoError.set(extractProblemMessage(err));
    } finally {
      if (seq === this._fetchSeq) {
        this._autoLoading.set(false);
      }
    }
  }

  // ----- Handlers: clonar + mutar + emitir `queryChange` ----------------

  private emitNext(mutator: (q: TQuery) => void): void {
    const next = cloneQuery(this.query());
    mutator(next);
    this.queryChange.emit(next);
  }

  protected onSearchInput(value: string | number | undefined): void {
    const term = (value ?? "").toString();
    this.emitNext((q) => q.setSearch(term));
  }

  protected onSortChange(payload: {
    key: string;
    direction: "asc" | "desc" | null;
  }): void {
    this.emitNext((q) => {
      if (payload.direction) {
        q.setSort(payload.key, payload.direction);
      } else {
        q.sortBy = null;
        q.sortDir = "asc";
        q.page = 1;
      }
    });
  }

  protected onPrevPage(): void {
    this.emitNext((q) => q.prevPage());
  }

  protected onNextPage(): void {
    this.emitNext((q) => q.nextPage());
  }

  protected onPageSizeSelect(pageSize: number): void {
    this.emitNext((q) => q.setPageSize(pageSize));
  }

  // ----- Helpers compartidos con template (filas/celdas/seleccion) -------

  protected trackByRow = (_: number, row: TRow): unknown => {
    const key = this.trackByKey();
    if (key && typeof row === "object" && row !== null) {
      return (row as Record<string, unknown>)[key];
    }
    return row;
  };

  protected getCellValue(row: unknown, key: string): string {
    if (row === null || row === undefined) return "";
    const value = (row as Record<string, unknown>)[key];
    if (value === null || value === undefined) return "";
    return String(value);
  }

  protected thClass(col: TableColumn<TRow>): string {
    return [
      "px-4 py-3 font-semibold text-gray-700 text-sm text-start",
      "bg-gray-50 border-b border-gray-200 dark:bg-white/[0.02] dark:border-white/[0.05] dark:text-gray-300",
      col.align === "center" ? "text-center" : "",
      col.align === "end" ? "text-end" : "",
      col.sortable ? "cursor-pointer select-none hover:text-brand-600 dark:hover:text-brand-400" : "",
      tableWidthClass(col.width),
      col.headerClassName ?? "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  protected tdClass(col: TableColumn<TRow>): string {
    return [
      "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
      col.align === "center" ? "text-center" : "",
      col.align === "end" ? "text-end" : "",
      tableWidthClass(col.width),
      col.cellClassName ?? "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  protected cellContext(
    col: TableColumn<TRow>,
    row: TRow,
    index: number,
  ): TableCellContext<TRow> {
    return { $implicit: row, row, index };
  }

  protected isRowSelected(row: TRow): boolean {
    return this.selectedRows().includes(row);
  }

  protected get showActionsColumn(): boolean {
    return this.hasActions() && this.actions().length > 0;
  }

  protected get showSelectColumn(): boolean {
    return this.selectable();
  }

  protected get showToolbar(): boolean {
    return !!this.title() || this.searchable();
  }

  protected get containerClasses(): string {
    const base =
      this.variant() === "card"
        ? "rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
        : "rounded-2xl";
    return [base, this.className()].filter(Boolean).join(" ");
  }

  protected onRowToggle(row: TRow, checked: boolean): void {
    const current = this.selectedRows();
    const next = checked ? [...current, row] : current.filter((r) => r !== row);
    this.selectedRows.set(next);
    this.emitSelection(next);
  }

  protected onSelectAllToggle(checked: boolean): void {
    const page = this.effectiveData();
    const current = this.selectedRows();
    const pageSet = new Set(page);
    const next = checked
      ? Array.from(new Set([...current, ...page]))
      : current.filter((r) => !pageSet.has(r));
    this.selectedRows.set(next);
    this.emitSelection(next);
  }

  protected onActionClick(
    action: TableAction<TRow>,
    row: TRow,
    index: number,
  ): void {
    if (action.disabled?.(row)) return;
    action.onClick(row, index);
  }

  private emitSelection(rows: TRow[]): void {
    const key = this.trackByKey();
    const keys = rows.map((r) =>
      typeof r === "object" && r !== null && key
        ? (r as Record<string, unknown>)[key]
        : r,
    );
    this.rowSelect.emit({ rows, keys });
  }
}

// Iconos de paginacion por defecto (consumer puede sobrescribir via [prevIcon]/[nextIcon]).
export const ChevronLeftIcon =
  IconChevronLeftComponent as unknown as Type<unknown>;
export const ChevronRightIcon =
  IconChevronRightComponent as unknown as Type<unknown>;
