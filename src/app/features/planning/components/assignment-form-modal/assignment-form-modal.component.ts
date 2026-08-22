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
import { UiDatePickerComponent } from "@shared/ui/date-picker";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";

import { AssignmentsService } from "../../services/assignments.service";
import {
  computeCapacityHours,
  computeCommittedHours,
  countBusinessDays,
  isOverload,
} from "../../services/capacity.util";
import type { Assignment } from "../../models/assignment";
import {
  emptyAssignmentForm,
  type AssignmentFormData,
  type AssignmentFormSavePayload,
  type OverloadRequest,
} from "../../models/assignment-form";

export type AssignmentFormMode = "create" | "edit";

const WORKDAY_HOURS = 8;

@Component({
  selector: "AssignmentFormModal",
  standalone: true,
  imports: [
    FormsModule,
    UiAlertComponent,
    UiButtonComponent,
    UiDatePickerComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiGridComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./assignment-form-modal.component.html",
})
export class AssignmentFormModalComponent {
  private readonly assignmentsService = inject(AssignmentsService);

  readonly isOpen = input<boolean>(false);
  readonly mode = input<AssignmentFormMode>("create");
  readonly projectId = input<string>("");
  readonly assignment = input<Assignment | null>(null);
  readonly taskOptions = input<SelectOption[]>([]);
  readonly resourceOptions = input<SelectOption[]>([]);
  readonly resourceNames = input<Record<string, string>>({});

  readonly close = output<void>();
  readonly save = output<AssignmentFormSavePayload>();
  readonly overloadRequest = output<OverloadRequest>();

  protected readonly form = signal<AssignmentFormData>(emptyAssignmentForm());
  protected readonly validationMessage = signal<string | null>(null);
  protected readonly taskError = signal<string | null>(null);
  protected readonly resourceError = signal<string | null>(null);
  protected readonly hoursError = signal<string | null>(null);
  protected readonly startError = signal<string | null>(null);
  protected readonly endError = signal<string | null>(null);
  protected readonly dateRangeError = signal<string | null>(null);

  protected readonly heading = computed<string>(() =>
    this.mode() === "create" ? "Nueva asignación" : "Editar asignación",
  );

  protected readonly jornadaLabel = computed<string>(() => {
    const h = this.form().plannedHours;
    const jornadas = (h / WORKDAY_HOURS).toFixed(2);
    return `8 h/día · ${h} h ≈ ${jornadas} jornadas`;
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      this.resetErrors();
      const m = this.mode();
      const a = this.assignment();
      if (m === "edit" && a) {
        this.form.set({
          taskId: a.taskId,
          resourceId: a.resourceId,
          plannedHours: a.plannedHours,
          startDate: a.startDate,
          endDate: a.endDate,
        });
      } else {
        this.form.set(emptyAssignmentForm());
      }
    });
  }

  private resetErrors(): void {
    this.validationMessage.set(null);
    this.taskError.set(null);
    this.resourceError.set(null);
    this.hoursError.set(null);
    this.startError.set(null);
    this.endError.set(null);
    this.dateRangeError.set(null);
  }

  protected onTaskChange(value: unknown): void {
    this.patch({ taskId: value == null ? "" : String(value) });
    this.taskError.set(null);
  }

  protected onResourceChange(value: unknown): void {
    this.patch({ resourceId: value == null ? "" : String(value) });
    this.resourceError.set(null);
  }

  protected onHoursChange(value: string | number | undefined): void {
    if (value === undefined || value === null || value === "") {
      this.patch({ plannedHours: 0 });
      this.hoursError.set(null);
      return;
    }
    const num = Number(value);
    if (Number.isFinite(num) && num >= 0) {
      this.patch({ plannedHours: num });
      this.hoursError.set(null);
    } else {
      this.patch({ plannedHours: 0 });
      this.hoursError.set("Número inválido.");
    }
  }

  protected onStartDateChange(value: string | string[]): void {
    const iso = Array.isArray(value) ? value[0] ?? "" : value ?? "";
    this.patch({ startDate: iso });
    this.startError.set(null);
    this.dateRangeError.set(null);
  }

  protected onEndDateChange(value: string | string[]): void {
    const iso = Array.isArray(value) ? value[0] ?? "" : value ?? "";
    this.patch({ endDate: iso });
    this.endError.set(null);
    this.dateRangeError.set(null);
  }

  private patch(partial: Partial<AssignmentFormData>): void {
    this.form.update((prev) => ({ ...prev, ...partial }));
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    const f = this.form();
    const errors = this.validate(f);
    this.taskError.set(errors.task);
    this.resourceError.set(errors.resource);
    this.hoursError.set(errors.hours);
    this.startError.set(errors.start);
    this.endError.set(errors.end);
    this.dateRangeError.set(errors.dateRange);

    if (
      errors.task ||
      errors.resource ||
      errors.hours ||
      errors.start ||
      errors.end ||
      errors.dateRange
    ) {
      this.validationMessage.set(
        "Revisa los campos marcados antes de guardar.",
      );
      return;
    }
    this.validationMessage.set(null);

    const data: AssignmentFormData = {
      taskId: f.taskId,
      resourceId: f.resourceId,
      plannedHours: f.plannedHours,
      startDate: f.startDate,
      endDate: f.endDate,
    };

    const projectId = this.projectId();
    const payload: AssignmentFormSavePayload =
      this.mode() === "create"
        ? { mode: "create", projectId, data }
        : {
            mode: "edit",
            projectId,
            id: this.assignment()?.id ?? "",
            data,
          };

    const capacity = computeCapacityHours(f.startDate, f.endDate);
    const businessDays = countBusinessDays(f.startDate, f.endDate);
    const excludingId =
      this.mode() === "edit" ? this.assignment()?.id : undefined;
    const committed = computeCommittedHours(
      this.assignmentsService.assignments(),
      f.resourceId,
      f.startDate,
      f.endDate,
      excludingId,
    );

    if (
      businessDays > 0 &&
      capacity > 0 &&
      isOverload(committed, f.plannedHours, capacity)
    ) {
      const resourceName =
        this.resourceNames()[f.resourceId] ?? "el recurso";
      this.close.emit();
      this.overloadRequest.emit({
        resourceId: f.resourceId,
        resourceName,
        committedHours: committed,
        newHours: f.plannedHours,
        capacityHours: capacity,
        periodStart: f.startDate,
        periodEnd: f.endDate,
        businessDays,
        payload,
      });
      return;
    }

    this.save.emit(payload);
  }

  private validate(form: AssignmentFormData): {
    task: string | null;
    resource: string | null;
    hours: string | null;
    start: string | null;
    end: string | null;
    dateRange: string | null;
  } {
    const errors = {
      task: null,
      resource: null,
      hours: null,
      start: null,
      end: null,
      dateRange: null,
    } as {
      task: string | null;
      resource: string | null;
      hours: string | null;
      start: string | null;
      end: string | null;
      dateRange: string | null;
    };
    if (!form.taskId) errors.task = "Selecciona una tarea.";
    if (!form.resourceId)
      errors.resource = "Selecciona un recurso técnico.";
    if (!form.plannedHours || form.plannedHours <= 0) {
      errors.hours = "Ingresa las horas planificadas.";
    } else if (form.plannedHours > 999) {
      errors.hours = "Máximo 999 horas.";
    }
    if (!form.startDate) errors.start = "Selecciona fecha de inicio.";
    if (!form.endDate) errors.end = "Selecciona fecha de fin.";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errors.dateRange =
        "La fecha de fin debe ser posterior o igual a la de inicio.";
    }
    return errors;
  }
}