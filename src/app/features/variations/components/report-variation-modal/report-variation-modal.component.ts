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
import { UiSurfaceComponent } from "@shared/ui/surface";
import { UiTextAreaComponent } from "@shared/ui/text-area";
import type { SelectOption } from "@shared/ui/select";
import { formatDateRange, formatShortDate, todayIso } from "@utils/date";

import { AssignmentsService } from "@features/planning/services/assignments.service";
import {
  computeCapacityHours,
  computeCommittedHours,
  computeDayLoads,
  computeEndDate,
  dayLoadMark,
  findFirstDate,
  isBusinessDay,
  isOverload,
} from "@features/planning/services/capacity.util";
import { TasksService } from "@features/projects/services/tasks.service";
import { UsersService } from "@features/users/services/users.service";

import {
  emptyVariationForm,
  type ReportVariationPayload,
  type VariationFormData,
} from "../../models/variation-form";
import {
  VARIATION_TYPE_OPTIONS,
  type VariationTarget,
  type VariationType,
} from "../../models/variation";

const WORKDAY_HOURS = 8;

export interface ProjectOption {
  id: string;
  label: string;
}

export interface SubprojectOption {
  id: string;
  projectId: string;
  label: string;
  ref: string | null;
}

export interface TaskOption {
  id: string;
  subprojectId: string;
  label: string;
  estimatedDays: number;
  estimatedHours: number;
}

@Component({
  selector: "ReportVariationModal",
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
    UiSurfaceComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./report-variation-modal.component.html",
})
export class ReportVariationModalComponent {
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly tasksService = inject(TasksService);
  private readonly usersService = inject(UsersService);

  readonly isOpen = input<boolean>(false);
  readonly projects = input<ProjectOption[]>([]);
  readonly subprojects = input<SubprojectOption[]>([]);
  readonly tasks = input<TaskOption[]>([]);
  readonly reportedBy = input<string>("Lucía Fernández Torres");

  readonly close = output<void>();
  readonly save = output<ReportVariationPayload>();

  protected readonly form = signal<VariationFormData>(emptyVariationForm());
  protected readonly validationMessage = signal<string | null>(null);

  protected readonly VARIATION_TYPE_OPTIONS = VARIATION_TYPE_OPTIONS;

  protected readonly selectedProjectId = signal<string | null>(null);
  protected readonly selectedSubprojectId = signal<string | null>(null);
  protected readonly selectedTaskId = signal<string | null>(null);
  protected readonly selectedType = signal<VariationType | null>(null);

  protected readonly newResourceId = signal<string | null>(null);
  protected readonly newStartDate = signal<string>("");
  protected readonly newDays = signal<number | null>(null);
  protected readonly newHours = signal<number | null>(null);

  protected readonly projectSelectOptions = computed<SelectOption[]>(() =>
    this.projects().map((p) => ({ value: p.id, label: p.label })),
  );

  protected readonly subprojectSelectOptions = computed<SelectOption[]>(() => {
    const projectId = this.selectedProjectId();
    return this.subprojects()
      .filter((s) => s.projectId === projectId)
      .map((s) => ({ value: s.id, label: s.label }));
  });

  protected readonly taskSelectOptions = computed<SelectOption[]>(() => {
    const subprojectId = this.selectedSubprojectId();
    return this.tasks()
      .filter((t) => t.subprojectId === subprojectId)
      .map((t) => ({ value: t.id, label: t.label }));
  });

  private readonly selectedTask = computed(() =>
    this.tasks().find((t) => t.id === this.selectedTaskId()),
  );

  private readonly currentAssignment = computed(() =>
    this.assignmentsService
      .assignments()
      .find((a) => a.active && a.taskId === this.selectedTaskId()),
  );

  private resourceFullName(id: string | null | undefined): string {
    const u = this.usersService.users().find((x) => x.id === id);
    return u
      ? `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`
      : "Sin recurso";
  }

  protected readonly currentResourceName = computed<string>(() =>
    this.resourceFullName(this.currentAssignment()?.resourceId),
  );

  protected readonly currentPeriod = computed<string>(() => {
    const a = this.currentAssignment();
    return a ? formatDateRange(a.startDate, a.endDate) : "—";
  });

  protected readonly currentEffort = computed<string>(() => {
    const t = this.selectedTask();
    return t ? effortLabel(t.estimatedDays, t.estimatedHours) : "—";
  });

  protected readonly canEditDetail = computed<boolean>(
    () => !!this.selectedType() && !!this.currentAssignment(),
  );

  protected readonly resourceOptions = computed<SelectOption[]>(() => {
    const currentId = this.currentAssignment()?.resourceId;
    return this.usersService
      .users()
      .filter(
        (u) =>
          u.role === "recurso_tecnico" &&
          u.status === "active" &&
          u.id !== currentId,
      )
      .map((u) => ({
        value: u.id,
        label: `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`,
      }));
  });

  private readonly calendarResourceId = computed<string | null>(() =>
    this.selectedType() === "Recursos"
      ? this.newResourceId()
      : (this.currentAssignment()?.resourceId ?? null),
  );

  private readonly otherAssignments = computed(() => {
    const resourceId = this.calendarResourceId();
    const taskId = this.selectedTaskId();
    return this.assignmentsService
      .assignments()
      .filter(
        (a) => a.active && a.resourceId === resourceId && a.taskId !== taskId,
      );
  });

  protected readonly dayMark = computed(() => {
    const names = new Map(this.tasksService.tasks().map((t) => [t.id, t.name]));
    const loads = computeDayLoads(this.otherAssignments(), names);
    return (iso: string) => dayLoadMark(loads, iso);
  });

  private readonly canStartOn = computed(() => {
    const task = this.selectedTask();
    const resourceId = this.calendarResourceId();
    const assignments = this.otherAssignments();
    const currentStart = this.currentAssignment()?.startDate;
    const isPlazo = this.selectedType() === "Plazo";
    return (iso: string): boolean => {
      if (!isBusinessDay(iso)) return false;
      if (currentStart && iso < currentStart) return false;
      if (isPlazo && iso === currentStart) return false;
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

  protected readonly firstAvailableDate = computed<string | null>(() =>
    findFirstDate(
      this.currentAssignment()?.startDate ?? todayIso(),
      this.canStartOn(),
    ),
  );

  protected readonly firstAvailableLabel = computed<string>(() => {
    const date = this.firstAvailableDate();
    return date
      ? `Primera fecha disponible: ${formatShortDate(date)}`
      : "Sin fechas disponibles en el próximo año.";
  });

  protected readonly newEndDate = computed<string>(() => {
    const type = this.selectedType();
    if (type === "Alcance") {
      const start = this.currentAssignment()?.startDate;
      const days = this.newDays();
      return start && days ? computeEndDate(start, days) : "";
    }
    const task = this.selectedTask();
    const start = this.newStartDate();
    return task && start ? computeEndDate(start, task.estimatedDays) : "";
  });

  protected readonly newEndLabel = computed<string>(() => {
    const end = this.newEndDate();
    return end ? `Fecha de fin calculada: ${formatShortDate(end)}` : "";
  });

  protected readonly hoursError = computed<string | null>(() => {
    const days = this.newDays();
    const hours = this.newHours();
    if (!days || hours === null) return null;
    const max = days * WORKDAY_HOURS;
    return hours > max
      ? `Máximo ${max} h para ${days === 1 ? "1 día" : `${days} días`} (${WORKDAY_HOURS} h por día).`
      : null;
  });

  protected readonly scopeOverloadMessage = computed<string | null>(() => {
    if (this.selectedType() !== "Alcance") return null;
    const a = this.currentAssignment();
    const end = this.newEndDate();
    const hours = this.newHours();
    if (!a || !end || !hours) return null;
    const committed = computeCommittedHours(
      this.assignmentsService.assignments(),
      a.resourceId,
      a.startDate,
      end,
      a.id,
    );
    return isOverload(committed, hours, computeCapacityHours(a.startDate, end))
      ? `${this.currentResourceName()} quedaría con sobrecarga en este periodo.`
      : null;
  });

  private readonly detailValid = computed<boolean>(() => {
    const type = this.selectedType();
    const task = this.selectedTask();
    if (!type || !task || !this.currentAssignment()) return false;
    if (type === "Alcance") {
      const days = this.newDays();
      const hours = this.newHours();
      return (
        !!days &&
        !!hours &&
        !this.hoursError() &&
        (days !== task.estimatedDays || hours !== task.estimatedHours)
      );
    }
    if (type === "Recursos" && !this.newResourceId()) return false;
    const start = this.newStartDate();
    return !!start && this.canStartOn()(start);
  });

  protected readonly canSubmit = computed<boolean>(
    () =>
      this.detailValid() &&
      this.form().description.trim().length > 0 &&
      this.form().justification.trim().length > 0 &&
      this.form().detectionDate.length > 0,
  );

  constructor() {
    effect(() => {
      if (!this.isOpen()) return;
      this.form.set(emptyVariationForm());
      this.selectedProjectId.set(null);
      this.selectedSubprojectId.set(null);
      this.selectedTaskId.set(null);
      this.selectedType.set(null);
      this.resetDetail();
      this.validationMessage.set(null);
    });
  }

  private resetDetail(): void {
    this.newResourceId.set(null);
    this.newStartDate.set("");
    this.newDays.set(null);
    this.newHours.set(null);
  }

  protected onProjectChange(value: unknown): void {
    this.selectedProjectId.set(selectedValue(value));
    this.selectedSubprojectId.set(null);
    this.setTask(null);
  }

  protected onSubprojectChange(value: unknown): void {
    this.selectedSubprojectId.set(selectedValue(value));
    this.setTask(null);
  }

  protected onTaskChange(value: unknown): void {
    this.setTask(selectedValue(value));
    this.clearValidation();
  }

  private setTask(taskId: string | null): void {
    this.selectedTaskId.set(taskId);
    this.resetDetail();
    const task = this.tasks().find((t) => t.id === taskId);
    const sub = this.subprojects().find((s) => s.id === task?.subprojectId);
    const target: VariationTarget | null = task
      ? { kind: "task", taskId: task.id, label: task.label, ref: sub?.ref ?? null }
      : null;
    this.form.update((f) => ({ ...f, target }));
  }

  protected onTypeChange(value: unknown): void {
    const str = selectedValue(value);
    if (!str) return;
    this.selectedType.set(str as VariationType);
    this.resetDetail();
    this.form.update((f) => ({ ...f, type: str as VariationType }));
  }

  protected onNewResourceChange(value: unknown): void {
    this.newResourceId.set(selectedValue(value));
    this.newStartDate.set("");
  }

  protected onNewStartDateChange(value: string | string[]): void {
    this.newStartDate.set(Array.isArray(value) ? (value[0] ?? "") : (value ?? ""));
  }

  protected useFirstAvailableDate(): void {
    const date = this.firstAvailableDate();
    if (date) this.newStartDate.set(date);
  }

  protected onNewDaysChange(value: string | number | undefined): void {
    const days = Number(value);
    if (!Number.isInteger(days) || days <= 0) {
      this.newDays.set(null);
      this.newHours.set(null);
      return;
    }
    this.newDays.set(days);
    this.newHours.set(days * WORKDAY_HOURS);
  }

  protected onNewHoursChange(value: string | number | undefined): void {
    const hours = Number(value);
    this.newHours.set(Number.isFinite(hours) && hours > 0 ? hours : null);
  }

  protected onDescriptionChange(value: string): void {
    this.form.update((f) => ({ ...f, description: value }));
    this.clearValidation();
  }

  protected onJustificationChange(value: string): void {
    this.form.update((f) => ({ ...f, justification: value }));
    this.clearValidation();
  }

  protected onDetectionDateChange(value: string): void {
    this.form.update((f) => ({ ...f, detectionDate: value }));
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    if (!this.canSubmit()) {
      this.validationMessage.set("Completa los campos obligatorios.");
      return;
    }
    this.validationMessage.set(null);
    this.save.emit({
      data: {
        ...this.form(),
        previousValue: this.previousValueText(),
        newValue: this.newValueText(),
      },
      reportedBy: this.reportedBy(),
    });
  }

  private previousValueText(): string {
    if (this.selectedType() === "Alcance") {
      const a = this.currentAssignment();
      return `${this.currentEffort()}, hasta ${formatShortDate(a?.endDate)}`;
    }
    return `${this.currentResourceName()}, ${this.currentPeriod()}`;
  }

  private newValueText(): string {
    const end = this.newEndDate();
    if (this.selectedType() === "Alcance") {
      return `${effortLabel(this.newDays() ?? 0, this.newHours() ?? 0)}, hasta ${formatShortDate(end)}`;
    }
    const resource =
      this.selectedType() === "Recursos"
        ? this.resourceFullName(this.newResourceId())
        : this.currentResourceName();
    return `${resource}, ${formatDateRange(this.newStartDate(), end)}`;
  }

  private clearValidation(): void {
    if (this.validationMessage()) this.validationMessage.set(null);
  }
}

function effortLabel(days: number, hours: number): string {
  return `${days === 1 ? "1 día" : `${days} días`}, ${hours} h`;
}

function selectedValue(value: unknown): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw == null || raw === "" ? null : String(raw);
}
