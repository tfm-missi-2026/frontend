import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from "@angular/core";

import {
  IconEditPencilComponent,
  IconEyeComponent,
  IconTrashComponent,
} from "@shared/icons";
import { UiBadgeComponent, type BadgeColor } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiLabelComponent } from "@shared/ui/label";
import { range } from "@utils/collections";

import { TasksService } from "../../services/tasks.service";

import {
  SUBPROJECT_PRIORITY_ARROW,
  SUBPROJECT_PRIORITY_COLOR,
  SUBPROJECT_PRIORITY_LABELS,
  SUBPROJECT_SITUATION_LABELS,
  SUBPROJECT_TYPE_LABELS,
  type Subproject,
  type SubprojectPriority,
  type SubprojectSituation,
} from "../../models/subproject";

const PAGE_SIZE = 6;

interface SubprojectRow extends Subproject {
  doneTaskCount: number;
}

const SITUATION_COLOR: Record<SubprojectSituation, BadgeColor> = {
  Pendiente: "light",
  "En atención": "info",
  Culminado: "success",
  Rechazado: "error",
};

const SITUATION_PREFIX: Record<SubprojectSituation, string> = {
  Pendiente: "○",
  "En atención": "◐",
  Culminado: "●",
  Rechazado: "✕",
};

@Component({
  selector: "ProjectsSubprojectsTable",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiFlexComponent,
    UiIconButtonComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-subprojects-table.component.html",
})
export class ProjectsSubprojectsTableComponent {
  private readonly tasksService = inject(TasksService);

  protected readonly viewIcon = IconEyeComponent;
  protected readonly editIcon = IconEditPencilComponent;
  protected readonly trashIcon = IconTrashComponent;

  readonly subprojects = input<Subproject[]>([]);

  readonly view = output<Subproject>();
  readonly edit = output<Subproject>();
  readonly deactivate = output<Subproject>();
  readonly clearFilters = output<void>();

  protected readonly currentPage = signal(1);

  protected readonly rows = computed<SubprojectRow[]>(() => {
    const progress = this.tasksService.progressBySubproject();
    return this.subprojects().map((s) => ({
      ...s,
      taskCount: progress[s.id]?.total ?? 0,
      doneTaskCount: progress[s.id]?.done ?? 0,
    }));
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.rows().length / PAGE_SIZE)),
  );

  protected readonly pagedRows = computed<SubprojectRow[]>(() => {
    const all = this.rows();
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return all.slice(start, start + PAGE_SIZE);
  });

  protected readonly rangeStart = computed<number>(() => {
    const total = this.subprojects().length;
    if (total === 0) return 0;
    return (this.currentPage() - 1) * PAGE_SIZE + 1;
  });

  protected readonly rangeEnd = computed<number>(() =>
    Math.min(this.currentPage() * PAGE_SIZE, this.subprojects().length),
  );

  protected readonly pageNumbers = computed<number[]>(() => {
    return range(this.totalPages());
  });

  constructor() {
    void this.tasksService.cargar();
    effect(() => {
      this.subprojects();
      this.currentPage.set(1);
    });
  }

  protected goToPage(p: number): void {
    this.currentPage.set(p);
  }

  protected goToPrevious(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((v) => v - 1);
    }
  }

  protected goToNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((v) => v + 1);
    }
  }

  protected typeLabel(type: Subproject["type"]): string {
    return SUBPROJECT_TYPE_LABELS[type];
  }

  protected priorityLabel(priority: SubprojectPriority): string {
    return SUBPROJECT_PRIORITY_LABELS[priority];
  }

  protected priorityColor(priority: SubprojectPriority): BadgeColor {
    return SUBPROJECT_PRIORITY_COLOR[priority];
  }

  protected priorityArrow(priority: SubprojectPriority): string {
    return SUBPROJECT_PRIORITY_ARROW[priority];
  }

  protected situationLabel(situation: SubprojectSituation): string {
    return SUBPROJECT_SITUATION_LABELS[situation];
  }

  protected situationColor(situation: SubprojectSituation): BadgeColor {
    return SITUATION_COLOR[situation];
  }

  protected situationPrefix(situation: SubprojectSituation): string {
    return SITUATION_PREFIX[situation];
  }

}