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

import type { Role } from "../../models/role";

export interface RoleEditPayload {
  id: string;
  nombre: string;
  descripcion: string;
  paginaInicioId: string;
}

@Component({
  selector: "RoleEditModal",
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
  templateUrl: "./role-edit-modal.component.html",
})
export class RoleEditModalComponent {
  readonly role = input<Role | null>(null);
  readonly isOpen = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<RoleEditPayload>();

  private readonly lookups = inject(LookupsService);

  protected readonly nombre = signal<string>("");
  protected readonly descripcion = signal<string>("");
  protected readonly paginaInicioId = signal<string>("");

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
      const r = this.role();
      if (r) {
        this.nombre.set(r.name);
        this.descripcion.set(r.description);
        this.paginaInicioId.set(r.paginaInicioId ?? "");
      }
    });
  }

  protected readonly errorMessage = computed<string | undefined>(() => {
    const n = this.nombre().trim();
    if (!n) return "El nombre es obligatorio.";
    if (n.length > 100) return "El nombre no puede superar 100 caracteres.";
    return undefined;
  });

  protected readonly paginaInicioError = computed<string | undefined>(() => {
    if (!this.paginaInicioId()) return "Selecciona la página de inicio del rol.";
    return undefined;
  });

  protected readonly isValid = computed<boolean>(
    () =>
      this.errorMessage() === undefined &&
      this.paginaInicioError() === undefined,
  );

  protected patchNombre(value: string): void {
    this.nombre.set(value);
  }

  protected patchDescripcion(value: string): void {
    this.descripcion.set(value);
  }

  protected onPaginaInicioChange(value: unknown): void {
    this.paginaInicioId.set(value == null ? "" : String(value));
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    const r = this.role();
    if (!r || !this.isValid()) return;
    this.save.emit({
      id: r.id,
      nombre: this.nombre().trim(),
      descripcion: this.descripcion().trim(),
      paginaInicioId: this.paginaInicioId(),
    });
  }
}