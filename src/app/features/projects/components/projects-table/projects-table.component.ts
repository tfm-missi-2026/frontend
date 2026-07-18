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
import { RouterModule } from "@angular/router";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";

import { UsersMockService } from "@features/users/services/users-mock.service";

import {
  PROJECT_STATUS_LABELS,
  type Project,
} from "../../models/project";

const PAGE_SIZE = 6;

interface ProjectRow extends Project {
  managerName: string;
}

@Component({
  selector: "ProjectsTable",
  standalone: true,
  imports: [
    RouterModule,
    UiBadgeComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiLinkComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-table.component.html",
})
export class ProjectsTableComponent {
  private readonly usersService = inject(UsersMockService);

  readonly projects = input<Project[]>([]);

  readonly view = output<Project>();
  readonly edit = output<Project>();
  readonly deactivate = output<Project>();
  readonly clearFilters = output<void>();

  protected readonly currentPage = signal(1);

  protected readonly rows = computed<ProjectRow[]>(() => {
    const users = this.usersService.users();
    return this.projects().map((p) => ({
      ...p,
      managerName: users.find((u) => u.id === p.managerId)
        ? `${users.find((u) => u.id === p.managerId)!.firstName} ${users.find((u) => u.id === p.managerId)!.lastNamePaternal}`
        : "Sin gestor",
    }));
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.projects().length / PAGE_SIZE)),
  );

  protected readonly pagedRows = computed<ProjectRow[]>(() => {
    const all = this.rows();
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return all.slice(start, start + PAGE_SIZE);
  });

  protected readonly rangeStart = computed<number>(() => {
    const total = this.projects().length;
    if (total === 0) return 0;
    return (this.currentPage() - 1) * PAGE_SIZE + 1;
  });

  protected readonly rangeEnd = computed<number>(() =>
    Math.min(this.currentPage() * PAGE_SIZE, this.projects().length),
  );

  protected readonly pageNumbers = computed<number[]>(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor() {
    effect(() => {
      this.projects();
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

  protected statusLabel(status: Project["status"]): string {
    return PROJECT_STATUS_LABELS[status];
  }
}