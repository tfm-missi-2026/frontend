import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  TemplateRef,
  Type,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { UiFlexComponent } from '@ui/flex/flex';
import { UiLabelComponent } from '@ui/label/label';
import { UiCheckboxComponent } from '@ui/input/checkbox/checkbox';
import { UiInputComponent } from '@ui/input/input/input';
import { UiIconButtonComponent } from '@ui/icon-button/icon-button';
import { IconChevronLeftComponent } from '@ui/icon/chevron-left-icon';
import { IconChevronRightComponent } from '@ui/icon/chevron-right-icon';
import {
  TableAction,
  TableCellContext,
  TableColumn,
  TablePageEvent,
  TableSelection,
} from './table.types';

/**
 * `UiTable`
 * --------
 * Tabla genérica data-driven del design system.
 *
 * Cubre los features presentes en los `basic-table-{one..five}`:
 *  - Headers tipados por `columns`.
 *  - Búsqueda client-side case-insensitive sobre columnas `searchable`.
 *  - Selección por fila + select-all (`<UiCheckbox>`).
 *  - Paginación client-side con `pageSize` configurable.
 *  - Acciones por fila (`<UiIconButton>` con tooltip).
 *  - Toolbar opcional con title + slot para acciones globales.
 *
 * Réplica del patrón React usado en la lib original; pensada para
 * centralizar la lógica que estaba duplicada en cada `basic-table-*`.
 */
@Component({
  selector: 'UiTable',
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
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
})
export class UiTableComponent {
  // ---------------------------------------------------------------------------
  // Data inputs
  // ---------------------------------------------------------------------------

  @Input() data: unknown[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];

  // ---------------------------------------------------------------------------
  // Display
  // ---------------------------------------------------------------------------

  @Input() title?: string;
  @Input() description?: string;
  @Input() variant: 'card' | 'flat' = 'card';
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyText = 'No results found.';
  @Input() className = '';

  // ---------------------------------------------------------------------------
  // Feature flags
  // ---------------------------------------------------------------------------

  @Input() searchable = false;
  @Input() selectable = false;
  @Input() paginated = false;
  @Input() hasActions = true;

  // ---------------------------------------------------------------------------
  // Configurable
  // ---------------------------------------------------------------------------

  @Input() pageSize = 10;
  @Input() trackByKey = 'id';
  @Input() searchIcon?: Type<unknown>;
  @Input() prevIcon: Type<unknown> = ChevronLeftIcon;
  @Input() nextIcon: Type<unknown> = ChevronRightIcon;
  @Input() initialSearchTerm = '';

  // ---------------------------------------------------------------------------
  // Outputs
  // ---------------------------------------------------------------------------

  @Output() rowSelect = new EventEmitter<TableSelection>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<TablePageEvent>();

  // ---------------------------------------------------------------------------
  // Estado interno (signals)
  // ---------------------------------------------------------------------------

  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly selectedRows = signal<unknown[]>([]);

  /** Filas tras aplicar la búsqueda. */
  protected readonly filteredData = computed<unknown[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term || !this.searchable) return this.data;

    const cols = this.columns.filter(
      (c) => c.searchable !== false && c.key,
    );
    if (!cols.length) return this.data;

    return this.data.filter((row) =>
      cols.some((c) => {
        const value = (row as Record<string, unknown>)[c.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      }),
    );
  });

  /** Filas visibles en la página actual. */
  protected readonly pagedData = computed<unknown[]>(() => {
    if (!this.paginated) return this.filteredData();
    const size = Math.max(1, this.pageSize);
    const start = (this.currentPage() - 1) * size;
    return this.filteredData().slice(start, start + size);
  });

  /** Total de páginas. */
  protected readonly totalPages = computed<number>(() => {
    if (!this.paginated) return 1;
    return Math.max(1, Math.ceil(this.filteredData().length / this.pageSize));
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
    if (!this.paginated) return '';
    const total = this.filteredData().length;
    if (!total) return 'Showing 0 of 0';
    const size = Math.max(1, this.pageSize);
    const start = (this.currentPage() - 1) * size + 1;
    const end = Math.min(start + size - 1, total);
    return `Showing ${start}–${end} of ${total}`;
  });

  ngOnInit(): void {
    this.searchTerm.set(this.initialSearchTerm);
  }

  /** `trackBy` para `@for`. */
  protected trackByRow = (_: number, row: unknown): unknown => {
    if (this.trackByKey && typeof row === 'object' && row !== null) {
      return (row as Record<string, unknown>)[this.trackByKey];
    }
    return row;
  };

  /** Valor de la celda default (sin template custom). */
  protected getCellValue(row: unknown, key: string): string {
    if (row === null || row === undefined) return '';
    const value = (row as Record<string, unknown>)[key];
    if (value === null || value === undefined) return '';
    return String(value);
  }

  /** Clases del header de una columna. */
  protected thClass(col: TableColumn): string {
    return [
      'px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400',
      col.align === 'center' ? 'text-center' : '',
      col.align === 'end' ? 'text-end' : '',
      col.headerClassName ?? '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  /** Clases de la celda. */
  protected tdClass(col: TableColumn): string {
    return [
      'px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400',
      col.align === 'center' ? 'text-center' : '',
      col.align === 'end' ? 'text-end' : '',
      col.cellClassName ?? '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  /** Style binding para el ancho de columna. */
  protected thStyle(col: TableColumn): Record<string, string> {
    return col.width ? { width: col.width } : {};
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
    return this.hasActions && this.actions.length > 0;
  }

  /** Indica si se debe renderizar la columna de select. */
  protected get showSelectColumn(): boolean {
    return this.selectable;
  }

  /** Indica si se debe renderizar el toolbar. */
  protected get showToolbar(): boolean {
    return !!this.title || this.searchable;
  }

  /** Clases del contenedor raíz. */
  protected get containerClasses(): string {
    const base =
      this.variant === 'card'
        ? 'rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'
        : 'rounded-2xl';
    return [base, this.className].filter(Boolean).join(' ');
  }

  protected onSearchInput(value: string | number | undefined): void {
    const term = (value ?? '').toString();
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.searchChange.emit(term);
    this.pageChange.emit({ page: 1, pageSize: this.pageSize });
  }

  protected onRowToggle(row: unknown, checked: boolean): void {
    const current = this.selectedRows();
    const next = checked
      ? [...current, row]
      : current.filter((r) => r !== row);
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
    this.pageChange.emit({ page: next, pageSize: this.pageSize });
  }

  protected onNextPage(): void {
    const next = Math.min(this.totalPages(), this.currentPage() + 1);
    if (next === this.currentPage()) return;
    this.currentPage.set(next);
    this.pageChange.emit({ page: next, pageSize: this.pageSize });
  }

  private emitSelection(rows: unknown[]): void {
    const keys = rows.map((r) =>
      typeof r === 'object' && r !== null && this.trackByKey
        ? (r as Record<string, unknown>)[this.trackByKey]
        : r,
    );
    this.rowSelect.emit({ rows, keys });
  }
}

// ---------------------------------------------------------------------------
// Iconos de paginación por defecto (re-exportados desde `@ui/icon`).
// Se exponen como `Type<unknown>` para que encajen en `prevIcon`/`nextIcon`
// sin necesidad de cast en el consumer.
// ---------------------------------------------------------------------------

export const ChevronLeftIcon =
  IconChevronLeftComponent as unknown as Type<unknown>;
export const ChevronRightIcon =
  IconChevronRightComponent as unknown as Type<unknown>;
