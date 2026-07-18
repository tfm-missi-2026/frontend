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

import {
  SUBPROJECT_PRIORITY_LABELS,
  type Subproject,
  type SubprojectPriority,
} from "../../models/subproject";
import type { TaskSituation } from "../../models/task";

function formatShortDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

const PRIORITY_COLOR: Record<SubprojectPriority, BadgeColor> = {
  Alta: "error",
  Media: "warning",
  Baja: "light",
};

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
    () => PRIORITY_COLOR[this.subproject().priority],
  );

  protected readonly situationColor = computed<BadgeColor>(
    () => SITUATION_COLOR[this.subproject().situation],
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