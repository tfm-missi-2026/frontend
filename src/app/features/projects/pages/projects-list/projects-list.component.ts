import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import { IconPlusSimpleComponent } from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";

import {
  ProjectFormModalComponent,
} from "../../components/project-form-modal/project-form-modal.component";
import { ProjectsTableComponent } from "../../components/projects-table/projects-table.component";
import { ProjectsToolbarComponent } from "../../components/projects-toolbar/projects-toolbar.component";
import type { Project, ProjectStatus } from "../../models/project";
import { PROJECT_STATUS_OPTIONS } from "../../models/project";
import type { ProjectFormSavePayload } from "../../models/project-form";
import { ProjectsMockService } from "../../services/projects-mock.service";

@Component({
  selector: "ProjectsListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    ProjectFormModalComponent,
    ProjectsTableComponent,
    ProjectsToolbarComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-list.component.html",
})
export class ProjectsListComponent {
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsMockService);

  protected readonly IconPlusSimpleComponent = IconPlusSimpleComponent;

  protected readonly breadcrumbItems = [
    { label: "Operación" },
    { label: "Proyectos" },
  ];

  protected readonly statusOptions = PROJECT_STATUS_OPTIONS;

  protected readonly projects = this.projectsService.projects;

  protected readonly searchTerm = signal<string>("");
  protected readonly filterStatus = signal<ProjectStatus | null>(null);

  protected readonly filteredProjects = computed<Project[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.filterStatus();
    return this.projects().filter((p) => {
      if (status && p.status !== status) return false;
      if (!term) return true;
      return (
        p.code.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term)
      );
    });
  });

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedProject = signal<Project | null>(null);

  protected openCreate(): void {
    this.formMode.set("create");
    this.selectedProject.set(null);
    this.formOpen.set(true);
  }

  protected onView(p: Project): void {
    void this.router.navigate(["/app/operacion/proyectos", p.id]);
  }

  protected onEdit(p: Project): void {
    this.formMode.set("edit");
    this.selectedProject.set(p);
    this.formOpen.set(true);
  }

  protected onDeactivate(p: Project): void {
    this.projectsService.deactivate(p.id);
  }

  protected onSaveProject(payload: ProjectFormSavePayload): void {
    if (payload.mode === "create") {
      this.projectsService.create(payload.data);
    } else {
      this.projectsService.update(payload.id, payload.data);
    }
    this.formOpen.set(false);
  }

  protected onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  protected onStatusChange(value: string | null): void {
    this.filterStatus.set((value as ProjectStatus | null) ?? null);
  }

  protected onClearFilters(): void {
    this.searchTerm.set("");
    this.filterStatus.set(null);
  }
}