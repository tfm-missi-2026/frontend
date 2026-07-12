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
import { UiHeaderComponent } from "@shared/ui/header";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSelectComponent } from "@shared/ui/select";
import { UiTextAreaComponent } from "@shared/ui/text-area";
import { UiTimePickerComponent } from "@shared/ui/time-picker";

import type {
  TimesheetEntry,
  TimesheetEntryKind,
} from "../../models/timesheet-entry";
import {
  TIMESHEET_ACTIVITY_OPTIONS,
  TIMESHEET_PROJECT_OPTIONS,
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
    UiHeaderComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSelectComponent,
    UiTextAreaComponent,
    UiTimePickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiModal
      [isOpen]="isOpen()"
      [showCloseButton]="false"
      className="max-w-150 p-6 lg:p-8"
      (close)="onCancel()"
    >
      <UiHeader [level]="3" [text]="heading()" />
      <UiLabel type="bodyS" color="textWeak" className="mb-5 mt-1 block">
        {{ subheading() }}
      </UiLabel>

      <UiFlex direction="row" [alignItems]="'end'" [gap]="12" className="mb-4">
        <div class="flex-1">
          <UiFormLabel
            labelText="Fecha"
            labelFor="entry-date"
            [required]="true"
          />
          <UiDatePicker
            id="entry-date"
            [value]="form().date"
            placeholder="dd/mm/aaaa"
            (valueChange)="patch({ date: asString($event) })"
          />
          @if (errors().date; as msg) {
            <UiFieldError [message]="msg" className="mt-1" />
          }
        </div>
        <div class="flex-1">
          <UiFormLabel
            labelText="Hora inicio"
            labelFor="entry-start"
            [required]="true"
          />
          <UiTimePicker
            id="entry-start"
            [time24hr]="true"
            [dateFormat]="'H:i'"
            placeholder="hh:mm"
            [value]="form().startTime"
            (valueChange)="patch({ startTime: $event })"
          />
          @if (errors().startTime; as msg) {
            <UiFieldError [message]="msg" className="mt-1" />
          }
        </div>
        <div class="flex-1">
          <UiFormLabel
            labelText="Hora fin"
            labelFor="entry-end"
            [required]="true"
          />
          <UiTimePicker
            id="entry-end"
            [time24hr]="true"
            [dateFormat]="'H:i'"
            placeholder="hh:mm"
            [value]="form().endTime"
            (valueChange)="patch({ endTime: $event })"
          />
          @if (errors().endTime; as msg) {
            <UiFieldError [message]="msg" className="mt-1" />
          }
        </div>
      </UiFlex>

      <UiLabel
        type="bodyXs"
        color="textStrong"
        weight="medium"
        className="mb-2 block uppercase"
      >
        ¿Qué registras?
      </UiLabel>
      <UiFlex
        direction="row"
        [alignItems]="'center'"
        [gap]="12"
        className="mb-3"
      >
        <button
          type="button"
          class="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all"
          [class.border-brand-500]="form().kind === 'task'"
          [class.bg-brand-50]="form().kind === 'task'"
          [class.shadow-sm]="form().kind === 'task'"
          [class.border-gray-300]="form().kind !== 'task'"
          [class.dark:border-gray-700]="form().kind !== 'task'"
          (click)="patch({ kind: 'task' })"
        >
          <span
            class="inline-flex h-4 w-4 items-center justify-center rounded-full border-2"
            [class.border-brand-500]="form().kind === 'task'"
            [class.bg-brand-500]="form().kind === 'task'"
            [class.border-gray-400]="form().kind !== 'task'"
          >
            @if (form().kind === "task") {
              <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
            }
          </span>
          <UiLabel type="bodyS" weight="semibold" color="textStrong">
            Trabajo en tarea
          </UiLabel>
        </button>
        <button
          type="button"
          class="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all"
          [class.border-brand-500]="form().kind === 'activity'"
          [class.bg-brand-50]="form().kind === 'activity'"
          [class.shadow-sm]="form().kind === 'activity'"
          [class.border-gray-300]="form().kind !== 'activity'"
          [class.dark:border-gray-700]="form().kind !== 'activity'"
          (click)="patch({ kind: 'activity' })"
        >
          <span
            class="inline-flex h-4 w-4 items-center justify-center rounded-full border-2"
            [class.border-brand-500]="form().kind === 'activity'"
            [class.bg-brand-500]="form().kind === 'activity'"
            [class.border-gray-400]="form().kind !== 'activity'"
          >
            @if (form().kind === "activity") {
              <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
            }
          </span>
          <UiLabel type="bodyS" weight="semibold" color="textStrong">
            Actividad
          </UiLabel>
        </button>
      </UiFlex>

      <UiAlert
        variant="info"
        message="Un bloque es de tarea O de actividad, no ambos."
        className="mb-4"
      />

      @if (form().kind === "task") {
        <UiFlex
          direction="row"
          [alignItems]="'end'"
          [gap]="12"
          className="mb-4"
        >
          <div class="flex-1">
            <UiFormLabel
              labelText="Proyecto"
              labelFor="entry-project"
              [required]="true"
            />
            <UiSelect
              inputId="entry-project"
              [options]="projectOptions"
              [searchable]="false"
              [ngModel]="form().project"
              (ngModelChange)="onProjectChange($event)"
            />
          </div>
          <div class="flex-1">
            <UiFormLabel
              labelText="Tarea"
              labelFor="entry-task"
              [required]="true"
            />
            <UiSelect
              inputId="entry-task"
              [options]="filteredTaskOptions()"
              [searchable]="false"
              [ngModel]="form().task"
              (ngModelChange)="onTaskChange($event)"
            />
            @if (errors().task; as msg) {
              <UiFieldError [message]="msg" className="mt-1" />
            }
          </div>
        </UiFlex>
      } @else {
        <div class="mb-4">
          <UiFormLabel
            labelText="Actividad"
            labelFor="entry-activity"
            [required]="true"
          />
          <UiSelect
            inputId="entry-activity"
            [options]="activityOptions"
            [searchable]="false"
            [ngModel]="form().activity"
            (ngModelChange)="onActivityChange($event)"
          />
          <UiLabel type="bodyXs" color="textWeak" className="mt-1 block">
            Catálogo: Reunión · Capacitación · Soporte · Otro.
          </UiLabel>
        </div>
      }

      <div class="mb-4">
        <UiFormLabel labelText="Descripción" labelFor="entry-description" />
        <UiTextArea
          id="entry-description"
          [rows]="3"
          placeholder="¿Qué hiciste en este bloque?"
          [value]="form().description"
          (valueChange)="patch({ description: $event })"
        />
      </div>

      <UiFlex
        direction="row"
        [alignItems]="'center'"
        [gap]="12"
        className="mb-2"
      >
        <UiLabel type="bodyXs" color="textWeak" className="uppercase">
          Horas calculadas
        </UiLabel>
        <UiLabel
          type="HeadingM"
          weight="bold"
          color="textStrong"
          [text]="computedHoursLabel()"
        />
      </UiFlex>

      @if (formError(); as msg) {
        <UiAlert variant="error" [message]="msg" className="mb-4" />
      }

      <UiFlex
        direction="row"
        [justifyContent]="'end'"
        [gap]="2"
        className="mt-4 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800"
      >
        <UiButton
          variant="secondary"
          labelText="Cancelar"
          (click)="onCancel()"
        />
        <UiButton
          variant="primary"
          [labelText]="
            mode() === 'create' ? 'Guardar bloque' : 'Guardar cambios'
          "
          (click)="onSave()"
        />
      </UiFlex>
    </UiModal>
  `,
})
export class EntryFormModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly mode = input<EntryFormMode>("create");
  readonly entry = input<TimesheetEntry | null>(null);
  readonly defaultDate = input<string>("");

  readonly close = output<void>();
  readonly save = output<EntryFormPayload>();

  protected readonly projectOptions = TIMESHEET_PROJECT_OPTIONS;
  protected readonly activityOptions = TIMESHEET_ACTIVITY_OPTIONS;

  protected readonly form = signal<Omit<TimesheetEntry, "id">>(
    emptyTimesheetEntry(this.defaultDate() || ""),
  );

  protected readonly filteredTaskOptions = computed(() => {
    const projectId = this.form().project;
    return TIMESHEET_TASKS.filter((t) => t.projectId === projectId).map(
      (t) => ({
        value: t.id,
        label: `${t.name} · ${t.code}`,
      }),
    );
  });

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
    return out;
  });

  protected readonly formError = computed<string | null>(() => {
    const errs = this.errors();
    const keys = Object.keys(errs);
    return keys.length > 0
      ? "Revisa los campos marcados antes de guardar."
      : null;
  });

  protected readonly computedHoursLabel = computed<string>(() => {
    const h = computeHours(this.form().startTime, this.form().endTime);
    return `${h} h`;
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

    effect(() => {
      const f = this.form();
      const hours = computeHours(f.startTime, f.endTime);
      if (hours !== f.hours) {
        this.form.update((prev) => ({ ...prev, hours }));
      }
    });
  }

  protected patch(partial: Partial<Omit<TimesheetEntry, "id">>): void {
    this.form.update((prev) => ({ ...prev, ...partial }));
  }

  protected onProjectChange(value: unknown): void {
    const projectId = String(value ?? "");
    const firstTask = TIMESHEET_TASKS.find((t) => t.projectId === projectId);
    this.patch({
      project: projectId,
      task: firstTask?.id ?? "",
      taskCode: firstTask?.code,
    });
  }

  protected onTaskChange(value: unknown): void {
    const taskId = String(value ?? "");
    const task = TIMESHEET_TASKS.find((t) => t.id === taskId);
    this.patch({ task: taskId, taskCode: task?.code });
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
      kind: f.kind,
      status: m === "edit" && e ? e.status : "draft",
    };
    if (data.kind === "task") {
      data.activity = "";
    } else {
      data.task = "";
      data.taskCode = undefined;
    }
    this.save.emit({ mode: m, id: e?.id, data });
  }
}
