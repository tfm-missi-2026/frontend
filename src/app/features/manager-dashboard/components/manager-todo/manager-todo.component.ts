import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { formatShortDate } from "@utils/date";

import type {
  TodoDueTask,
  TodoVariation,
} from "../../services/manager-dashboard.service";

@Component({
  selector: "ManagerTodo",
  standalone: true,
  imports: [
    RouterLink,
    UiBadgeComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./manager-todo.component.html",
})
export class ManagerTodoComponent {
  readonly pendingVariations = input<TodoVariation[]>([]);
  readonly upcomingTasks = input<TodoDueTask[]>([]);

  protected formatDate(iso: string): string {
    return formatShortDate(iso);
  }
}
