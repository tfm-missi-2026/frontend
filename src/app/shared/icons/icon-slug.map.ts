import type { Type } from "@angular/core";

import { IconBoxComponent } from "./box-icon";
import { IconCalendarComponent } from "./calendar-icon";
import { IconCardComponent } from "./card-icon";
import { IconCheckComponent } from "./check-icon";
import { IconEditPencilComponent } from "./edit-pencil-icon";
import { IconSettingsComponent } from "./settings-icon";
import { IconUserCircleComponent } from "./user-circle-icon";

const ICON_BY_SLUG: Record<string, Type<unknown>> = {
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

export function resolveIconComponent(
  slug: string | null | undefined,
): Type<unknown> {
  if (!slug) return FALLBACK_ICON;
  return ICON_BY_SLUG[slug] ?? FALLBACK_ICON;
}