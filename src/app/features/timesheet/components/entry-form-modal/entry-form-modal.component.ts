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

import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiDatePickerComponent } from "@shared/ui/date-picker";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiGridComponent } from "@shared/ui/grid";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiRadioComponent } from "@shared/ui/radio";
import { UiSelectComponent } from "@shared/ui/select";
import { UiSeparatorComponent } from "@shared/ui/separator";
import { UiTextAreaComponent } from "@shared/ui/text-area";
import { UiTimePickerComponent } from "@shared/ui/time-picker";

import type {
  TimesheetEntry,
  TimesheetEntryKind,
} from "../../models/timesheet-entry";
import {
  TIMESHEET_ACTIVITY_OPTIONS,
  TIMESHEET_TASK_OPTIONS,
  TIMESHEET_TASKS,
  emptyTimesheetEntry,
} from "../../models/timesheet-entry";

export type EntryFormMode = "create" | "edit";

export interface EntryFormPayload {
  mode: EntryFormMode;
  id?: string;
  data: Omit<TimesheetEntry, "id">;
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

function timeToMinutes(value: string): number {
  if (!TIME_REGEX.test(value)) return -1;
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function computeHours(start: string, end: string): number {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  if (s < 0 || e < 0 || e <= s) return 0;
  return Math.round(((e - s) / 60) * 100) / 100;
}

const KIND_CARD_BASE =
  "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors";
const KIND_CARD_ACTIVE =
  "border-brand-500 bg-brand-50 shadow-sm dark:border-brand-400 dark:bg-brand-500/15";
const KIND_CARD_IDLE =
  "border-gray-300 bg-white hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600";

@Component({
  selector: "EntryFormModal",
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
    UiHeaderComponent,
    UiLabelComponent,
    UiModalComponent,
    UiRadioComponent,
    UiSelectComponent,
    UiSeparatorComponent,
    UiTextAreaComponent,
    UiTimePickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./entry-form-modal.component.html",
})
export class EntryFormModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly mode = input<EntryFormMode>("create");
  readonly entry = input<TimesheetEntry | null>(null);
  readonly defaultDate = input<string>("");

  readonly close = output<void>();
  readonly save = output<EntryFormPayload>();

  protected readonly taskOptions = TIMESHEET_TASK_OPTIONS;
  protected readonly activityOptions = TIMESHEET_ACTIVITY_OPTIONS;

  protected readonly form = signal<Omit<TimesheetEntry, "id">>(
    emptyTimesheetEntry(this.defaultDate() || ""),
  );

  protected readonly heading = computed<string>(() =>
    this.mode() === "create" ? "Registrar bloque" : "Editar bloque",
  );

  protected readonly subheading = computed<string>(() =>
    this.mode() === "create"
      ? "Un tramo de tu jornada vinculado a una tarea o a una actividad."
      : "Modifica los datos del bloque y guarda los cambios.",
  );

  protected readonly errors = computed(() => {
    const f = this.form();
    const out: {
      date?: string;
      startTime?: string;
      endTime?: string;
      task?: string;
      activity?: string;
    } = {};
    if (!f.date) out.date = "Selecciona una fecha.";
    if (!TIME_REGEX.test(f.startTime))
      out.startTime = "Hora de inicio inválida.";
    if (!TIME_REGEX.test(f.endTime)) out.endTime = "Hora de fin inválida.";
    if (
      TIME_REGEX.test(f.startTime) &&
      TIME_REGEX.test(f.endTime) &&
      timeToMinutes(f.endTime) <= timeToMinutes(f.startTime)
    ) {
      out.endTime = "La hora fin debe ser posterior a la hora de inicio.";
    }
    if (f.kind === "task" && !f.task) out.task = "Selecciona una tarea.";
    if (f.kind === "activity" && !f.activity)
      out.activity = "Selecciona una actividad.";
    return out;
  });

  protected readonly formError = computed<string | null>(() => {
    const errs = this.errors();
    const keys = Object.keys(errs);
    return keys.length > 0
      ? "Revisa los campos marcados antes de guardar."
      : null;
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) return;
      const m = this.mode();
      const e = this.entry();
      if (m === "edit" && e) {
        this.form.set({ ...e });
      } else {
        this.form.set(emptyTimesheetEntry(this.defaultDate() || ""));
      }
    });
  }

  protected kindCardClasses(kind: TimesheetEntryKind): string {
    const active = this.form().kind === kind;
    return [KIND_CARD_BASE, active ? KIND_CARD_ACTIVE : KIND_CARD_IDLE].join(
      " ",
    );
  }

  protected patch(partial: Partial<Omit<TimesheetEntry, "id">>): void {
    this.form.update((prev) => ({ ...prev, ...partial }));
  }

  protected selectKind(kind: TimesheetEntryKind): void {
    if (this.form().kind === kind) return;
    this.form.update((prev) => ({ ...prev, kind }));
  }

  protected onTaskChange(value: unknown): void {
    const taskId = String(value ?? "");
    const task = TIMESHEET_TASKS.find((t) => t.id === taskId);
    this.patch({
      task: taskId,
      taskCode: task?.code,
      project: task?.projectId ?? "",
    });
  }

  protected onActivityChange(value: unknown): void {
    this.patch({ activity: String(value ?? "") });
  }

  protected asString(value: string | string[]): string {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onSave(): void {
    if (this.formError()) return;
    const f = this.form();
    const m = this.mode();
    const e = this.entry();
    const hours = computeHours(f.startTime, f.endTime);
    const data: Omit<TimesheetEntry, "id"> = {
      ...f,
      hours,
      status: m === "edit" && e ? e.status : "draft",
    };
    if (data.kind === "task") {
      data.activity = "";
    } else {
      data.task = "";
      data.taskCode = undefined;
      data.project = "";
    }
    this.save.emit({ mode: m, id: e?.id, data });
  }
}