import type { ModuloResponse } from "@core/modulos/modulo.models";

import { sortBy } from "@utils/collections";

import { resolveSidebarIcon } from "./sidebar-icon.map";
import type {
  NavItem,
  SidebarSubItem,
} from "./sidebar-nav-section/sidebar-nav.types";

// Rutas de dominio que YA existen como página en el SPA Angular. El backend
// entrega su propia `ruta` (p.ej. `/admin/usuarios`), pero el frontend solo
// tiene construidas estas (usuarios real + placeholders "no implementado");
// los módulos sin entrada aquí se marcan `pending` hasta que exista su página.
const RUTA_FRONTEND_POR_CODIGO: Record<string, string> = {
  USUARIOS: "/app/administracion/usuarios",
  ROLES: "/app/administracion/roles",
  CATALOGO: "/app/administracion/catalogo",
  MODULOS: "/app/administracion/modulos",
  DASHBOARD_GESTOR: "/app/operacion/dashboard",
  DASHBOARD_JEFE: "/app/operacion/dashboard-jefe",
  DASHBOARD_RECURSO: "/app/operacion/dashboard-recurso",
  PROYECTOS: "/app/operacion/proyectos",
  PLANIFICACION: "/app/operacion/planificacion",
  VARIACIONES: "/app/operacion/variaciones",
  CARGA_EQUIPO: "/app/operacion/carga-equipo",
  AVANCE: "/app/operacion/avance",
  BITACORA: "/app/seguimiento/mi-bitacora",
};

export interface SidebarNavConfig {
  title: string;
  sectionKey: string;
  items: NavItem[];
}

const SECTION_TITLE = "Navegación";

/**
 * Transforma el árbol plano de módulos autorizados por rol (`/api/modulos/
 * por-rol/{rolId}`) en una sección de navegación del sidebar: arma la
 * jerarquía padre/hijo por `moduloPadreId`, ordena por `orden` y resuelve el
 * icono. Un módulo padre con hijos ruteables se vuelve grupo colapsable; el
 * resto, enlace directo si su página existe o item `pending` si no.
 */
export function construirNavDesdeModulos(
  modulos: ModuloResponse[],
): SidebarNavConfig {
  const ordenados = sortBy(modulos, (m) => m.orden);
  const padres = ordenados.filter((m) => !m.moduloPadreId);

  const hijosPorPadre = new Map<string, ModuloResponse[]>();
  for (const modulo of ordenados) {
    if (!modulo.moduloPadreId) {
      continue;
    }
    const lista = hijosPorPadre.get(modulo.moduloPadreId) ?? [];
    lista.push(modulo);
    hijosPorPadre.set(modulo.moduloPadreId, lista);
  }

  const items: NavItem[] = padres.map((padre) => {
    const icon = resolveSidebarIcon(padre.icono);
    const hijos = hijosPorPadre.get(padre.id) ?? [];

    const subItems: SidebarSubItem[] = hijos
      .filter((hijo) => RUTA_FRONTEND_POR_CODIGO[hijo.codigo])
      .map((hijo) => ({
        name: hijo.nombre,
        path: RUTA_FRONTEND_POR_CODIGO[hijo.codigo],
      }));

    if (subItems.length > 0) {
      return { name: padre.nombre, icon, subItems };
    }

    const rutaPropia = RUTA_FRONTEND_POR_CODIGO[padre.codigo];
    if (rutaPropia) {
      return { name: padre.nombre, icon, path: rutaPropia };
    }

    // Página de dominio aún no construida en el frontend.
    return { name: padre.nombre, icon, pending: true };
  });

  return {
    title: SECTION_TITLE,
    sectionKey: "nav",
    items,
  };
}
