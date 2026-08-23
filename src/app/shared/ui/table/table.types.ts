import { TemplateRef, Type } from "@angular/core";

import type { PageData } from "@core/models";
import { TooltipSide } from "@shared/ui/tooltip/tooltip.types";

/**
 * Contexto que recibe un `cell` template de una `TableColumn`.
 * `$implicit` se expone para que el consumer pueda hacer
 * `<ng-container *ngTemplateOutlet="cell; context: { $implicit: row }" />`.
 */
export interface TableCellContext<T> {
  $implicit: T;
  row: T;
  index: number;
}

/** Alineación horizontal de una celda o header. */
export type TableAlign = "start" | "center" | "end";

/** Dirección de ordenamiento de una columna. */
export type TableSortDirection = "asc" | "desc";

/**
 * Resultado de la funcion `fetchData` del UiTable.
 *
 * Dos formas equivalentes:
 *  - **Solo items** (cliente-side o filtro client-side):
 *      return User[];
 *  - **Pagina completa** (server-side):
 *      return { items, total, page, pageSize, totalPages };
 *
 * En ambos casos el padre solo pasa la funcion al UiTable.
 * Si devuelve `PageData<T>`, ademas se llenan total/pageCount para
 * la paginacion y el contador "Mostrando X-Y de Z".
 */
export type TableFetchResult<TRow> =
  | TRow[]
  | Pick<PageData<TRow>, "items" | "total" | "totalPages">;

/**
 * Descriptor de una columna de `<UiTable>`.
 *
 * Dos formas equivalentes de declararla:
 *  1. **Sin template** — solo `key` + `header`, se renderiza
 *     `{{ row[key] }}` como texto plano (via `Label`).
 *  2. **Con template** — se pasa un `TemplateRef<TableCellContext<T>>`
 *     en `cell` para contenido custom (avatar+texto, badge, etc.).
 */
export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  cell?: TemplateRef<TableCellContext<T>>;
  /**
   * Si `true`, el header es clickeable. Al click, la columna cicla
   * `null → asc → desc → null` y actualiza el `query` signal via
   * `BaseQueryParams.setSort(...)`. El padre NO necesita manejar nada.
   */
  sortable?: boolean;
  /**
   * Identificador enviado como `sortBy` (debe coincidir con la whitelist
   * del backend en `BaseQueryParams.sortableColumns()`). Si esta ausente
   * se usa `key`.
   */
  sortKey?: string;
  align?: TableAlign;
  width?: string;
  /**
   * Si `true` (default), esta columna participa en la busqueda
   * server-side (el campo `search` del `BaseQueryParams` se envia
   * al backend, el server decide que matchear).
   */
  searchable?: boolean;
  headerClassName?: string;
  cellClassName?: string;
}

/**
 * Accion de fila. Se renderiza como un `<UiIconButton>` por accion,
 * envuelto en un `<UiTooltip>` con `label`.
 */
export interface TableAction<T = unknown> {
  key: string;
  label: string;
  icon: Type<unknown>;
  onClick: (row: T, index: number) => void;
  disabled?: (row: T) => boolean;
  tooltipSide?: TooltipSide;
}

/**
 * Evento emitido cuando el usuario hace click en un header de columna
 * ordenable. `null` en `direction` representa "sin orden" (tercer click
 * quita el orden). El consumer decide si lo respeta o no.
 *
 * NOTA: en el modelo actual el UiTable aplica el sort automaticamente
 * sobre el `query` signal. Este tipo queda para usos donde el consumer
 * quiere suscribirse a los cambios (p.ej. logging).
 */
export interface TableSortEvent {
  key: string;
  direction: TableSortDirection | null;
}

/** Payload de `(rowSelect)`. */
export interface TableSelection<T = unknown> {
  rows: T[];
  keys: unknown[];
}
