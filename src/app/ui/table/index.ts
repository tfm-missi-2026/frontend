/**
 * Public API del `UiTable` del design system.
 *
 * Réplica Angular del `Table` del proyecto React. Cubre los features
 * de los `basic-table-{one..five}` (búsqueda, selección, paginación,
 * acciones por fila) consolidándolos en un solo componente data-driven.
 *
 * @example
 * ```ts
 * import { UiTableComponent, TableColumn, TableAction } from '@ui/table';
 *
 * @Component({
 *   imports: [UiTableComponent],
 *   template: `
 *     <UiTable
 *       [columns]="columns"
 *       [data]="users"
 *       [selectable]="true"
 *       [searchable]="true"
 *       [paginated]="true"
 *       [actions]="rowActions"
 *       title="Users"
 *     />
 *   `,
 * })
 * export class UsersPage {}
 * ```
 */

export { UiTableComponent } from './table';

// Iconos stub internos (chevrons de paginación). Exportados por si el
// consumer quiere reutilizarlos en otras partes de la UI.
export { ChevronLeftIcon, ChevronRightIcon } from './table';

export type {
  TableCellContext,
  TableColumn,
  TableAction,
  TableAlign,
  TablePageEvent,
  TableSelection,
} from './table.types';
