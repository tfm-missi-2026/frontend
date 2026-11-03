import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";

import { ProjectsService } from "@features/projects/services/projects.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiLabelComponent } from "@shared/ui/label";
import { formatShortDate, isIsoDate } from "@utils/date";

import type { Variation } from "../../models/variation";

function changeLines(value: string): string[] {
  if (!value) return [];
  if (isIsoDate(value)) return [formatShortDate(value)];
  const text: string = value;
  return text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

@Component({
  selector: "VariationReadOnlyBlock",
  standalone: true,
  imports: [UiBadgeComponent, UiFlexComponent, UiGridComponent, UiLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./variation-readonly-block.component.html",
})
export class VariationReadOnlyBlockComponent {
  private readonly projectsService = inject(ProjectsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly tasksService = inject(TasksService);

  readonly variation = input.required<Variation>();

  protected readonly targetLabel = computed<string>(() => {
    const t = this.variation().target;
    return t?.label ?? "(sin tarea específica)";
  });

  protected readonly targetRef = computed<string | null>(() => {
    const t = this.variation().target;
    return t?.ref ?? null;
  });

  protected readonly contextLabel = computed<string>(() => {
    const v = this.variation();
    const t = v.target;
    const subprojectId =
      t?.kind === "subproject"
        ? t.subprojectId
        : t
          ? this.tasksService.getById(t.taskId)?.subprojectId
          : undefined;
    const sub = this.subprojectsService.subs().find((s) => s.id === subprojectId);
    const projectId = v.projectId ?? sub?.projectId ?? null;
    const project = projectId ? this.projectsService.getById(projectId) : undefined;
    return [project?.name, sub?.description].filter(Boolean).join(" · ");
  });

  protected readonly detectionLabel = computed<string>(() =>
    formatShortDate(this.variation().detectionDate),
  );

  protected readonly previousLines = computed<string[]>(() =>
    changeLines(this.variation().previousValue),
  );

  protected readonly newLines = computed<string[]>(() =>
    changeLines(this.variation().newValue),
  );

  protected readonly hasChange = computed<boolean>(
    () => this.previousLines().length > 0 || this.newLines().length > 0,
  );
}
