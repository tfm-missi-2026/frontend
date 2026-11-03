import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";

import { UiBadgeComponent, type BadgeColor } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { TaskSituation } from "@features/projects/models/task";

import type {
  ResourceMyTask,
  ResourceTaskNextSituation,
} from "../../services/resource-dashboard.service";

@Component({
  selector: "MyTasksList",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiButtonComponent,
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
  readonly saving = input<boolean>(false);

  readonly advance = output<{
    task: ResourceMyTask;
    situation: ResourceTaskNextSituation;
  }>();

  protected nextAction(
    s: TaskSituation,
  ): { label: string; situation: ResourceTaskNextSituation } | null {
    if (s === "Pendiente") return { label: "Iniciar", situation: "En atencion" };
    if (s === "En atención") return { label: "Culminar", situation: "Culminado" };
    return null;
  }

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