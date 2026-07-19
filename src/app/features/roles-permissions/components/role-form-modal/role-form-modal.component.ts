import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";

import { UiButtonComponent } from "@shared/ui/button";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiInputComponent } from "@shared/ui/input";
import { UiModalComponent } from "@shared/ui/modal";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import type { RoleFormData } from "../../models/role";
import { emptyRoleForm } from "../../models/role";

export type RoleFormSavePayload = {
  data: RoleFormData;
};

@Component({
  selector: "RoleFormModal",
  standalone: true,
  imports: [
    UiButtonComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiInputComponent,
    UiModalComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./role-form-modal.component.html",
})
export class RoleFormModalComponent {
  readonly isOpen = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<RoleFormSavePayload>();

  protected readonly form = signal<RoleFormData>(emptyRoleForm());

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        this.form.set(emptyRoleForm());
      }
    });
  }

  protected readonly errors = computed<{ code?: string; name?: string }>(() => {
    const f = this.form();
    const out: { code?: string; name?: string } = {};
    if (!f.code.trim()) {
      out.code = "El código es obligatorio.";
    } else if (!/^[A-Za-z0-9]{2,4}$/.test(f.code.trim())) {
      out.code = "Usa 2 a 4 caracteres alfanuméricos.";
    }
    if (!f.name.trim()) {
      out.name = "El nombre es obligatorio.";
    }
    return out;
  });

  protected readonly isValid = computed<boolean>(() => {
    const e = this.errors();
    return !e.code && !e.name;
  });

  protected patch(partial: Partial<RoleFormData>): void {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    if (!this.isValid()) return;
    this.save.emit({ data: this.form() });
  }
}
