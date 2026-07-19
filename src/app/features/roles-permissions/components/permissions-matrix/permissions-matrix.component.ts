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
  templateUrl: "./permissions-matrix.component.html",
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
