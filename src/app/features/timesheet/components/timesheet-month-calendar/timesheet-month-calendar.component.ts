import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";

import { FullCalendarComponent, FullCalendarModule } from "@fullcalendar/angular";
import type {
  CalendarOptions,
  EventClickArg,
  EventContentArg,
  EventInput,
  EventMountArg,
} from "@fullcalendar/core";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";

import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { formatShortDate, parseIsoDate, toIsoDate } from "@utils/date";

import type { TimesheetEntry } from "../../models/timesheet-entry";

export interface TimesheetPlannedTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

const TASK_COLORS = ["#465fff", "#12b76a", "#7a5af8", "#ee46bc", "#0ba5ec", "#15b79e"];
const PLANNED_ALPHA = "33";
const TOOLTIP_MAX_LENGTH = 120;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-/i;

function eventNodes(timeText: string, title: string): HTMLElement[] {
  const nodes: HTMLElement[] = [];
  if (timeText) {
    const time = document.createElement("div");
    time.className = "ts-event-time";
    time.textContent = timeText;
    nodes.push(time);
  }
  const text = document.createElement("div");
  text.className = "ts-event-text";
  text.textContent = title;
  nodes.push(text);
  return nodes;
}

function nextDay(iso: string): string {
  const d = parseIsoDate(iso);
  if (!d) return iso;
  d.setDate(d.getDate() + 1);
  return toIsoDate(d);
}

function entryTooltip(entry: TimesheetEntry, timeText: string): string {
  const description = entry.description.trim();
  if (!description) return `${timeText} · Sin descripción`;
  return description.length <= TOOLTIP_MAX_LENGTH
    ? `${timeText} · ${description}`
    : `${timeText} · ${description.slice(0, TOOLTIP_MAX_LENGTH).trimEnd()}… Clic para ver el detalle`;
}

@Component({
  selector: "TimesheetMonthCalendar",
  standalone: true,
  imports: [
    FullCalendarModule,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./timesheet-month-calendar.component.html",
})
export class TimesheetMonthCalendarComponent {
  readonly entries = input<TimesheetEntry[]>([]);
  readonly plannedTasks = input<TimesheetPlannedTask[]>([]);
  readonly initialDate = input<string>("");

  readonly edit = output<TimesheetEntry>();
  readonly dayClick = output<string>();

  private readonly calendar = viewChild(FullCalendarComponent);

  protected readonly showPlanned = signal<boolean>(true);
  protected readonly detailEntry = signal<TimesheetEntry | null>(null);

  protected onShowPlannedChange(event: Event): void {
    this.showPlanned.set((event.target as HTMLInputElement).checked);
  }

  protected readonly legendTasks = computed(() =>
    this.plannedTasks().map((t, i) => ({
      id: t.id,
      name: t.name,
      color: TASK_COLORS[i % TASK_COLORS.length],
    })),
  );

  private readonly taskById = computed(
    () => new Map(this.legendTasks().map((t) => [t.id, t])),
  );

  private entryTitle(entry: TimesheetEntry): string {
    if (entry.kind === "task") {
      return this.taskById().get(entry.task)?.name ?? (entry.description || "Tarea");
    }
    const activity = entry.activity ?? "";
    return activity && !UUID_RE.test(activity)
      ? activity
      : entry.description || "Actividad";
  }

  protected readonly detail = computed(() => {
    const entry = this.detailEntry();
    if (!entry) return null;
    const hours = Math.round(entry.hours * 100) / 100;
    return {
      entry,
      title: this.entryTitle(entry),
      schedule: `${formatShortDate(entry.date)} · ${entry.startTime} - ${entry.endTime} · ${hours} h`,
      progressLabel: entry.kind === "task" ? "Lo que avancé" : "Descripción",
      progress: entry.description.trim() || "Sin descripción.",
    };
  });

  private readonly plannedEvents = computed<EventInput[]>(() =>
    this.plannedTasks().map((t) => {
      const color = this.taskById().get(t.id)?.color ?? TASK_COLORS[0];
      return {
        id: `planned-${t.id}`,
        title: t.name,
        start: t.startDate,
        end: nextDay(t.endDate),
        allDay: true,
        display: "block",
        backgroundColor: `${color}${PLANNED_ALPHA}`,
        borderColor: color,
        classNames: ["ts-event-planned"],
      };
    }),
  );

  private readonly entryEvents = computed<EventInput[]>(() =>
    this.entries().map((e) => {
      const color =
        e.kind === "task" ? this.taskById().get(e.task)?.color : undefined;
      return {
        id: e.id,
        title: this.entryTitle(e),
        start: `${e.date}T${e.startTime}`,
        end: `${e.date}T${e.endTime}`,
        display: "block",
        ...(color ? { backgroundColor: color, borderColor: color } : {}),
        classNames: [e.kind === "task" ? "ts-event-task" : "ts-event-activity"],
        extendedProps: { entry: e },
      };
    }),
  );

  protected readonly options = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    initialDate: this.initialDate() || undefined,
    locale: esLocale,
    firstDay: 1,
    height: "auto",
    fixedWeekCount: false,
    dayMaxEvents: 5,
    headerToolbar: { left: "prev,next today", center: "title", right: "" },
    displayEventEnd: true,
    eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    eventContent: (arg: EventContentArg) => ({
      domNodes: eventNodes(arg.timeText, arg.event.title),
    }),
    eventDidMount: (arg: EventMountArg) => {
      const entry = arg.event.extendedProps["entry"] as TimesheetEntry | undefined;
      arg.el.title = entry
        ? entryTooltip(entry, arg.timeText)
        : `Programado: ${arg.event.title}`;
    },
    events: [
      ...(this.showPlanned() ? this.plannedEvents() : []),
      ...this.entryEvents(),
    ],
    eventClick: (arg: EventClickArg) => {
      const entry = arg.event.extendedProps["entry"] as TimesheetEntry | undefined;
      if (entry) this.detailEntry.set(entry);
    },
    dateClick: (arg: DateClickArg) => this.dayClick.emit(arg.dateStr),
  }));

  protected backToCalendar(): void {
    this.detailEntry.set(null);
    setTimeout(() => this.calendar()?.getApi().updateSize());
  }
}
