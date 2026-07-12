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
  template: `
    <UiModal
      [isOpen]="isOpen()"
      [showCloseButton]="false"
      className="max-w-120 p-6 lg:p-8"
      (close)="onCancel()"
    >
      <h2 class="mb-1 text-xl font-semibold text-gray-800 dark:text-white/90">
        Nuevo rol
      </h2>
      <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Define un rol. Sus permisos de módulo se configuran después de crearlo.
      </p>

      <div class="mb-4">
        <UiFormLabel
          labelText="Código"
          [required]="true"
          [labelFor]="'role-code'"
        />
        <UiInput
          id="role-code"
          placeholder="p. ej. GP — corto, único"
          [value]="form().code"
          (valueChange)="patch({ code: $event })"
          [errorMessage]="errors().code"
        />
        @if (!errors().code) {
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Identificador corto del rol (2–4 letras).
          </p>
        }
        <UiFieldError [message]="errors().code" />
      </div>

      <div class="mb-4">
        <UiFormLabel
          labelText="Nombre"
          [required]="true"
          [labelFor]="'role-name'"
        />
        <UiInput
          id="role-name"
          placeholder="p. ej. Gestor de Proyecto"
          [value]="form().name"
          (valueChange)="patch({ name: $event })"
          [errorMessage]="errors().name"
        />
        <UiFieldError [message]="errors().name" />
      </div>

      <div class="mb-4">
        <UiFormLabel labelText="Descripción" [labelFor]="'role-desc'" />
        <UiTextArea
          id="role-desc"
          [rows]="3"
          placeholder="¿Qué hace este rol dentro de SPSRT?"
          [value]="form().description"
          (valueChange)="patch({ description: $event })"
        />
      </div>

      <UiFlex
        direction="row"
        justifyContent="end"
        [gap]="2"
        className="mt-4 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800"
      >
        <UiButton
          variant="secondary"
          labelText="Cancelar"
          (click)="onCancel()"
        />
        <UiButton
          variant="primary"
          labelText="Crear rol"
          [disabled]="!isValid()"
          (click)="onSave()"
        />
      </UiFlex>
    </UiModal>
  `,
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
