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
import { UiButtonComponent } from "@shared/ui/button";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";
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
    FormsModule,
    UiButtonComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiHeaderComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSelectComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./role-form-modal.component.html",
})
export class RoleFormModalComponent {
  readonly isOpen = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<RoleFormSavePayload>();

  private readonly lookups = inject(LookupsService);

  protected readonly form = signal<RoleFormData>(emptyRoleForm());

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

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        this.form.set(emptyRoleForm());
      }
    });
  }

  protected readonly errors = computed<{
    code?: string;
    name?: string;
    paginaInicioId?: string;
  }>(() => {
    const f = this.form();
    const out: { code?: string; name?: string; paginaInicioId?: string } = {};
    if (!f.code.trim()) {
      out.code = "El código es obligatorio.";
    } else if (!/^[A-Za-z0-9]{2,4}$/.test(f.code.trim())) {
      out.code = "Usa 2 a 4 caracteres alfanuméricos.";
    }
    if (!f.name.trim()) {
      out.name = "El nombre es obligatorio.";
    }
    if (!f.paginaInicioId) {
      out.paginaInicioId = "Selecciona la página de inicio del rol.";
    }
    return out;
  });

  protected readonly isValid = computed<boolean>(() => {
    const e = this.errors();
    return !e.code && !e.name && !e.paginaInicioId;
  });

  protected patch(partial: Partial<RoleFormData>): void {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  protected onPaginaInicioChange(value: unknown): void {
    this.patch({ paginaInicioId: value == null ? "" : String(value) });
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    if (!this.isValid()) return;
    this.save.emit({ data: this.form() });
  }
}
