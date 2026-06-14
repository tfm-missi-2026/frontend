import { TemplateRef, Type } from '@angular/core';

import { TooltipSide } from '@ui/tooltip/tooltip.types';

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
export type TableAlign = 'start' | 'center' | 'end';

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
  /** Key del campo en el row. Se usa como id estable y para `trackBy` por defecto. */
  key: string;
  /** Texto del header. */
  header: string;
  /** Template opcional para render custom de la celda. */
  cell?: TemplateRef<TableCellContext<T>>;
  /** Marca la columna como ordenable (visual; el ordenamiento real es del consumer). */
  sortable?: boolean;
  /** Alineación horizontal del header y las celdas. Default `'start'`. */
  align?: TableAlign;
  /** Ancho CSS de la columna (`'120px'`, `'20%'`, etc.). */
  width?: string;
  /** Si `true` (default), esta columna participa en la búsqueda client-side. */
  searchable?: boolean;
  /** Clases extra para el `<th>`. */
  headerClassName?: string;
  /** Clases extra para los `<td>` de esta columna. */
  cellClassName?: string;
}

/**
 * Acción de fila. Se renderiza como un `<UiIconButton>` por acción,
 * envuelto en un `<UiTooltip>` con `label`.
 */
export interface TableAction<T = unknown> {
  /** Key estable (id de la acción). */
  key: string;
  /** Texto del tooltip. */
  label: string;
  /** Componente ícono a renderizar dentro del botón. */
  icon: Type<unknown>;
  /** Callback invocado al hacer click. */
  onClick: (row: T, index: number) => void;
  /** Predicado de deshabilitado (opcional). */
  disabled?: (row: T) => boolean;
  /** Lado del tooltip. Default `'top'` (las acciones suelen estar en la última columna). */
  tooltipSide?: TooltipSide;
}

/** Evento emitido cuando cambia la página o el page size. */
export interface TablePageEvent {
  page: number;
  pageSize: number;
}

/** Payload de `(rowSelect)`. */
export interface TableSelection<T = unknown> {
  rows: T[];
  keys: unknown[];
}
