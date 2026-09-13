import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { IconChevronRightComponent } from "@shared/icons";

import type { Role } from "../../models/role";

@Component({
  selector: "RoleListPanel",
  standalone: true,
  imports: [
    IconChevronRightComponent,
    UiBadgeComponent,
    UiFlexComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./role-list-panel.component.html",
})
export class RoleListPanelComponent {
  readonly roles = input<Role[]>([]);
  readonly selectedId = input<string | null>(null);
  readonly totalModules = input<number>(0);

  readonly select = output<string>();

  protected itemClasses(id: string): string {
    const base =
      "flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors dark:border-gray-800 dark:bg-white/[0.03]";
    const selected =
      id === this.selectedId()
        ? " border-brand-500 bg-brand-50 ring-1 ring-brand-500/30 dark:border-brand-500/50 dark:bg-brand-500/10"
        : " hover:bg-gray-50 dark:hover:bg-white/5";
    return `${base}${selected}`;
  }

  protected metaLine(r: Role): string {
    const total = this.totalModules();
    const kindLabel = r.sistema ? "Sistema" : "Personalizado";
    return `${r.users} usuarios · ${r.permissions.length}/${total} módulos · ${kindLabel}`;
  }
}