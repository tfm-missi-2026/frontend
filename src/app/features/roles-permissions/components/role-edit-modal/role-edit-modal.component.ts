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
import type { Role } from "../../models/role";

export interface RoleEditPayload {
  id: string;
  nombre: string;
  descripcion: string;
  paginaInicioId: string;
  permisos: string[];
}

const NAME_MAX = 100;
const DESCRIPTION_MAX = 500;

@Component({
  selector: "RoleEditModal",
  standalone: true,
  imports: [
    FormsModule,
    PermissionsMatrixComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
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
  readonly modules = input<ModuloResponse[]>([]);
  readonly permisosIniciales = input<string[]>([]);
  readonly camposReadonly = input<boolean>(false);
  /**
   * Estado externo de guardado. Mientras es `true`, el botón
   * "Guardar cambios" muestra spinner y se deshabilita para evitar
   * doble submit. Lo controla el padre (quien ejecuta la llamada
   * HTTP) pasándole el estado de su signal `saving`.
   */
  readonly saving = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<RoleEditPayload>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;

  protected readonly subtitleText = computed<string>(() => {
    const r = this.role();
    if (this.camposReadonly()) {
      return "Rol del sistema: solo puedes ajustar los módulos del sidebar.";
    }
    return `Código ${r?.code ?? ""} (no modificable)`;
  });

  private readonly lookups = inject(LookupsService);

  protected readonly nombre = signal<string>("");
  protected readonly descripcion = signal<string>("");
  protected readonly paginaInicioId = signal<string>("");
  protected readonly permisos = signal<string[]>([]);
  protected readonly permisosInicialesRef = signal<string[]>([]);
  protected readonly nombreTouched = signal<boolean>(false);
  protected readonly descripcionTouched = signal<boolean>(false);
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

  protected readonly landingCodigo = computed<string | null>(
    () => this.role()?.paginaInicioCodigo ?? null,
  );

  protected readonly permisosCambiados = computed<boolean>(() => {
    const initial = [...this.permisosInicialesRef()].sort();
    const current = [...this.permisos()].sort();
    return (
      initial.length !== current.length ||
      initial.some((v, i) => v !== current[i])
    );
  });

  protected readonly camposCambiados = computed<boolean>(() => {
    const r = this.role();
    if (!r) return false;
    return (
      this.nombre().trim() !== r.name ||
      this.descripcion().trim() !== r.description ||
      this.paginaInicioId() !== (r.paginaInicioId ?? "")
    );
  });

  protected readonly hasChanges = computed<boolean>(() => {
    if (this.camposReadonly()) {
      return this.permisosCambiados();
    }
    return this.camposCambiados() || this.permisosCambiados();
  });

  constructor() {
    effect(() => {
      const r = this.role();
      if (r) {
        this.nombre.set(r.name);
        this.descripcion.set(r.description);
        this.paginaInicioId.set(r.paginaInicioId ?? "");
      }
    });

    effect(() => {
      const initial = this.permisosIniciales();
      this.permisosInicialesRef.set(initial);
      this.permisos.set([...initial]);
    });
  }

  private resetTouched(): void {
    this.nombreTouched.set(false);
    this.descripcionTouched.set(false);
    this.paginaInicioTouched.set(false);
    this.submitAttempted.set(false);
  }

  protected readonly nombreError = computed<string | undefined>(() => {
    const n = this.nombre().trim();
    if (!n) return "El nombre es obligatorio.";
    if (n.length > NAME_MAX)
      return `El nombre no puede superar ${NAME_MAX} caracteres.`;
    return undefined;
  });

  protected readonly descripcionError = computed<string | undefined>(() => {
    const d = this.descripcion().trim();
    if (d.length > DESCRIPTION_MAX)
      return `La descripción no puede superar ${DESCRIPTION_MAX} caracteres.`;
    return undefined;
  });

  protected readonly paginaInicioError = computed<string | undefined>(() => {
    if (!this.paginaInicioId())
      return "Selecciona la página de inicio del rol.";
    return undefined;
  });

  protected readonly shouldShowNombre = computed<boolean>(
    () => this.nombreTouched() || this.submitAttempted(),
  );
  protected readonly shouldShowDescripcion = computed<boolean>(
    () => this.descripcionTouched() || this.submitAttempted(),
  );
  protected readonly shouldShowPaginaInicio = computed<boolean>(
    () => this.paginaInicioTouched() || this.submitAttempted(),
  );

  protected readonly visibleNombreError = computed<string | undefined>(() =>
    this.shouldShowNombre() ? this.nombreError() : undefined,
  );
  protected readonly visibleDescripcionError = computed<string | undefined>(
    () => (this.shouldShowDescripcion() ? this.descripcionError() : undefined),
  );
  protected readonly visiblePaginaInicioError = computed<string | undefined>(
    () =>
      this.shouldShowPaginaInicio() ? this.paginaInicioError() : undefined,
  );

  protected readonly isValid = computed<boolean>(() => {
    if (this.camposReadonly()) {
      return true;
    }
    return (
      this.nombreError() === undefined &&
      this.descripcionError() === undefined &&
      this.paginaInicioError() === undefined
    );
  });

  protected patchNombre(value: string): void {
    this.nombre.set(value);
  }

  protected patchDescripcion(value: string): void {
    this.descripcion.set(value);
  }

  protected onNombreBlur(): void {
    this.nombreTouched.set(true);
  }

  protected onDescripcionBlur(): void {
    this.descripcionTouched.set(true);
  }

  protected onPaginaInicioBlur(): void {
    this.paginaInicioTouched.set(true);
  }

  protected onPaginaInicioChange(value: unknown): void {
    this.paginaInicioTouched.set(true);
    this.paginaInicioId.set(value == null ? "" : String(value));
  }

  protected onPermisosChange(codigos: string[]): void {
    this.permisos.set(codigos);
  }

  protected onCancel(): void {
    this.resetTouched();
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
    const r = this.role();
    if (!r || !this.isValid()) return;
    this.save.emit({
      id: r.id,
      nombre: this.nombre().trim(),
      descripcion: this.descripcion().trim(),
      paginaInicioId: this.paginaInicioId(),
      permisos: this.permisos(),
    });
    this.resetTouched();
  }
}
