import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IconCheckComponent, IconXComponent } from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiDatePickerComponent } from "@shared/ui/date-picker";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";
import { formatShortDate, todayIso } from "@utils/date";

import type { Task } from "@features/projects/models/task";
import { TasksService } from "@features/projects/services/tasks.service";

import { AssignmentsService } from "../../services/assignments.service";
import {
  computeCapacityHours,
  computeCommittedHours,
  computeDayLoads,
  computeEndDate,
  countBusinessDays,
  dayLoadMark,
  findFirstDate,
  isBusinessDay,
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
    UiLabelComponent,
    UiModalComponent,
    UiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./assignment-form-modal.component.html",
})
export class AssignmentFormModalComponent {
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly tasksService = inject(TasksService);

  readonly isOpen = input<boolean>(false);
  readonly saving = input<boolean>(false);
  readonly mode = input<AssignmentFormMode>("create");
  readonly projectId = input<string>("");
  readonly assignment = input<Assignment | null>(null);
  readonly subprojectOptions = input<SelectOption[]>([]);
  readonly tasks = input<Task[]>([]);
  readonly resourceOptions = input<SelectOption[]>([]);
  readonly resourceNames = input<Record<string, string>>({});

  readonly close = output<void>();
  readonly save = output<AssignmentFormSavePayload>();
  readonly overloadRequest = output<OverloadRequest>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;

  protected readonly form = signal<AssignmentFormData>(emptyAssignmentForm());
  protected readonly selectedSubprojectId = signal<string | null>(null);
  protected readonly validationMessage = signal<string | null>(null);
  protected readonly taskError = signal<string | null>(null);
  protected readonly resourceError = signal<string | null>(null);
  protected readonly startError = signal<string | null>(null);
  protected readonly showResourceAssignments = signal<boolean>(false);

  protected readonly heading = computed<string>(() =>
    this.mode() === "create" ? "Nueva asignación" : "Editar asignación",
  );

  protected readonly formInvalid = computed<boolean>(
    () =>
      this.taskError() !== null ||
      this.resourceError() !== null ||
      this.startError() !== null,
  );

  protected readonly taskSelectOptions = computed<SelectOption[]>(() => {
    const subprojectId = this.selectedSubprojectId();
    return this.tasks()
      .filter((t) => t.subprojectId === subprojectId)
      .map((t) => ({ value: t.id, label: t.name }));
  });

  protected readonly selectedTask = computed<Task | undefined>(() =>
    this.tasks().find((t) => t.id === this.form().taskId),
  );

  protected readonly scheduleLabel = computed<string>(() => {
    const task = this.selectedTask();
    if (!task) return "Elige la tarea para calcular la fecha de fin.";
    const days =
      task.estimatedDays === 1
        ? "1 día hábil"
        : `${task.estimatedDays} días hábiles`;
    const effort = `${days} · ${task.estimatedHours} h`;
    const { startDate, endDate } = this.form();
    if (!startDate || !endDate) return effort;
    return `Del ${formatShortDate(startDate)} al ${formatShortDate(endDate)} · ${effort}`;
  });

  private readonly resourceAssignments = computed<Assignment[]>(() => {
    const resourceId = this.form().resourceId;
    const excludedId = this.assignment()?.id;
    return this.assignmentsService
      .assignments()
      .filter(
        (a) =>
          a.active && a.resourceId === resourceId && a.id !== excludedId,
      );
  });

  private readonly dayLoads = computed(() => {
    const names = new Map(this.tasksService.tasks().map((t) => [t.id, t.name]));
    return computeDayLoads(this.resourceAssignments(), names);
  });

  protected readonly dayMark = computed(() => {
    const loads = this.dayLoads();
    return (iso: string) => dayLoadMark(loads, iso);
  });

  private readonly canStartOn = computed(() => {
    const task = this.selectedTask();
    const resourceId = this.form().resourceId;
    const assignments = this.resourceAssignments();
    return (iso: string): boolean => {
      if (!isBusinessDay(iso)) return false;
      if (!task || !resourceId) return true;
      const end = computeEndDate(iso, task.estimatedDays);
      return !isOverload(
        computeCommittedHours(assignments, resourceId, iso, end),
        task.estimatedHours,
        computeCapacityHours(iso, end),
      );
    };
  });

  protected readonly isDateDisabled = computed(() => {
    const canStart = this.canStartOn();
    return (iso: string): boolean => !canStart(iso);
  });

  protected readonly hasTaskAndResource = computed<boolean>(
    () => !!this.selectedTask() && !!this.form().resourceId,
  );

  protected readonly firstAvailableDate = computed<string | null>(() => {
    if (!this.hasTaskAndResource()) return null;
    return findFirstDate(todayIso(), this.canStartOn());
  });

  protected readonly firstAvailableLabel = computed<string>(() => {
    const date = this.firstAvailableDate();
    return date
      ? `Primera fecha disponible: ${formatShortDate(date)}`
      : "Sin fechas disponibles en el próximo año.";
  });

  protected readonly resourceName = computed<string>(
    () => this.resourceNames()[this.form().resourceId] ?? "el recurso",
  );

  protected readonly resourceAssignmentRows = computed(() => {
    const names = new Map(this.tasksService.tasks().map((t) => [t.id, t.name]));
    return [...this.resourceAssignments()]
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .map((a) => ({
        id: a.id,
        label: `${formatShortDate(a.startDate)} – ${formatShortDate(a.endDate)} · ${names.get(a.taskId) ?? "Tarea"} · ${a.plannedHours} h`,
      }));
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      this.resetErrors();
      this.showResourceAssignments.set(false);
      const m = this.mode();
      const a = this.assignment();
      if (m === "edit" && a) {
        this.selectedSubprojectId.set(
          untracked(() => this.tasks()).find((t) => t.id === a.taskId)
            ?.subprojectId ?? null,
        );
        this.form.set({
          taskId: a.taskId,
          resourceId: a.resourceId,
          plannedHours: a.plannedHours,
          startDate: a.startDate,
          endDate: a.endDate,
        });
      } else {
        this.selectedSubprojectId.set(null);
        this.form.set(emptyAssignmentForm());
      }
    });
  }

  private resetErrors(): void {
    this.validationMessage.set(null);
    this.taskError.set(null);
    this.resourceError.set(null);
    this.startError.set(null);
  }

  protected onSubprojectChange(value: unknown): void {
    this.selectedSubprojectId.set(value == null ? null : String(value));
    this.patch({ taskId: "", plannedHours: 0, startDate: "", endDate: "" });
    this.taskError.set(null);
    this.startError.set(null);
  }

  protected onTaskChange(value: unknown): void {
    this.patch({ taskId: value == null ? "" : String(value) });
    this.syncFromTask();
    this.taskError.set(null);
  }

  protected onResourceChange(value: unknown): void {
    this.patch({ resourceId: value == null ? "" : String(value) });
    this.resourceError.set(null);
    this.showResourceAssignments.set(false);
  }

  protected useFirstAvailableDate(): void {
    const date = this.firstAvailableDate();
    if (date) this.onStartDateChange(date);
  }

  protected toggleResourceAssignments(): void {
    this.showResourceAssignments.update((shown) => !shown);
  }

  protected onStartDateChange(value: string | string[]): void {
    const iso = Array.isArray(value) ? value[0] ?? "" : value ?? "";
    this.patch({ startDate: iso });
    this.syncFromTask();
    this.startError.set(this.startDateError(iso));
  }

  private syncFromTask(): void {
    const task = this.selectedTask();
    const { startDate } = this.form();
    this.patch({
      plannedHours: task?.estimatedHours ?? 0,
      endDate:
        task && startDate && isBusinessDay(startDate)
          ? computeEndDate(startDate, task.estimatedDays)
          : "",
    });
  }

  private startDateError(iso: string): string | null {
    if (!iso) return null;
    return isBusinessDay(iso)
      ? null
      : "La fecha de inicio debe ser un día hábil.";
  }

  private patch(partial: Partial<AssignmentFormData>): void {
    this.form.update((prev) => ({ ...prev, ...partial }));
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
    const f = this.form();
    const errors = this.validate(f);
    this.taskError.set(errors.task);
    this.resourceError.set(errors.resource);
    this.startError.set(errors.start);

    if (errors.task || errors.resource || errors.start) {
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
    start: string | null;
  } {
    return {
      task: form.taskId ? null : "Selecciona una tarea.",
      resource: form.resourceId ? null : "Selecciona un recurso técnico.",
      start: form.startDate
        ? this.startDateError(form.startDate)
        : "Selecciona fecha de inicio.",
    };
  }
}
