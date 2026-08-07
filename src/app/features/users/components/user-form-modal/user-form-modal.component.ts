import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiAlertComponent } from "@shared/ui/alert";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiRadioComponent } from "@shared/ui/radio";
import { UiSelectComponent } from "@shared/ui/select";
import { UiSurfaceComponent } from "@shared/ui/surface";

import {
  emptyUserForm,
  type UserFormSavePayload,
} from "../../models/user-form";
import type { User, UserRole, UserStatus } from "../../models/user";
import { USER_ROLE_OPTIONS } from "../../models/user";

export type UserFormMode = "create" | "edit";

@Component({
  selector: "UserFormModal",
  standalone: true,
  imports: [
    FormsModule,
    UiAlertComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiGridComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiRadioComponent,
    UiSelectComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-form-modal.component.html",
})
export class UserFormModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly mode = input<UserFormMode>("create");
  readonly user = input<User | null>(null);

  readonly close = output<void>();
  readonly save = output<UserFormSavePayload>();

  protected readonly roleOptions = USER_ROLE_OPTIONS;

  protected readonly form = signal(emptyUserForm());
  protected readonly validationMessage = signal<string | null>(null);

  protected readonly heading = computed<string>(() =>
    this.mode() === "create" ? "Nuevo usuario" : "Editar usuario",
  );
  protected readonly subheading = computed<string>(() =>
    this.mode() === "create"
      ? "Complete los datos. Los campos quedan en estado borrador hasta guardar."
      : "Modifique los datos del usuario y guarde los cambios.",
  );

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      const u = this.user();
      const m = this.mode();
      if (m === "edit" && u) {
        this.form.set({
          firstName: u.firstName,
          lastNamePaternal: u.lastNamePaternal,
          lastNameMaternal: u.lastNameMaternal,
          email: u.email,
          role: u.role,
          status: u.status,
        });
      } else {
        this.form.set(emptyUserForm());
      }
    });
  }

  protected patch(partial: Partial<ReturnType<typeof emptyUserForm>>): void {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  protected onRoleChange(value: unknown): void {
    this.patch({ role: value as UserRole });
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    const f = this.form();
    const m = this.mode();
    const validationMessage = this.validate(f, m);
    if (validationMessage) {
      this.validationMessage.set(validationMessage);
      return;
    }

    const u = this.user();
    if (m === "create") {
      this.save.emit({
        mode: "create",
        data: {
          firstName: f.firstName,
          lastNamePaternal: f.lastNamePaternal,
          lastNameMaternal: f.lastNameMaternal,
          email: f.email,
          role: f.role,
          status: f.status,
          initialPassword: f.initialPassword ?? "",
        },
      });
    } else if (u) {
      this.save.emit({
        mode: "edit",
        id: u.id,
        data: {
          firstName: f.firstName,
          lastNamePaternal: f.lastNamePaternal,
          lastNameMaternal: f.lastNameMaternal,
          email: f.email,
          role: f.role,
          status: f.status,
        },
      });
    }
  }

  private validate(
    form: ReturnType<typeof emptyUserForm>,
    mode: UserFormMode,
  ): string | null {
    const requiredValues = [
      form.firstName,
      form.lastNamePaternal,
      form.lastNameMaternal,
      form.email,
    ];
    if (requiredValues.some((value) => !value.trim())) {
      return "Completa nombres, apellidos y correo electrónico antes de guardar.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Ingresa un correo electrónico válido.";
    }
    if (mode === "create" && (form.initialPassword?.length ?? 0) < 8) {
      return "La contraseña inicial debe tener al menos 8 caracteres.";
    }
    return null;
  }
}
