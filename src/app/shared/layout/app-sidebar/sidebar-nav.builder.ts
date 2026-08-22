import type { ModuloResponse } from "@core/modulos/modulo.models";
import { resolverRegistroModulo } from "@core/modulos/modulo.registry";
import { environment } from "@env/environment";

import { sortBy } from "@utils/collections";

import type { NavItem } from "./sidebar-nav-section/sidebar-nav.types";

export interface SidebarNavSection {
  sectionKey: string;
  title: string;
  orden: number;
  items: NavItem[];
}

export function construirNavDesdeModulos(
  modulos: ModuloResponse[],
): SidebarNavSection[] {
  const secciones = new Map<string, ModuloResponse>();
  const itemsPorSeccion = new Map<string, ModuloResponse[]>();

  for (const m of modulos) {
    if (m.estado !== 1) continue;
    if (m.tipo === "SECTION") {
      if (m.seccion) secciones.set(m.seccion, m);
      continue;
    }
    const registro = resolverRegistroModulo(m.codigo);
    if (!registro) {
      if (!environment.production) {
        console.warn(
          `[sidebar] modulo "${m.codigo}" sin pagina registrada en MODULO_REGISTRY`,
        );
      }
      continue;
    }
    const seccion = m.seccion ?? "";
    const lista = itemsPorSeccion.get(seccion) ?? [];
    lista.push(m);
    itemsPorSeccion.set(seccion, lista);
  }

  const sections: SidebarNavSection[] = [];
  for (const [seccion, lista] of itemsPorSeccion.entries()) {
    const seccionModulo = secciones.get(seccion);
    const items: NavItem[] = sortBy(lista, (m) => m.orden ?? 0).map((m) => ({
      name: m.nombre,
      iconKey: m.icono,
      path: resolverRegistroModulo(m.codigo)?.path,
    }));
    sections.push({
      sectionKey: seccion.toLowerCase(),
      title: seccionModulo?.nombre ?? seccion,
      orden: seccionModulo?.orden ?? 99,
      items,
    });
  }

  return sections.sort((a, b) => a.orden - b.orden);
}