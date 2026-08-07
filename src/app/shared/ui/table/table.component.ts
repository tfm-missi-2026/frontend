import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
  TemplateRef,
  Type,
  input,
  output,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { UiFlexComponent } from "@shared/ui/flex/flex.component";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { matchesSearch } from "@utils/strings";
import { UiCheckboxComponent } from "@shared/ui/input/checkbox/checkbox.component";
import { UiInputComponent } from "@shared/ui/input/input/input.component";
import { UiIconButtonComponent } from "@shared/ui/icon-button/icon-button.component";
import { IconChevronLeftComponent } from "@shared/icons/chevron-left-icon";
import { IconChevronRightComponent } from "@shared/icons/chevron-right-icon";
import {
  TableAction,
  TableCellContext,
  TableColumn,
  TablePageEvent,
  TableSelection,
} from "./table.types";

/**
 * `UiTable`
 * Tabla genérica data-driven del design system.
 *
 * Cubre los features presentes en los `basic-table-{one..five}`:
 *  - Headers tipados por `columns`.
 *  - Búsqueda client-side case-insensitive sobre columnas `searchable`.
 *  - Selección por fila + select-all (`<UiCheckbox>`).
 *  - Paginación client-side con `pageSize` configurable.
 *  - Acciones por fila (`<UiIconButton>` con tooltip).
 *  - Toolbar opcional con title + slot para acciones globales.
 */
@Component({
  selector: "UiTable",
  standalone: true,
  imports: [
    UiFlexComponent,
    UiLabelComponent,
    UiCheckboxComponent,
    UiInputComponent,
    UiIconButtonComponent,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
})
export class UiTableComponent implements OnInit {
  readonly data = input<unknown[]>([]);
  readonly columns = input<TableColumn[]>([]);
  readonly actions = input<TableAction[]>([]);

  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly variant = input<"card" | "flat">("card");
  readonly searchPlaceholder = input<string>("Search...");
  readonly emptyText = input<string>("No results found.");
  readonly className = input<string>("");

  readonly searchable = input<boolean>(false);
  readonly selectable = input<boolean>(false);
  readonly paginated = input<boolean>(false);
  readonly hasActions = input<boolean>(true);

  readonly pageSize = input<number>(10);
  readonly trackByKey = input<string>("id");
  readonly searchIcon = input<Type<unknown> | undefined>(undefined);
  readonly prevIcon = input<Type<unknown>>(ChevronLeftIcon);
  readonly nextIcon = input<Type<unknown>>(ChevronRightIcon);
  readonly initialSearchTerm = input<string>("");

  readonly rowSelect = output<TableSelection>();
  readonly searchChange = output<string>();
  readonly pageChange = output<TablePageEvent>();

  protected readonly searchTerm = signal("");
  protected readonly currentPage = signal(1);
  protected readonly selectedRows = signal<unknown[]>([]);

  // Mapa tipado para mapear `TableColumn.width` a clases Tailwind estáticas
  // (necesario para que el JIT de Tailwind detecte las clases en build).
  private static readonly WIDTH_CLASS_MAP: Record<string, string> = {
    "60px": "min-w-[60px]",
    "80px": "min-w-[80px]",
    "100px": "min-w-[100px]",
    "120px": "min-w-[120px]",
    "140px": "min-w-[140px]",
    "160px": "min-w-[160px]",
    "180px": "min-w-[180px]",
    "200px": "min-w-[200px]",
    "240px": "min-w-[240px]",
    "280px": "min-w-[280px]",
    "320px": "min-w-[320px]",
  };

  /** Filas tras aplicar la búsqueda. */
  protected readonly filteredData = computed<unknown[]>(() => {
    const term = this.searchTerm();
    if (!term.trim() || !this.searchable()) return this.data();

    const cols = this.columns().filter((c) => c.searchable !== false && c.key);
    if (!cols.length) return this.data();

    return this.data().filter((row) => {
      for (const c of cols) {
        const value = (row as Record<string, unknown>)[c.key];
        if (value === null || value === undefined) continue;
        if (matchesSearch(term, String(value))) return true;
      }
      return false;
    });
  });

  /** Filas visibles en la página actual. */
  protected readonly pagedData = computed<unknown[]>(() => {
    if (!this.paginated()) return this.filteredData();
    const size = Math.max(1, this.pageSize());
    const start = (this.currentPage() - 1) * size;
    return this.filteredData().slice(start, start + size);
  });

  /** Total de páginas. */
  protected readonly totalPages = computed<number>(() => {
    if (!this.paginated()) return 1;
    return Math.max(1, Math.ceil(this.filteredData().length / this.pageSize()));
  });

  /** Indica si la fila dada está seleccionada. */
  protected isRowSelected = (row: unknown): boolean => {
    return this.selectedRows().includes(row);
  };

  /** Estado del checkbox de "select all" en la página actual. */
  protected readonly selectAllState = computed<{
    checked: boolean;
    indeterminate: boolean;
  }>(() => {
    const page = this.pagedData();
    if (!page.length) return { checked: false, indeterminate: false };
    const sel = this.selectedRows();
    const onPage = page.filter((r) => sel.includes(r));
    return {
      checked: onPage.length === page.length,
      indeterminate: onPage.length > 0 && onPage.length < page.length,
    };
  });

  /** Rango "Showing X–Y of Z". */
  protected readonly rangeLabel = computed<string>(() => {
    if (!this.paginated()) return "";
    const total = this.filteredData().length;
    if (!total) return "Showing 0 of 0";
    const size = Math.max(1, this.pageSize());
    const start = (this.currentPage() - 1) * size + 1;
    const end = Math.min(start + size - 1, total);
    return `Showing ${start}–${end} of ${total}`;
  });

  ngOnInit(): void {
    this.searchTerm.set(this.initialSearchTerm());
  }

  /** `trackBy` para `@for`. */
  protected trackByRow = (_: number, row: unknown): unknown => {
    const key = this.trackByKey();
    if (key && typeof row === "object" && row !== null) {
      return (row as Record<string, unknown>)[key];
    }
    return row;
  };

  /** Valor de la celda default (sin template custom). */
  protected getCellValue(row: unknown, key: string): string {
    if (row === null || row === undefined) return "";
    const value = (row as Record<string, unknown>)[key];
    if (value === null || value === undefined) return "";
    return String(value);
  }

  /** Clases del header de una columna. */
  protected thClass(col: TableColumn): string {
    return [
      "px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400",
      col.align === "center" ? "text-center" : "",
      col.align === "end" ? "text-end" : "",
      this.widthClass(col.width),
      col.headerClassName ?? "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  /** Clases de la celda. */
  protected tdClass(col: TableColumn): string {
    return [
      "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
      col.align === "center" ? "text-center" : "",
      col.align === "end" ? "text-end" : "",
      this.widthClass(col.width),
      col.cellClassName ?? "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  /** Mapea `TableColumn.width` a una clase Tailwind estática del mapa. */
  private widthClass(width: string | undefined): string {
    if (!width) return "";
    return UiTableComponent.WIDTH_CLASS_MAP[width] ?? "";
  }

  /** Context para `*ngTemplateOutlet` de una celda. */
  protected cellContext(
    col: TableColumn,
    row: unknown,
    index: number,
  ): TableCellContext<unknown> {
    return { $implicit: row, row, index };
  }

  /** Indica si hay acciones configuradas y `hasActions` está activo. */
  protected get showActionsColumn(): boolean {
    return this.hasActions() && this.actions().length > 0;
  }

  /** Indica si se debe renderizar la columna de select. */
  protected get showSelectColumn(): boolean {
    return this.selectable();
  }

  /** Indica si se debe renderizar el toolbar. */
  protected get showToolbar(): boolean {
    return !!this.title() || this.searchable();
  }

  /** Clases del contenedor raíz. */
  protected get containerClasses(): string {
    const base =
      this.variant() === "card"
        ? "rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"
        : "rounded-2xl";
    return [base, this.className()].filter(Boolean).join(" ");
  }

  protected onSearchInput(value: string | number | undefined): void {
    const term = (value ?? "").toString();
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.searchChange.emit(term);
    this.pageChange.emit({ page: 1, pageSize: this.pageSize() });
  }

  protected onRowToggle(row: unknown, checked: boolean): void {
    const current = this.selectedRows();
    const next = checked ? [...current, row] : current.filter((r) => r !== row);
    this.selectedRows.set(next);
    this.emitSelection(next);
  }

  protected onSelectAllToggle(checked: boolean): void {
    const page = this.pagedData();
    const current = this.selectedRows();
    const pageSet = new Set(page);
    const next = checked
      ? Array.from(new Set([...current, ...page]))
      : current.filter((r) => !pageSet.has(r));
    this.selectedRows.set(next);
    this.emitSelection(next);
  }

  protected onActionClick(
    action: TableAction,
    row: unknown,
    index: number,
  ): void {
    if (action.disabled?.(row)) return;
    action.onClick(row, index);
  }

  protected onPrevPage(): void {
    const next = Math.max(1, this.currentPage() - 1);
    if (next === this.currentPage()) return;
    this.currentPage.set(next);
    this.pageChange.emit({ page: next, pageSize: this.pageSize() });
  }

  protected onNextPage(): void {
    const next = Math.min(this.totalPages(), this.currentPage() + 1);
    if (next === this.currentPage()) return;
    this.currentPage.set(next);
    this.pageChange.emit({ page: next, pageSize: this.pageSize() });
  }

  private emitSelection(rows: unknown[]): void {
    const key = this.trackByKey();
    const keys = rows.map((r) =>
      typeof r === "object" && r !== null && key
        ? (r as Record<string, unknown>)[key]
        : r,
    );
    this.rowSelect.emit({ rows, keys });
  }
}

// Iconos de paginación por defecto re-exportados desde `@ui/icon` como `Type<unknown>` para encajar en `prevIcon`/`nextIcon` sin cast en el consumer.
export const ChevronLeftIcon =
  IconChevronLeftComponent as unknown as Type<unknown>;
export const ChevronRightIcon =
  IconChevronRightComponent as unknown as Type<unknown>;
