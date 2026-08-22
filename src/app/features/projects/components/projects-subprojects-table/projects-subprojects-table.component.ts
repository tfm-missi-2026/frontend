import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";

import { UiBadgeComponent, type BadgeColor } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";
import { formatShortDate } from "@utils/date";
import { range } from "@utils/collections";

import {
  SUBPROJECT_PRIORITY_LABELS,
  SUBPROJECT_SITUATION_LABELS,
  SUBPROJECT_TYPE_LABELS,
  type Subproject,
  type SubprojectPriority,
  type SubprojectSituation,
} from "../../models/subproject";

const PAGE_SIZE = 6;

const PRIORITY_COLOR: Record<SubprojectPriority, BadgeColor> = {
  Alta: "error",
  Media: "warning",
  Baja: "light",
};

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

const PRIORITY_DOT: Record<SubprojectPriority, string> = {
  Alta: "●",
  Media: "●",
  Baja: "○",
};

@Component({
  selector: "ProjectsSubprojectsTable",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiLinkComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-subprojects-table.component.html",
})
export class ProjectsSubprojectsTableComponent {
  readonly subprojects = input<Subproject[]>([]);

  readonly view = output<Subproject>();
  readonly edit = output<Subproject>();
  readonly deactivate = output<Subproject>();
  readonly clearFilters = output<void>();

  protected readonly currentPage = signal(1);

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.subprojects().length / PAGE_SIZE)),
  );

  protected readonly pagedRows = computed<Subproject[]>(() => {
    const all = this.subprojects();
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
    return PRIORITY_COLOR[priority];
  }

  protected priorityDot(priority: SubprojectPriority): string {
    return PRIORITY_DOT[priority];
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

  protected formatDate(iso: string): string {
    return formatShortDate(iso);
  }
}