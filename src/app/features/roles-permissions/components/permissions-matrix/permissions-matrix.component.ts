import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { UiCheckboxComponent } from "@shared/ui/input";

import type { SystemModule } from "../../models/role";
import { SYSTEM_MODULES } from "../../models/role";

@Component({
  selector: "PermissionsMatrix",
  standalone: true,
  imports: [UiCheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-x-6"
      role="group"
      aria-label="Módulos visibles / permisos"
    >
      @for (m of modules; track m.id) {
        <label
          class="flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors"
          [class]="cellClasses(m.id)"
        >
          <UiCheckbox
            [checked]="isEnabled(m.id)"
            [disabled]="readonly()"
            (checkedChange)="onToggle(m.id, $event)"
          />
          <span
            class="flex-1 font-medium text-gray-800 dark:text-white/90"
          >
            {{ m.label }}
          </span>
          @if (m.adminOnly) {
            <span
              class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-white/5 dark:text-gray-400"
            >
              solo Admin
            </span>
          }
        </label>
      }
    </div>
  `,
})
export class PermissionsMatrixComponent {
  /** IDs de módulos actualmente habilitados. */
  readonly selected = input<string[]>([]);
  /** Si `true`, los switches quedan deshabilitados. */
  readonly readonly = input<boolean>(false);

  readonly selectedChange = output<string[]>();

  protected readonly modules: SystemModule[] = SYSTEM_MODULES;

  protected readonly enabledSet = computed<Set<string>>(
    () => new Set(this.selected()),
  );

  protected isEnabled(id: string): boolean {
    return this.enabledSet().has(id);
  }

  protected cellClasses(id: string): string {
    return this.isEnabled(id)
      ? "border-brand-300 bg-brand-50/40 dark:border-brand-500/40 dark:bg-brand-500/10"
      : "border-dashed border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.02] dark:hover:bg-white/5";
  }

  protected onToggle(id: string, checked: boolean): void {
    if (this.readonly()) return;
    const next = new Set(this.selected());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selectedChange.emit(Array.from(next));
  }
}
