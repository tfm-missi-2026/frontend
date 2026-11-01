import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import type { BadgeColor } from "@shared/ui/badge";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { formatShortDate } from "@utils/date";

import {
  SUBPROJECT_PRIORITY_ARROW,
  SUBPROJECT_PRIORITY_COLOR,
  SUBPROJECT_PRIORITY_LABELS,
  type Subproject,
  type SubprojectPriority,
} from "../../models/subproject";
import type { TaskSituation } from "../../models/task";

const SITUATION_COLOR: Record<TaskSituation, BadgeColor> = {
  Pendiente: "light",
  "En atención": "info",
  Culminado: "success",
  Rechazado: "error",
};

@Component({
  selector: "ProjectsTasksHeader",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-tasks-header.component.html",
})
export class ProjectsTasksHeaderComponent {
  readonly subproject = input.required<Subproject>();
  readonly projectName = input<string>("");

  protected readonly priorityColor = computed<BadgeColor>(
    () => SUBPROJECT_PRIORITY_COLOR[this.subproject().priority],
  );

  protected readonly situationColor = computed<BadgeColor>(
    () => SITUATION_COLOR[this.subproject().situation],
  );

  protected readonly priorityArrow = computed<string>(
    () => SUBPROJECT_PRIORITY_ARROW[this.subproject().priority],
  );

  protected readonly priorityLabel = computed<string>(
    () => SUBPROJECT_PRIORITY_LABELS[this.subproject().priority],
  );

  protected readonly formatRequestDate = computed<string>(() =>
    formatShortDate(this.subproject().requestDate),
  );

  protected readonly situationLabel = computed<string>(
    () => this.subproject().situation,
  );
}