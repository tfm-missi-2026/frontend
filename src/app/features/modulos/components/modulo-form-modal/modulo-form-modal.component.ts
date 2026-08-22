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

import type { ModuloResponse } from "@core/modulos/modulo.models";

export interface ModuloFormData {
  codigo: string;
  nombre: string;
  icono: string;
  orden: number;
  seccion: string;
  tipo: "SECTION" | "MENU" | "SUBMENU";
  descripcion: string;
}

export interface ModuloFormPayload {
  data: ModuloFormData;
}

export interface ModuloEditPayload {
  id: string;
  data: ModuloFormData;
}

const SECCIONES_DISPONIBLES: SelectOption[] = [
  { value: "OPERACION", label: "Operacion" },
  { value: "SEGUIMIENTO", label: "Seguimiento" },
  { value: "ADMINISTRACION", label: "Administracion" },
  { value: "CUENTA", label: "Mi cuenta" },
];

const TIPOS_DISPONIBLES: SelectOption[] = [
  { value: "MENU", label: "Menu" },
  { value: "SECTION", label: "Seccion" },
  { value: "SUBMENU", label: "Submenu" },
];

function emptyForm(): ModuloFormData {
  return {
    codigo: "",
    nombre: "",
    icono: "",
    orden: 1,
    seccion: "OPERACION",
    tipo: "MENU",
    descripcion: "",
  };
}

function fromModulo(m: ModuloResponse): ModuloFormData {
  return {
    codigo: m.codigo,
    nombre: m.nombre,
    icono: m.icono ?? "",
    orden: m.orden,
    seccion: m.seccion ?? "OPERACION",
    tipo: m.tipo ?? "MENU",
    descripcion: m.descripcion ?? "",
  };
}

@Component({
  selector: "ModuloFormModal",
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
  templateUrl: "./modulo-form-modal.component.html",
})
export class ModuloFormModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly existing = input<ModuloResponse | null>(null);

  readonly close = output<void>();
  readonly save = output<ModuloFormPayload | ModuloEditPayload>();

  protected readonly form = signal<ModuloFormData>(emptyForm());
  protected readonly secciones: SelectOption[] = SECCIONES_DISPONIBLES;
  protected readonly tipos: SelectOption[] = TIPOS_DISPONIBLES;

  constructor() {
    effect(() => {
      const ex = this.existing();
      if (ex) {
        this.form.set(fromModulo(ex));
      } else if (this.isOpen()) {
        this.form.set(emptyForm());
      }
    });
  }

  protected readonly isEdit = computed<boolean>(() => this.existing() !== null);

  protected readonly ordenString = computed<string>(() =>
    String(this.form().orden),
  );

  protected readonly errors = computed<{
    codigo?: string;
    nombre?: string;
    orden?: string;
    seccion?: string;
  }>(() => {
    const f = this.form();
    const out: {
      codigo?: string;
      nombre?: string;
      orden?: string;
      seccion?: string;
    } = {};
    if (!this.isEdit()) {
      const codigo = f.codigo.trim();
      if (!codigo) out.codigo = "El codigo es obligatorio.";
      else if (!/^[A-Z0-9_]{2,40}$/i.test(codigo))
        out.codigo = "Usa letras, numeros y guion bajo (2-40 caracteres).";
    }
    if (!f.nombre.trim()) out.nombre = "El nombre es obligatorio.";
    if (!Number.isFinite(f.orden) || f.orden < 0)
      out.orden = "El orden debe ser un numero >= 0.";
    if (!f.seccion.trim()) out.seccion = "La seccion es obligatoria.";
    return out;
  });

  protected readonly isValid = computed<boolean>(() => {
    const e = this.errors();
    return !e.codigo && !e.nombre && !e.orden && !e.seccion;
  });

  protected patch(partial: Partial<ModuloFormData>): void {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  protected onSeccionChange(value: unknown): void {
    this.patch({ seccion: value == null ? "" : String(value) });
  }

  protected onTipoChange(value: unknown): void {
    const tipo = value == null ? "" : String(value);
    if (tipo === "SECTION" || tipo === "MENU" || tipo === "SUBMENU") {
      this.patch({ tipo });
    }
  }

  protected onOrdenChange(value: string): void {
    const n = Number(value);
    this.patch({ orden: Number.isFinite(n) ? n : 0 });
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    if (!this.isValid()) return;
    const data: ModuloFormData = this.form();
    const ex = this.existing();
    if (ex) {
      this.save.emit({ id: ex.id, data });
    } else {
      this.save.emit({ data });
    }
  }
}