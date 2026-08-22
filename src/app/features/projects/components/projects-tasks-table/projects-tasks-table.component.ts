import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import type { BadgeColor } from "@shared/ui/badge";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { formatShortDate } from "@utils/date";

import type { Task, TaskSituation } from "../../models/task";

const SITUATION_COLOR: Record<TaskSituation, BadgeColor> = {
  Pendiente: "light",
  "En atención": "info",
  Culminado: "success",
  Rechazado: "error",
};

const SITUATION_PREFIX: Record<TaskSituation, string> = {
  Pendiente: "○",
  "En atención": "◐",
  Culminado: "●",
  Rechazado: "✕",
};

const COLUMN_CLASSES = [
  "flex-1 min-w-0",
  "w-24 shrink-0",
  "w-24 shrink-0",
  "w-21 shrink-0 justify-center",
  "w-30 shrink-0",
  "w-32 shrink-0",
  "w-30 shrink-0",
  "flex-1 shrink-0 justify-end",
] as const;

const HEADER_LABELS = [
  "Nombre",
  "Inicio planif.",
  "Fin planif.",
  "Horas est.",
  "Situación",
  "Origen",
  "Depende de",
  "Acciones",
];

@Component({
  selector: "ProjectsTasksTable",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiLinkComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-tasks-table.component.html",
})
export class ProjectsTasksTableComponent {
  readonly tasks = input<Task[]>([]);

  readonly edit = output<Task>();
  readonly deactivate = output<Task>();

  protected readonly columnClasses = COLUMN_CLASSES;
  protected readonly headerLabels = HEADER_LABELS;

  protected readonly situationColor = (s: TaskSituation) =>
    SITUATION_COLOR[s];
  protected readonly situationPrefix = (s: TaskSituation) =>
    SITUATION_PREFIX[s];

  protected readonly situationLabel = computed(() =>
    this.tasks().reduce<string[]>((acc, t) => {
      if (!acc.includes(t.situation)) acc.push(t.situation);
      return acc;
    }, []),
  );

  protected formatDate(iso: string | null): string {
    return formatShortDate(iso);
  }

  protected dependsLabel(t: Task, all: Task[]): string {
    if (!t.dependsOnIds.length) return "—";
    const names = t.dependsOnIds
      .map((id) => all.find((x) => x.id === id)?.name)
      .filter((n): n is string => !!n);
    return names.length ? names.join(" · ") : "—";
  }

  protected rowClasses(_index: number, _total: number): string {
    return "border-b border-gray-100 dark:border-gray-800 px-4 py-3.5";
  }
}