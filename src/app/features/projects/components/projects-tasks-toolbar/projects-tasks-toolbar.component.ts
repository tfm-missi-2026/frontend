import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IconSearchLightComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiInputComponent } from "@shared/ui/input";
import { UiSelectComponent } from "@shared/ui/select";
import type { SelectOption } from "@shared/ui/select";
import type { TaskActiveFilter, TaskSituation } from "../../models/task";

@Component({
  selector: "ProjectsTasksToolbar",
  standalone: true,
  imports: [
    FormsModule,
    UiFlexComponent,
    UiInputComponent,
    UiSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-tasks-toolbar.component.html",
})
export class ProjectsTasksToolbarComponent {
  readonly searchTerm = input<string>("");
  readonly situationValue = input<TaskSituation | null>(null);
  readonly situationOptions = input<SelectOption[]>([]);
  readonly activeValue = input<TaskActiveFilter | null>(null);
  readonly activeOptions = input<SelectOption[]>([]);

  readonly searchChange = output<string>();
  readonly situationChange = output<TaskSituation | null>();
  readonly activeChange = output<TaskActiveFilter | null>();
  readonly clearFilters = output<void>();

  protected readonly IconSearchLightComponent = IconSearchLightComponent;

  protected asSituation(value: unknown): TaskSituation | null {
    const text = this.asString(value);
    return text ? (text as TaskSituation) : null;
  }

  protected asActive(value: unknown): TaskActiveFilter | null {
    const text = this.asString(value);
    return text ? (text as TaskActiveFilter) : null;
  }

  private asString(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) {
      const first = value[0];
      return first === undefined || first === null ? null : String(first);
    }
    const text = String(value);
    return text === "" ? null : text;
  }
}