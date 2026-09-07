import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";

import { IconArrowLeftComponent, IconPlusSimpleComponent } from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiIconComponent } from "@shared/ui/icon";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import { ProjectsSubprojectsHeaderComponent } from "../../components/projects-subprojects-header/projects-subprojects-header.component";
import {
  ProjectsSubprojectsTableComponent,
} from "../../components/projects-subprojects-table/projects-subprojects-table.component";
import {
  ProjectsSubprojectsToolbarComponent,
} from "../../components/projects-subprojects-toolbar/projects-subprojects-toolbar.component";
import {
  SubprojectFormModalComponent,
} from "../../components/subproject-form-modal/subproject-form-modal.component";
import {
  SUBPROJECT_ACTIVE_OPTIONS,
  SUBPROJECT_SITUATION_OPTIONS,
  SUBPROJECT_TYPE_OPTIONS,
  type Subproject,
  type SubprojectActiveFilter,
  type SubprojectSituation,
  type SubprojectType,
} from "../../models/subproject";
import type { SubprojectFormSavePayload } from "../../models/subproject-form";
import { ProjectsService } from "../../services/projects.service";
import { SubprojectsService } from "../../services/subprojects.service";
import { UsersService } from "@features/users/services/users.service";
import { ToastService } from "@core/http/toast.service";

@Component({
  selector: "ProjectsSubprojectsListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    ProjectsSubprojectsHeaderComponent,
    ProjectsSubprojectsTableComponent,
    ProjectsSubprojectsToolbarComponent,
    SubprojectFormModalComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-subprojects-list.component.html",
})
export class ProjectsSubprojectsListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    void this.projectsService.cargar();
    void this.subprojectsService.cargar();
    void this.usersService.cargar();
  }

  constructor() {
    // Recarga subproyectos del proyecto cuando cambia el projectId en la URL.
    effect(() => {
      const pid = this.projectId();
      if (pid) {
        void this.subprojectsService.cargarPorProyecto(pid);
      }
    });
  }

  protected readonly IconArrowLeftComponent = IconArrowLeftComponent;
  protected readonly IconPlusSimpleComponent = IconPlusSimpleComponent;

  protected readonly typeOptions = SUBPROJECT_TYPE_OPTIONS;
  protected readonly situationOptions = SUBPROJECT_SITUATION_OPTIONS;
  protected readonly activeOptions = SUBPROJECT_ACTIVE_OPTIONS;

  protected readonly projectId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get("projectId"))),
    { initialValue: null as string | null },
  );

  protected readonly project = computed(() => {
    const id = this.projectId();
    return id ? this.projectsService.getById(id) : undefined;
  });

  protected readonly subprojects = computed<Subproject[]>(() => {
    const id = this.projectId();
    return id ? this.subprojectsService.getByProject(id) : [];
  });

  protected readonly managerName = computed<string>(() => {
    const p = this.project();
    if (!p) return "";
    const u = this.usersService.users().find((x) => x.id === p.managerId);
    if (!u) return "Sin gestor";
    return `${u.firstName} ${u.lastNamePaternal}`;
  });

  protected readonly searchTerm = signal<string>("");
  protected readonly filterType = signal<SubprojectType | null>(null);
  protected readonly filterSituation = signal<SubprojectSituation | null>(null);
  protected readonly filterActive = signal<SubprojectActiveFilter | null>(null);

  // Conteo de negocio: todos los subproyectos asociados al proyecto,
  // indistintamente de su estado, e independiente del filtro que se
  // este viendo en la tabla.
  protected readonly totalSubCount = computed<number>(
    () => this.subprojects().length,
  );

  protected readonly visibleSubprojects = computed<Subproject[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const t = this.filterType();
    const st = this.filterSituation();
    const activeFilter = this.filterActive();
    return this.subprojects().filter((s) => {
      if (activeFilter === "active" && !s.active) return false;
      if (activeFilter === "inactive" && s.active) return false;
      if (t && s.type !== t) return false;
      if (st && s.situation !== st) return false;
      if (!term) return true;
      const hay = `${s.ticket ?? ""} ${s.description}`.toLowerCase();
      return hay.includes(term);
    });
  });

  protected readonly breadcrumbItems = computed(() => {
    const p = this.project();
    return [
      { label: "Operación" },
      { label: "Proyectos", route: "/app/operacion/proyectos" },
      ...(p ? [{ label: p.code }] : []),
      { label: "Subproyectos" },
    ];
  });

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedSub = signal<Subproject | null>(null);

  protected readonly existingTicketsForForm = computed<string[]>(() => {
    const editingId = this.selectedSub()?.id;
    return this.subprojects()
      .filter((s) => s.active && s.ticket && s.id !== editingId)
      .map((s) => s.ticket as string);
  });

  protected openCreate(): void {
    const p = this.project();
    if (p && p.status !== "active") {
      this.toastService.warning(
        "No se pueden crear subproyectos sobre un proyecto inactivo.",
        "Proyecto inactivo",
      );
      return;
    }
    this.formMode.set("create");
    this.selectedSub.set(null);
    this.formOpen.set(true);
  }

  protected onEdit(s: Subproject): void {
    if (!s.active) {
      this.toastService.warning(
        "No se pueden editar subproyectos inactivos.",
        "Subproyecto inactivo",
      );
      return;
    }
    this.formMode.set("edit");
    this.selectedSub.set(s);
    this.formOpen.set(true);
  }

  protected onView(s: Subproject): void {
    const pid = this.projectId();
    if (!pid) return;
    void this.router.navigate([
      "/app/operacion/proyectos",
      pid,
      "subproyectos",
      s.id,
      "tareas",
    ]);
  }

  protected onDeactivate(s: Subproject): void {
    const pid = this.projectId();
    if (!pid) return;
    void this.subprojectsService.deactivate(pid, s.id);
  }

  protected async onSave(payload: SubprojectFormSavePayload): Promise<void> {
    if (payload.mode === "create") {
      const created = await this.subprojectsService.create(
        payload.projectId,
        payload.data,
      );
      if (created) this.formOpen.set(false);
    } else {
      const updated = await this.subprojectsService.update(
        payload.projectId,
        payload.id,
        payload.data,
      );
      if (updated) this.formOpen.set(false);
    }
  }

  protected onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  protected onTypeChange(value: SubprojectType | null): void {
    this.filterType.set(value);
  }

  protected onSituationChange(value: SubprojectSituation | null): void {
    this.filterSituation.set(value);
  }

  protected onActiveChange(value: SubprojectActiveFilter | null): void {
    this.filterActive.set(value);
  }

  protected onClearFilters(): void {
    this.searchTerm.set("");
    this.filterType.set(null);
    this.filterSituation.set(null);
    this.filterActive.set(null);
  }

  protected goBack(): void {
    void this.router.navigate(["/app/operacion/proyectos"]);
  }
}