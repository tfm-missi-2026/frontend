import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiGridComponent } from "@shared/ui/grid";
import { UiCheckboxComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";

import type { ModuloResponse } from "@core/modulos/modulo.models";

@Component({
  selector: "PermissionsMatrix",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiCheckboxComponent,
    UiGridComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./permissions-matrix.component.html",
})
export class PermissionsMatrixComponent {
  readonly modules = input<ModuloResponse[]>([]);
  readonly selected = input<string[]>([]);
  readonly readonly = input<boolean>(false);
  readonly landingCodigo = input<string | null>(null);

  readonly selectedChange = output<string[]>();

  protected readonly enabledSet = computed<Set<string>>(
    () => new Set(this.selected()),
  );

  protected isEnabled(id: string): boolean {
    return this.enabledSet().has(id);
  }

  protected isLanding(id: string): boolean {
    return this.landingCodigo() === id;
  }

  protected cellClasses(id: string): string {
    return this.isEnabled(id)
      ? "border-brand-300 bg-brand-50/40 dark:border-brand-500/40 dark:bg-brand-500/10"
      : "border-dashed border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-white/[0.02] dark:hover:bg-white/5";
  }

  protected onToggle(codigo: string, checked: boolean): void {
    if (this.readonly()) return;
    if (!checked && this.isLanding(codigo)) return;
    const next = new Set(this.selected());
    if (checked) {
      next.add(codigo);
    } else {
      next.delete(codigo);
    }
    this.selectedChange.emit(Array.from(next));
  }
}