import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

import { UiButtonComponent } from "@shared/ui/button";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import type { Role } from "../../models/role";

export interface RoleDeletePayload {
  id: string;
  motivoEliminacion: string;
}

@Component({
  selector: "RoleConfirmDeleteModal",
  standalone: true,
  imports: [
    UiButtonComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiModalComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./role-confirm-delete-modal.component.html",
})
export class RoleConfirmDeleteModalComponent {
  readonly role = input<Role | null>(null);
  readonly isOpen = input<boolean>(false);

  readonly close = output<void>();
  readonly confirm = output<RoleDeletePayload>();

  protected readonly motivo = signal<string>("");

  protected readonly motivoError = computed<string | undefined>(() => {
    const m = this.motivo().trim();
    if (m.length < 5) return "El motivo debe tener al menos 5 caracteres.";
    if (m.length > 500) return "El motivo no puede superar 500 caracteres.";
    return undefined;
  });

  protected readonly isValid = computed<boolean>(
    () => this.motivoError() === undefined,
  );

  protected patchMotivo(value: string): void {
    this.motivo.set(value);
  }

  protected onCancel(): void {
    this.motivo.set("");
    this.close.emit();
  }

  protected onConfirm(): void {
    const r = this.role();
    if (!r || !this.isValid()) return;
    this.confirm.emit({
      id: r.id,
      motivoEliminacion: this.motivo().trim(),
    });
    this.motivo.set("");
  }
}