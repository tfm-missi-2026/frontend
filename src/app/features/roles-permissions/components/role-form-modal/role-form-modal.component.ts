import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { LookupsService } from "@core/lookups/lookups.service";
import { resolverRegistroModulo } from "@core/modulos/modulo.registry";
import type { ModuloResponse } from "@core/modulos/modulo.models";
import { IconCheckComponent, IconXComponent } from "@shared/icons";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import { PermissionsMatrixComponent } from "../permissions-matrix/permissions-matrix.component";
import type { RoleFormData } from "../../models/role";
import { emptyRoleForm } from "../../models/role";

export type RoleFormSavePayload = {
  data: RoleFormData;
  permisos: string[];
};

const CODE_PATTERN = /^[A-Za-z0-9]{2,4}$/;
const NAME_MAX = 100;
const DESCRIPTION_MAX = 500;

@Component({
  selector: "RoleFormModal",
  standalone: true,
  imports: [
    FormsModule,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSelectComponent,
    UiTextAreaComponent,
    PermissionsMatrixComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./role-form-modal.component.html",
})
export class RoleFormModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly modules = input<ModuloResponse[]>([]);
  readonly saving = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<RoleFormSavePayload>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;

  private readonly lookups = inject(LookupsService);

  protected readonly form = signal<RoleFormData>(emptyRoleForm());
  protected readonly permisos = signal<string[]>([]);
  protected readonly codeTouched = signal<boolean>(false);
  protected readonly nameTouched = signal<boolean>(false);
  protected readonly descriptionTouched = signal<boolean>(false);
  protected readonly paginaInicioTouched = signal<boolean>(false);
  protected readonly submitAttempted = signal<boolean>(false);

  protected readonly moduloOpciones = computed<SelectOption[]>(() =>
    this.lookups
      .modulos()
      .filter(
        (m) =>
          m.estado === 1 &&
          m.tipo !== "SECTION" &&
          resolverRegistroModulo(m.codigo) !== undefined,
      )
      .map((m) => ({ value: m.id, label: m.nombre })),
  );

  protected readonly landingCodigo = computed<string | null>(() => {
    const id = this.form().paginaInicioId;
    if (!id) return null;
    return this.lookups.modulos().find((m) => m.id === id)?.codigo ?? null;
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        this.form.set(emptyRoleForm());
        this.permisos.set([]);
        this.resetTouched();
      }
    });
  }

  private resetTouched(): void {
    this.codeTouched.set(false);
    this.nameTouched.set(false);
    this.descriptionTouched.set(false);
    this.paginaInicioTouched.set(false);
    this.submitAttempted.set(false);
  }

  protected readonly errors = computed<{
    code?: string;
    name?: string;
    description?: string;
    paginaInicioId?: string;
  }>(() => {
    const f = this.form();
    const out: {
      code?: string;
      name?: string;
      description?: string;
      paginaInicioId?: string;
    } = {};
    const code = f.code.trim();
    if (!code) {
      out.code = "El código es obligatorio.";
    } else if (!CODE_PATTERN.test(code)) {
      out.code = "Usa 2 a 4 caracteres alfanuméricos sin espacios.";
    }
    const name = f.name.trim();
    if (!name) {
      out.name = "El nombre es obligatorio.";
    } else if (name.length > NAME_MAX) {
      out.name = `El nombre no puede superar ${NAME_MAX} caracteres.`;
    }
    const description = f.description.trim();
    if (description.length > DESCRIPTION_MAX) {
      out.description = `La descripción no puede superar ${DESCRIPTION_MAX} caracteres.`;
    }
    if (!f.paginaInicioId) {
      out.paginaInicioId = "Selecciona la página de inicio del rol.";
    }
    return out;
  });

  protected readonly shouldShow = computed<{
    code: boolean;
    name: boolean;
    description: boolean;
    paginaInicioId: boolean;
  }>(() => ({
    code: this.codeTouched() || this.submitAttempted(),
    name: this.nameTouched() || this.submitAttempted(),
    description: this.descriptionTouched() || this.submitAttempted(),
    paginaInicioId: this.paginaInicioTouched() || this.submitAttempted(),
  }));

  protected readonly visibleErrors = computed<{
    code?: string;
    name?: string;
    description?: string;
    paginaInicioId?: string;
  }>(() => {
    const e = this.errors();
    const s = this.shouldShow();
    const out: {
      code?: string;
      name?: string;
      description?: string;
      paginaInicioId?: string;
    } = {};
    if (s.code && e.code) out.code = e.code;
    if (s.name && e.name) out.name = e.name;
    if (s.description && e.description) out.description = e.description;
    if (s.paginaInicioId && e.paginaInicioId)
      out.paginaInicioId = e.paginaInicioId;
    return out;
  });

  protected readonly isValid = computed<boolean>(() => {
    const e = this.errors();
    return !e.code && !e.name && !e.description && !e.paginaInicioId;
  });

  protected patch(partial: Partial<RoleFormData>): void {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  protected onCodeBlur(): void {
    this.codeTouched.set(true);
  }

  protected onNameBlur(): void {
    this.nameTouched.set(true);
  }

  protected onDescriptionBlur(): void {
    this.descriptionTouched.set(true);
  }

  protected onPaginaInicioBlur(): void {
    this.paginaInicioTouched.set(true);
  }

  protected onPaginaInicioChange(value: unknown): void {
    this.paginaInicioTouched.set(true);
    const id = value == null ? "" : String(value);
    this.patch({ paginaInicioId: id });
    const codigo = id
      ? (this.lookups.modulos().find((m) => m.id === id)?.codigo ?? null)
      : null;
    if (codigo && !this.permisos().includes(codigo)) {
      this.permisos.update((arr) => [...arr, codigo]);
    }
  }

  protected onPermisosChange(codigos: string[]): void {
    this.permisos.set(codigos);
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
    if (!this.isValid()) return;
    this.save.emit({
      data: this.form(),
      permisos: this.permisos(),
    });
  }
}
