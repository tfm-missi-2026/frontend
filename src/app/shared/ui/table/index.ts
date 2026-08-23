/**
 * Public API del `UiTable` del design system.
 *
 * Unico punto de entrada: importar `UiTableComponent` y los tipos
 * publicos (`TableColumn`, `TableAction`, etc.).
 *
 * Los sub-componentes (`UiTableToolbar`, `UiTableSortableHeader`,
 * `UiTablePaginationFooter`) son detalles internos y NO se exportan.
 * El consumidor nunca los usa directamente.
 *
 * Tabla declarativa data-driven server-side-first.
 *
 * Contrato:
 *  1. El padre mantiene un `WritableSignal<MyQueryParams>` en su servicio.
 *  2. Pasa `[query]="admin.query()"` (read value) y
 *     `(queryChange)="admin.query.set($event)"` para sincronizar.
 *  3. Pasa `[fetchData]="(q) => service.fetchData(q)"` para auto-cargar.
 *
 * El UiTable se auto-gestiona:
 *  - Sort/page/search/pageSize: mutan el query y lo emiten (queryChange).
 *  - El effect() interno dispara `fetchData(query)` en cada cambio.
 *
 * @example
 * ```ts
 * // componente
 * <UiTable
 *   [query]="admin.query()"
 *   [fetchData]="(q) => admin.fetchData(q)"
 *   [columns]="columns"
 *   (queryChange)="admin.query.set($event)"
 * />
 * ```
 */

export { UiTableComponent } from './table.component';

// Iconos stub internos (chevrons de paginacion) re-exportados por si el
// consumer quiere reutilizarlos en otras partes de la UI.
export { ChevronLeftIcon, ChevronRightIcon } from './table.component';

export type {
  TableCellContext,
  TableColumn,
  TableAction,
  TableAlign,
  TableSortDirection,
  TableSortEvent,
  TableFetchResult,
  TableSelection,
} from './table.types';
