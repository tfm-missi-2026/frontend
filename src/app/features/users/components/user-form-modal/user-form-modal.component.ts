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

import { IconCheckComponent, IconXComponent } from "@shared/icons";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiCheckboxComponent } from "@shared/ui/input/checkbox";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import { UiSurfaceComponent } from "@shared/ui/surface";

import {
  emptyUserForm,
  type UserFormSavePayload,
} from "../../models/user-form";
import type { User, UserRole, UserStatus } from "../../models/user";
import { USER_ROLE_OPTIONS } from "../../models/user";

export type UserFormMode = "create" | "edit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 80;
const PASSWORD_MIN = 8;

@Component({
  selector: "UserFormModal",
  standalone: true,
  imports: [
    FormsModule,
    UiBadgeComponent,
    UiFlexComponent,
    UiGridComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSelectComponent,
    UiSurfaceComponent,
    UiFieldErrorComponent,
    UiFormLabelComponent,
    UiCheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-form-modal.component.html",
})
export class UserFormModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly mode = input<UserFormMode>("create");
  readonly user = input<User | null>(null);
  readonly saving = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<UserFormSavePayload>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;
  protected readonly roleOptions = USER_ROLE_OPTIONS;

  protected readonly form = signal(emptyUserForm());

  protected readonly firstNameTouched = signal<boolean>(false);
  protected readonly lastNamePaternalTouched = signal<boolean>(false);
  protected readonly lastNameMaternalTouched = signal<boolean>(false);
  protected readonly emailTouched = signal<boolean>(false);
  protected readonly roleTouched = signal<boolean>(false);
  protected readonly initialPasswordTouched = signal<boolean>(false);
  protected readonly submitAttempted = signal<boolean>(false);

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
      this.resetTouched();
      if (m === "edit" && u) {
        this.form.set({
          firstName: u.firstName,
          lastNamePaternal: u.lastNamePaternal,
          lastNameMaternal: u.lastNameMaternal,
          email: u.email,
          role: u.role,
          status: u.status,
          initialPassword: "",
        });
      } else {
        this.form.set(emptyUserForm());
      }
    });
  }

  private resetTouched(): void {
    this.firstNameTouched.set(false);
    this.lastNamePaternalTouched.set(false);
    this.lastNameMaternalTouched.set(false);
    this.emailTouched.set(false);
    this.roleTouched.set(false);
    this.initialPasswordTouched.set(false);
    this.submitAttempted.set(false);
  }

  protected readonly firstNameError = computed<string | undefined>(() => {
    const n = this.form().firstName.trim();
    if (!n) return "El nombre es obligatorio.";
    if (n.length > NAME_MAX)
      return `El nombre no puede superar ${NAME_MAX} caracteres.`;
    return undefined;
  });

  protected readonly lastNamePaternalError = computed<string | undefined>(
    () => {
      const n = this.form().lastNamePaternal.trim();
      if (!n) return "El apellido paterno es obligatorio.";
      if (n.length > NAME_MAX)
        return `El apellido no puede superar ${NAME_MAX} caracteres.`;
      return undefined;
    },
  );

  protected readonly lastNameMaternalError = computed<string | undefined>(
    () => {
      const n = this.form().lastNameMaternal.trim();
      if (!n) return "El apellido materno es obligatorio.";
      if (n.length > NAME_MAX)
        return `El apellido no puede superar ${NAME_MAX} caracteres.`;
      return undefined;
    },
  );

  protected readonly emailError = computed<string | undefined>(() => {
    const e = this.form().email.trim();
    if (!e) return "El correo es obligatorio.";
    if (!EMAIL_PATTERN.test(e)) return "Ingresa un correo electrónico válido.";
    return undefined;
  });

  protected readonly roleError = computed<string | undefined>(() =>
    this.form().role ? undefined : "Selecciona un rol para el usuario.",
  );

  protected readonly initialPasswordError = computed<string | undefined>(() => {
    const p = this.form().initialPassword ?? "";
    if (this.mode() !== "create") return undefined;
    if (p.length < PASSWORD_MIN)
      return `La contraseña inicial debe tener al menos ${PASSWORD_MIN} caracteres.`;
    return undefined;
  });

  protected readonly shouldShow = computed<{
    firstName: boolean;
    lastNamePaternal: boolean;
    lastNameMaternal: boolean;
    email: boolean;
    role: boolean;
    initialPassword: boolean;
  }>(() => ({
    firstName: this.firstNameTouched() || this.submitAttempted(),
    lastNamePaternal: this.lastNamePaternalTouched() || this.submitAttempted(),
    lastNameMaternal: this.lastNameMaternalTouched() || this.submitAttempted(),
    email: this.emailTouched() || this.submitAttempted(),
    role: this.roleTouched() || this.submitAttempted(),
    initialPassword: this.initialPasswordTouched() || this.submitAttempted(),
  }));

  protected readonly visibleFirstNameError = computed<string | undefined>(() =>
    this.shouldShow().firstName ? this.firstNameError() : undefined,
  );
  protected readonly visibleLastNamePaternalError = computed<
    string | undefined
  >(() =>
    this.shouldShow().lastNamePaternal
      ? this.lastNamePaternalError()
      : undefined,
  );
  protected readonly visibleLastNameMaternalError = computed<
    string | undefined
  >(() =>
    this.shouldShow().lastNameMaternal
      ? this.lastNameMaternalError()
      : undefined,
  );
  protected readonly visibleEmailError = computed<string | undefined>(() =>
    this.shouldShow().email ? this.emailError() : undefined,
  );
  protected readonly visibleRoleError = computed<string | undefined>(() =>
    this.shouldShow().role ? this.roleError() : undefined,
  );
  protected readonly visibleInitialPasswordError = computed<string | undefined>(
    () =>
      this.shouldShow().initialPassword
        ? this.initialPasswordError()
        : undefined,
  );

  protected readonly isValid = computed<boolean>(() => {
    return (
      this.firstNameError() === undefined &&
      this.lastNamePaternalError() === undefined &&
      this.lastNameMaternalError() === undefined &&
      this.emailError() === undefined &&
      this.roleError() === undefined &&
      this.initialPasswordError() === undefined
    );
  });

  protected patch(partial: Partial<ReturnType<typeof emptyUserForm>>): void {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  protected onFirstNameBlur(): void {
    this.firstNameTouched.set(true);
  }

  protected onLastNamePaternalBlur(): void {
    this.lastNamePaternalTouched.set(true);
  }

  protected onLastNameMaternalBlur(): void {
    this.lastNameMaternalTouched.set(true);
  }

  protected onEmailBlur(): void {
    this.emailTouched.set(true);
  }

  protected onRoleChange(value: unknown): void {
    this.roleTouched.set(true);
    this.patch({
      role: value == null || value === "" ? null : (value as UserRole),
    });
  }

  protected onActiveToggle(checked: boolean): void {
    this.patch({ status: checked ? "active" : "inactive" });
  }

  protected onInitialPasswordBlur(): void {
    this.initialPasswordTouched.set(true);
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onAction(side: "left" | "right"): void {
    if (side === "left") {
      this.onCancel();
    } else {
      this.onSave();
    }
  }

  protected onSave(): void {
    this.submitAttempted.set(true);
    const f = this.form();
    if (!this.isValid() || f.role === null) {
      return;
    }

    const m = this.mode();
    const u = this.user();
    if (m === "create") {
      this.save.emit({
        mode: "create",
        data: {
          firstName: f.firstName.trim(),
          lastNamePaternal: f.lastNamePaternal.trim(),
          lastNameMaternal: f.lastNameMaternal.trim(),
          email: f.email.trim(),
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
          firstName: f.firstName.trim(),
          lastNamePaternal: f.lastNamePaternal.trim(),
          lastNameMaternal: f.lastNameMaternal.trim(),
          email: f.email.trim(),
          role: f.role,
          status: f.status,
        },
      });
    }
  }
}
