import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import {
  IconCalendar24Component,
  IconPlusSimpleComponent,
} from "@shared/icons";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSeparatorComponent } from "@shared/ui/separator";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { compareKeys } from "@utils/collections";
import type { TimesheetViewMode } from "../timesheet-toolbar/timesheet-toolbar.component";
import {
  TIMESHEET_TASKS,
  type TimesheetEntry,
} from "../../models/timesheet-entry";

interface TimesheetBlockViewModel {
  entry: TimesheetEntry;
  kindLabel: string;
  linkLabel: string;
  linkCode?: string;
  durationLabel: string;
  badgeColor: "primary" | "info";
}

function timeToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function roundHalf(value: number): number {
  return Math.round(value * 100) / 100;
}

function blockDuration(start: string, end: string): string {
  const diff = timeToMinutes(end) - timeToMinutes(start);
  if (diff <= 0) return "0 h";
  const hours = roundHalf(diff / 60);
  return `${hours} h`;
}

@Component({
  selector: "TimesheetTimeline",
  standalone: true,
  imports: [
    IconCalendar24Component,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSeparatorComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./timesheet-timeline.component.html",
})
export class TimesheetTimelineComponent {
  readonly entries = input<TimesheetEntry[]>([]);
  readonly heading = input<string>("");
  readonly mode = input<TimesheetViewMode>("day");

  readonly edit = output<TimesheetEntry>();
  readonly remove = output<TimesheetEntry>();
  readonly register = output<void>();

  protected readonly IconPlusSimpleComponent = IconPlusSimpleComponent;

  protected readonly sortedEntries = computed<TimesheetEntry[]>(() => {
    return [...this.entries()].sort((a, b) =>
      compareKeys(a.startTime, b.startTime),
    );
  });

  protected readonly blocks = computed<TimesheetBlockViewModel[]>(() =>
    this.sortedEntries().map((entry) => {
      const kindLabel = entry.kind === "task" ? "Tarea" : "Actividad";
      const badgeColor = entry.kind === "task" ? "primary" : "info";
      let linkLabel = "";
      let linkCode: string | undefined;

      if (entry.kind === "task") {
        const task = TIMESHEET_TASKS.find((t) => t.id === entry.task);
        linkLabel = task?.name ?? "Tarea sin asignar";
        linkCode = entry.taskCode ?? task?.code;
      } else {
        linkLabel = entry.activity ?? "Actividad";
      }

      const durationLabel = blockDuration(entry.startTime, entry.endTime);

      return {
        entry,
        kindLabel,
        linkLabel,
        linkCode,
        durationLabel,
        badgeColor,
      };
    }),
  );

  protected readonly countLabel = computed<string>(() => {
    const n = this.entries().length;
    return `${n} bloque${n === 1 ? "" : "s"}`;
  });

  protected readonly totalHours = computed<number>(() =>
    this.blocks().reduce((acc, b) => acc + b.entry.hours, 0),
  );

  protected readonly totalHoursLabel = computed<string>(
    () => `${roundHalf(this.totalHours())} h`,
  );

  protected readonly sumExplanation = computed<string>(() =>
    this.mode() === "day"
      ? "Dedicación real del día = suma de los bloques."
      : "Dedicación real del período = suma de los bloques.",
  );

  protected readonly emptyTitle = computed<string>(() =>
    this.mode() === "day"
      ? "No registraste bloques este día."
      : "No registraste bloques en este período.",
  );

  protected readonly emptyDescription = computed<string>(() =>
    this.mode() === "day"
      ? "Pulsa “Registrar bloque” para empezar."
      : "Ajusta el rango o registra un nuevo bloque.",
  );
}