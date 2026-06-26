import type { Type } from "@angular/core";

import {
  IconBoxComponent,
  IconCalendarComponent,
  IconCardComponent,
  IconCheckComponent,
  IconEditPencilComponent,
  IconSettingsComponent,
  IconUserCircleComponent,
} from "@shared/icons";

/**
 * Traduce el `icono` (string) que entrega el backend (`msa_modulo.icono`)
 * al componente Icon del design system. El set actual proviene de una
 * plantilla e-commerce y no tiene equivalentes exactos de varios iconos de
 * dominio (home, folder, shield, server, layers, grid…); por eso el mapeo es
 * aproximado y cae a `FALLBACK_ICON` cuando no hay correspondencia.
 */
const ICON_MAP: Record<string, Type<unknown>> = {
  home: IconCardComponent,
  folder: IconBoxComponent,
  journal: IconCalendarComponent,
  users: IconUserCircleComponent,
  user: IconUserCircleComponent,
  edit: IconEditPencilComponent,
  archive: IconBoxComponent,
  settings: IconSettingsComponent,
  server: IconBoxComponent,
  layers: IconBoxComponent,
  check: IconCheckComponent,
  shield: IconSettingsComponent,
  list: IconBoxComponent,
  grid: IconCardComponent,
};

export const FALLBACK_ICON: Type<unknown> = IconBoxComponent;

export function resolveSidebarIcon(
  icono: string | null | undefined,
): Type<unknown> {
  if (!icono) {
    return FALLBACK_ICON;
  }
  return ICON_MAP[icono] ?? FALLBACK_ICON;
}
