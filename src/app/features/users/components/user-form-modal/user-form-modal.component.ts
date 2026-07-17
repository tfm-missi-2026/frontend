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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiModal
      [isOpen]="isOpen()"
      [showCloseButton]="false"
      className="max-w-140 p-6 lg:p-8"
      (close)="onCancel()"
    >
      <UiLabel
        type="HeadingM"
        color="textStrong"
        weight="semibold"
        className="mb-1"
      >
        {{ heading() }}
      </UiLabel>
      <UiLabel type="bodyS" color="textWeak" className="mb-5">
        {{ subheading() }}
      </UiLabel>

      @if (validationMessage()) {
        <UiAlert
          variant="error"
          title="Revisa los datos del usuario"
          [message]="validationMessage() ?? ''"
          className="mb-4"
        />
      }

      <div class="mb-4">
        <UiLabel
          type="bodyXs"
          color="textStrong"
          weight="medium"
          className="mb-2 block uppercase"
        >
          Nombres
        </UiLabel>
        <UiInput
          placeholder="p. ej. Ana María"
          [value]="form().firstName"
          (valueChange)="patch({ firstName: $event })"
        />
      </div>

      <UiGrid [columns]="2" gap="14px" className="mb-4">
        <div>
          <UiLabel
            type="bodyXs"
            color="textStrong"
            weight="medium"
            className="mb-2 block uppercase"
          >
            Apellido paterno
          </UiLabel>
          <UiInput
            placeholder="p. ej. Quispe"
            [value]="form().lastNamePaternal"
            (valueChange)="patch({ lastNamePaternal: $event })"
          />
        </div>
        <div>
          <UiLabel
            type="bodyXs"
            color="textStrong"
            weight="medium"
            className="mb-2 block uppercase"
          >
            Apellido materno
          </UiLabel>
          <UiInput
            placeholder="p. ej. Rojas"
            [value]="form().lastNameMaternal"
            (valueChange)="patch({ lastNameMaternal: $event })"
          />
        </div>
      </UiGrid>

      <div class="mb-4">
        <UiLabel
          type="bodyXs"
          color="textStrong"
          weight="medium"
          className="mb-2 block uppercase"
        >
          Correo electrónico
        </UiLabel>
        <UiInput
          type="email"
          placeholder="nombre.apellido@institucion.gob.pe"
          [value]="form().email"
          (valueChange)="patch({ email: $event })"
        />
      </div>

      <UiGrid [columns]="2" gap="14px" className="mb-4">
        <div>
          <UiLabel
            type="bodyXs"
            color="textStrong"
            weight="medium"
            className="mb-2 block uppercase"
          >
            Rol
          </UiLabel>
          <UiSelect
            [options]="roleOptions"
            [searchable]="false"
            [ngModel]="form().role"
            (ngModelChange)="onRoleChange($event)"
          />
        </div>
        <div>
          <UiLabel
            type="bodyXs"
            color="textStrong"
            weight="medium"
            className="mb-2 block uppercase"
          >
            Estado
          </UiLabel>
          <UiFlex
            direction="row"
            alignItems="center"
            [gap]="16"
            className="pt-1.5"
          >
            <UiRadio
              name="user-status"
              value="active"
              [checked]="form().status === 'active'"
              label="Activo"
              (valueChange)="patch({ status: 'active' })"
            />
            <UiRadio
              name="user-status"
              value="inactive"
              [checked]="form().status === 'inactive'"
              label="Inactivo"
              (valueChange)="patch({ status: 'inactive' })"
            />
          </UiFlex>
        </div>
      </UiGrid>

      @if (mode() === "create") {
        <div
          class="mb-4 rounded-xl border border-dashed border-gray-300 p-3 dark:border-gray-700"
        >
          <UiFlex
            direction="row"
            alignItems="center"
            [justifyContent]="'between'"
            className="mb-2"
          >
            <UiLabel
              type="bodyXs"
              color="textStrong"
              weight="medium"
              className="uppercase"
            >
              Contraseña inicial
            </UiLabel>
            <UiBadge variant="light" color="info" size="sm">
              Solo en alta
            </UiBadge>
          </UiFlex>
          <UiInput
            type="password"
            placeholder="••••••••"
            [showPasswordToggle]="true"
            [value]="form().initialPassword ?? ''"
            (valueChange)="patch({ initialPassword: $event })"
          />
          <UiLabel type="bodyXs" color="textWeak" className="mt-2 block">
            Al editar un usuario existente este campo no aparece; la contraseña
            se cambia desde “Restablecer”.
          </UiLabel>
        </div>
      }

      <UiFlex
        direction="row"
        [justifyContent]="'end'"
        [gap]="8"
        className="mt-4 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800"
      >
        <UiButton
          variant="secondary"
          labelText="Cancelar"
          (click)="onCancel()"
        />
        <UiButton variant="primary" labelText="Guardar" (click)="onSave()" />
      </UiFlex>
    </UiModal>
  `,
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
