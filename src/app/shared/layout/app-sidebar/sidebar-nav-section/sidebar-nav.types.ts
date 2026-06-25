import type { Type } from '@angular/core';

/** Sub-item ruteable de un `NavItem`. */
export interface SidebarSubItem {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
}

/**
 * Item del sidebar. Puede ser un enlace directo (`path`) o un grupo
 * colapsable de sub-items (`subItems`). El `icon` es la clase del
 * componente Icon a renderizar (e.g. `IconCalendarComponent`).
 */
export interface NavItem {
  name: string;
  icon: Type<unknown>;
  path?: string;
  new?: boolean;
  /**
   * Marca el item como pendiente de implementación. Se renderiza con
   * estilos atenuados y la etiqueta "pendiente", sin acción al click.
   */
  pending?: boolean;
  subItems?: SidebarSubItem[];
}