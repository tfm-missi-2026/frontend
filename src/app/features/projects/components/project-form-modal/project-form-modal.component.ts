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

import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiRadioComponent } from "@shared/ui/radio";
import { UiSelectComponent } from "@shared/ui/select";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import { UsersService } from "@features/users/services/users.service";

import {
  emptyProjectForm,
  type ProjectFormSavePayload,
} from "../../models/project-form";
import type { Project, ProjectStatus } from "../../models/project";

export type ProjectFormMode = "create" | "edit";

const CODE_REGEX = /^[A-Z0-9-]+$/;

@Component({
  selector: "ProjectFormModal",
  standalone: true,
  imports: [
    FormsModule,
    UiAlertComponent,
    UiButtonComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiGridComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiRadioComponent,
    UiSelectComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./project-form-modal.component.html",
})
export class ProjectFormModalComponent {
  private readonly usersService = inject(UsersService);

  readonly isOpen = input<boolean>(false);
  readonly mode = input<ProjectFormMode>("create");
  readonly project = input<Project | null>(null);

  readonly close = output<void>();
  readonly save = output<ProjectFormSavePayload>();

  protected readonly form = signal(emptyProjectForm());
  protected readonly validationMessage = signal<string | null>(null);
  protected readonly codeError = signal<string | null>(null);
  protected readonly nameError = signal<string | null>(null);
  protected readonly managerError = signal<string | null>(null);

  protected readonly managerOptions = computed(() => {
    return this.usersService
      .users()
      .filter((u) => u.role === "gestor_proyecto" && u.status === "active")
      .map((u) => ({
        value: u.id,
        label: `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal} — Gestor de Proyecto`,
      }));
  });

  protected readonly heading = computed<string>(() =>
    this.mode() === "create" ? "Nuevo proyecto" : "Editar proyecto",
  );
  protected readonly subheading = computed<string>(() =>
    "Datos del sistema. Las fechas y la prioridad se definen luego, en cada subproyecto.",
  );

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      const p = this.project();
      const m = this.mode();
      this.validationMessage.set(null);
      this.codeError.set(null);
      this.nameError.set(null);
      this.managerError.set(null);
      if (m === "edit" && p) {
        this.form.set({
          code: p.code,
          name: p.name,
          description: p.description,
          managerId: p.managerId,
          subCount: p.subCount,
          status: p.status,
          startDate: p.startDate,
        });
      } else {
        this.form.set(emptyProjectForm());
      }
    });
  }

  protected patch(partial: Partial<ReturnType<typeof emptyProjectForm>>): void {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  protected onCodeChange(value: string): void {
    this.patch({ code: value.toUpperCase() });
    this.codeError.set(null);
  }

  protected onNameChange(value: string): void {
    this.patch({ name: value });
    this.nameError.set(null);
  }

  protected onDescriptionChange(value: string): void {
    this.patch({ description: value });
  }

  protected onSubCountChange(value: string | number | undefined): void {
    const num = Number(value ?? 0);
    this.patch({ subCount: Number.isFinite(num) && num >= 0 ? num : 0 });
  }

  protected onManagerChange(value: unknown): void {
    this.patch({ managerId: value == null ? "" : String(value) });
    this.managerError.set(null);
  }

  protected onStatusChange(status: ProjectStatus): void {
    this.patch({ status });
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    const f = this.form();
    const m = this.mode();
    const errors = this.validate(f);
    this.codeError.set(errors.code ?? null);
    this.nameError.set(errors.name ?? null);
    this.managerError.set(errors.manager ?? null);
    if (Object.keys(errors).length > 0) {
      this.validationMessage.set("Revisa los campos marcados antes de guardar.");
      return;
    }
    this.validationMessage.set(null);

    const data = {
      code: f.code.toUpperCase(),
      name: f.name.trim(),
      description: f.description.trim(),
      managerId: f.managerId,
      subCount: f.subCount,
      status: f.status,
      startDate: f.startDate,
    };

    const p = this.project();
    if (m === "create") {
      this.save.emit({ mode: "create", data });
    } else if (p) {
      this.save.emit({ mode: "edit", id: p.id, data });
    }
  }

  private validate(form: ReturnType<typeof emptyProjectForm>): {
    code?: string;
    name?: string;
    manager?: string;
  } {
    const errors: { code?: string; name?: string; manager?: string } = {};
    if (!form.code.trim()) {
      errors.code = "Ingresa un código.";
    } else if (!CODE_REGEX.test(form.code.trim())) {
      errors.code = "Solo letras mayúsculas, números y guion.";
    }
    if (!form.name.trim()) {
      errors.name = "Ingresa el nombre del sistema.";
    }
    if (!form.managerId) {
      errors.manager = "Selecciona un gestor responsable.";
    }
    return errors;
  }
}