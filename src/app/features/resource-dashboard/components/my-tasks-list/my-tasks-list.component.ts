import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

import { UiBadgeComponent, type BadgeColor } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { TaskSituation } from "@features/projects/models/task";

import type { ResourceMyTask } from "../../services/resource-dashboard.service";

@Component({
  selector: "MyTasksList",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./my-tasks-list.component.html",
})
export class MyTasksListComponent {
  readonly tasks = input<ResourceMyTask[]>([]);

  protected readonly taskCount = computed<number>(() => this.tasks().length);

  protected readonly situationColor = (
    s: TaskSituation,
  ): BadgeColor => {
    switch (s) {
      case "Pendiente":
        return "warning";
      case "En atención":
        return "info";
      case "Culminado":
        return "success";
      case "Rechazado":
        return "error";
      default:
        return "light";
    }
  };
}