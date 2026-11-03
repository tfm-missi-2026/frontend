import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import {
  IconEditPencilComponent,
  IconEyeComponent,
  IconTrashComponent,
} from "@shared/icons";
import type { BadgeColor } from "@shared/ui/badge";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiLabelComponent } from "@shared/ui/label";
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
  "w-16 shrink-0 justify-center",
  "w-24 shrink-0",
  "w-24 shrink-0",
  "w-28 shrink-0 justify-center",
  "w-30 shrink-0",
  "w-22 shrink-0",
  "w-32 shrink-0",
  "flex-1 shrink-0 justify-end",
] as const;

const HEADER_LABELS = [
  "Nombre",
  "Días",
  "Inicio planif.",
  "Fin planif.",
  "Horas est.",
  "Situación",
  "Estado",
  "Origen",
  "Acciones",
];

@Component({
  selector: "ProjectsTasksTable",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiFlexComponent,
    UiIconButtonComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-tasks-table.component.html",
})
export class ProjectsTasksTableComponent {
  protected readonly editIcon = IconEditPencilComponent;
  protected readonly trashIcon = IconTrashComponent;
  protected readonly viewIcon = IconEyeComponent;

  readonly tasks = input<Task[]>([]);
  readonly frozen = input<boolean>(false);

  readonly edit = output<Task>();
  readonly deactivate = output<Task>();
  readonly view = output<Task>();

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

  protected rowClasses(_index: number, _total: number): string {
    return "border-b border-gray-100 dark:border-gray-800 px-4 py-3.5";
  }
}