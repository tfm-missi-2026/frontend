import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiLabelComponent } from "@shared/ui/label";

import type { Role } from "../../models/role";
import { ROLE_KIND_LABELS, SYSTEM_MODULES } from "../../models/role";

@Component({
  selector: "RoleListPanel",
  standalone: true,
  imports: [UiBadgeComponent, UiLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p
      class="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
    >
      Roles del sistema
    </p>

    <div class="flex flex-col gap-2.5">
      @for (r of roles(); track r.id) {
        <button
          type="button"
          (click)="select.emit(r.id)"
          [class]="itemClasses(r.id)"
          [attr.aria-pressed]="r.id === selectedId()"
        >
          <UiBadge
            [variant]="r.id === selectedId() ? 'solid' : 'light'"
            [color]="r.id === selectedId() ? 'dark' : 'light'"
            size="sm"
          >
            {{ r.code }}
          </UiBadge>
          <div class="min-w-0 flex-1 text-left">
            <UiLabel
              type="bodyS"
              color="textStrong"
              weight="semibold"
              [text]="r.name"
            />
            <UiLabel
              type="bodyXs"
              color="textWeak"
              [text]="metaLine(r)"
            />
          </div>
          @if (r.id === selectedId()) {
            <span class="text-base text-brand-500" aria-hidden="true">
              ›
            </span>
          }
        </button>
      } @empty {
        <UiLabel
          type="bodyS"
          color="textWeak"
          text="No hay roles definidos."
        />
      }
    </div>
  `,
})
export class RoleListPanelComponent {
  readonly roles = input<Role[]>([]);
  readonly selectedId = input<string | null>(null);

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
    const total = SYSTEM_MODULES.length;
    return `${r.users} usuarios · ${r.permissions.length}/${total} módulos · ${ROLE_KIND_LABELS[r.kind]}`;
  }
}
