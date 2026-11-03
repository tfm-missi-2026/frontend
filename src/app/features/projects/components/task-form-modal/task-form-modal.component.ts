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

import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import { ToastService } from "@core/http/toast.service";

import {
  emptyTaskForm,
  type TaskFormData,
  type TaskFormSavePayload,
} from "../../models/task-form";
import type { Task } from "../../models/task";

export type TaskFormMode = "create" | "edit";

const WORKDAY_HOURS = 8;

@Component({
  selector: "TaskFormModal",
  standalone: true,
  imports: [
    UiAlertComponent,
    UiButtonComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiGridComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./task-form-modal.component.html",
})
export class TaskFormModalComponent {
  private readonly toastService = inject(ToastService);

  readonly isOpen = input<boolean>(false);
  readonly mode = input<TaskFormMode>("create");
  readonly subprojectLabel = input<string>("");
  readonly subprojectId = input<string>("");
  readonly task = input<Task | null>(null);
  readonly effortLocked = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<TaskFormSavePayload>();

  protected readonly form = signal<TaskFormData>(emptyTaskForm());
  protected readonly validationMessage = signal<string | null>(null);
  protected readonly nameError = signal<string | null>(null);
  protected readonly daysError = signal<string | null>(null);
  protected readonly hoursError = signal<string | null>(null);

  protected readonly heading = computed<string>(() => {
    if (this.mode() === "create") return "Nueva tarea";
    const t = this.task();
    return t ? `Editar tarea · ${t.name}` : "Editar tarea";
  });

  protected readonly subheading = computed<string>(
    () => `Subproyecto: ${this.subprojectLabel() || "—"}`,
  );

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      this.resetErrors();
      const m = this.mode();
      const t = this.task();
      if (m === "edit" && t) {
        this.form.set({
          name: t.name,
          description: t.description,
          estimatedDays: t.estimatedDays || null,
          estimatedHours: t.estimatedHours || null,
          situationId: t.situationId,
        });
      } else {
        this.form.set(emptyTaskForm());
      }
    });
  }

  private resetErrors(): void {
    this.validationMessage.set(null);
    this.nameError.set(null);
    this.daysError.set(null);
    this.hoursError.set(null);
  }

  protected onNameChange(value: string): void {
    this.patch({ name: value });
    this.nameError.set(null);
  }

  protected onDescriptionChange(value: string): void {
    this.patch({ description: value });
  }

  protected onDaysChange(value: string | number | undefined): void {
    if (value === undefined || value === null || value === "") {
      this.patch({ estimatedDays: null, estimatedHours: null });
      this.daysError.set(null);
      this.hoursError.set(null);
      return;
    }
    const days = Number(value);
    if (!Number.isInteger(days) || days <= 0) {
      this.patch({ estimatedDays: null, estimatedHours: null });
      this.daysError.set("Ingresa un número entero de días, mayor a 0.");
      this.hoursError.set(null);
      return;
    }
    this.patch({ estimatedDays: days, estimatedHours: days * WORKDAY_HOURS });
    this.daysError.set(null);
    this.hoursError.set(null);
  }

  private maxHoursError(hours: number, days: number | null): string | null {
    if (!days) return null;
    const max = days * WORKDAY_HOURS;
    if (hours <= max) return null;
    const daysLabel = days === 1 ? "1 día" : `${days} días`;
    return `Máximo ${max} h para ${daysLabel} (${WORKDAY_HOURS} h por día).`;
  }

  protected onHoursChange(value: string | number | undefined): void {
    if (value === undefined || value === null || value === "") {
      this.patch({ estimatedHours: null });
      this.hoursError.set(null);
      return;
    }
    const num = Number(value);
    if (Number.isFinite(num) && num >= 0) {
      this.patch({ estimatedHours: num });
      this.hoursError.set(this.maxHoursError(num, this.form().estimatedDays));
    } else {
      this.patch({ estimatedHours: null });
      this.hoursError.set("Número inválido.");
    }
  }

  private patch(partial: Partial<TaskFormData>): void {
    this.form.update((prev) => ({ ...prev, ...partial }));
  }

  protected onCancel(): void {
    this.toastService.warning(
      "No se guardaron los cambios de la tarea.",
      "Operación cancelada",
    );
    this.close.emit();
  }

  protected onSave(): void {
    const f = this.form();
    const errors = this.validate(f);
    this.nameError.set(errors.name);
    this.daysError.set(errors.days);
    this.hoursError.set(errors.hours);

    if (errors.name || errors.days || errors.hours) {
      this.validationMessage.set(
        "Revisa los campos marcados antes de guardar.",
      );
      return;
    }
    this.validationMessage.set(null);

    const data: TaskFormData = {
      name: f.name.trim(),
      description: f.description.trim(),
      estimatedDays: f.estimatedDays ?? 0,
      estimatedHours: f.estimatedHours ?? 0,
      situationId: f.situationId,
    };

    const t = this.task();
    const subprojectId = this.subprojectId();
    if (this.mode() === "create") {
      this.save.emit({ mode: "create", subprojectId, data });
    } else if (t) {
      this.save.emit({ mode: "edit", subprojectId, id: t.id, data });
    }
  }

  private validate(form: TaskFormData): {
    name: string | null;
    days: string | null;
    hours: string | null;
  } {
    const errors = {
      name: null,
      days: null,
      hours: null,
    } as {
      name: string | null;
      days: string | null;
      hours: string | null;
    };
    if (!form.name.trim()) errors.name = "El nombre es obligatorio.";
    if (!form.estimatedDays) {
      errors.days = "Ingresa los días estimados.";
    }
    if (form.estimatedHours === null || form.estimatedHours <= 0) {
      errors.hours = "Ingresa las horas estimadas (mayor a 0).";
    } else if (form.estimatedHours > 999) {
      errors.hours = "Las horas deben estar entre 0 y 999.";
    } else {
      errors.hours = this.maxHoursError(
        form.estimatedHours,
        form.estimatedDays,
      );
    }
    return errors;
  }
}