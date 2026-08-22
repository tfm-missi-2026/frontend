import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

import { IconTrashComponent, IconXComponent } from "@shared/icons";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import type { Role } from "../../models/role";

export interface RoleDeletePayload {
  id: string;
  motivoEliminacion: string;
}

const MOTIVO_MIN = 5;
const MOTIVO_MAX = 500;

@Component({
  selector: "RoleConfirmDeleteModal",
  standalone: true,
  imports: [
    IconTrashComponent,
    IconXComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
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

  protected readonly IconTrash = IconTrashComponent;
  protected readonly IconX = IconXComponent;

  protected readonly subtitleText = computed<string>(() => {
    const r = this.role();
    return r
      ? `Vas a eliminar el rol ${r.name}. Esta acción no se puede deshacer.`
      : "";
  });

  protected readonly motivo = signal<string>("");
  protected readonly motivoTouched = signal<boolean>(false);
  protected readonly submitAttempted = signal<boolean>(false);

  protected readonly motivoError = computed<string | undefined>(() => {
    const m = this.motivo().trim();
    if (m.length < MOTIVO_MIN)
      return `El motivo debe tener al menos ${MOTIVO_MIN} caracteres.`;
    if (m.length > MOTIVO_MAX)
      return `El motivo no puede superar ${MOTIVO_MAX} caracteres.`;
    return undefined;
  });

  protected readonly visibleMotivoError = computed<string | undefined>(() =>
    this.motivoTouched() || this.submitAttempted()
      ? this.motivoError()
      : undefined,
  );

  protected readonly isValid = computed<boolean>(
    () => this.motivoError() === undefined,
  );

  protected patchMotivo(value: string): void {
    this.motivo.set(value);
  }

  protected onMotivoBlur(): void {
    this.motivoTouched.set(true);
  }

  protected onCancel(): void {
    this.motivo.set("");
    this.motivoTouched.set(false);
    this.submitAttempted.set(false);
    this.close.emit();
  }

  protected onAction(side: "left" | "right"): void {
    if (side === "left") {
      this.onCancel();
    } else {
      this.onConfirm();
    }
  }

  protected onConfirm(): void {
    this.submitAttempted.set(true);
    const r = this.role();
    if (!r || !this.isValid()) return;
    this.confirm.emit({
      id: r.id,
      motivoEliminacion: this.motivo().trim(),
    });
    this.motivo.set("");
    this.motivoTouched.set(false);
    this.submitAttempted.set(false);
  }
}
