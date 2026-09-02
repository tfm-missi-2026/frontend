import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import { IconPlusSimpleComponent } from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { matchesSearch } from "@utils/strings";
import { ToastService } from "@core/http/toast.service";

import {
  ProjectFormModalComponent,
} from "../../components/project-form-modal/project-form-modal.component";
import { ProjectsTableComponent } from "../../components/projects-table/projects-table.component";
import { ProjectsToolbarComponent } from "../../components/projects-toolbar/projects-toolbar.component";
import type { Project, ProjectStatus } from "../../models/project";
import { PROJECT_STATUS_OPTIONS } from "../../models/project";
import type { ProjectFormSavePayload } from "../../models/project-form";
import { ProjectsService } from "../../services/projects.service";

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
export class ProjectsListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    void this.projectsService.cargar();
  }

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
    const term = this.searchTerm();
    const status = this.filterStatus();
    return this.projects().filter((p) => {
      if (status && p.status !== status) return false;
      return matchesSearch(term, p.code, p.name);
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
    void this.router.navigate([
      "/app/operacion/proyectos",
      p.id,
      "subproyectos",
    ]);
  }

  protected onEdit(p: Project): void {
    if (p.status !== "active") {
      this.toastService.warning(
        "No se pueden editar proyectos inactivos.",
        "Proyecto inactivo",
      );
      return;
    }
    this.formMode.set("edit");
    this.selectedProject.set(p);
    this.formOpen.set(true);
  }

  protected onDeactivate(p: Project): void {
    void this.projectsService.deactivate(p.id);
  }

  protected async onSaveProject(payload: ProjectFormSavePayload): Promise<void> {
    if (payload.mode === "create") {
      const created = await this.projectsService.create(payload.data);
      if (created) {
        this.formOpen.set(false);
        this.toastService.success(
          `El proyecto "${created.name}" se creó correctamente.`,
          "Proyecto creado",
        );
      }
    } else {
      const updated = await this.projectsService.update(
        payload.id,
        payload.data,
      );
      if (updated) {
        this.formOpen.set(false);
        this.toastService.success(
          `El proyecto "${updated.name}" se actualizó correctamente.`,
          "Proyecto actualizado",
        );
      }
    }
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