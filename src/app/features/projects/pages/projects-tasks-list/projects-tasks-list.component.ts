import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";

import {
  IconArrowLeftComponent,
  IconPlusSimpleComponent,
} from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { matchesSearch } from "@utils/strings";

import {
  ProjectsTasksHeaderComponent,
} from "../../components/projects-tasks-header/projects-tasks-header.component";
import {
  ProjectsTasksTableComponent,
} from "../../components/projects-tasks-table/projects-tasks-table.component";
import {
  ProjectsTasksToolbarComponent,
} from "../../components/projects-tasks-toolbar/projects-tasks-toolbar.component";
import {
  TaskFormModalComponent,
} from "../../components/task-form-modal/task-form-modal.component";
import {
  TASK_SITUATION_OPTIONS,
  type Task,
  type TaskSituation,
} from "../../models/task";
import type { TaskFormSavePayload } from "../../models/task-form";
import { ProjectsService } from "../../services/projects.service";
import { SubprojectsService } from "../../services/subprojects.service";
import { TasksService } from "../../services/tasks.service";

@Component({
  selector: "ProjectsTasksListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    ProjectsTasksHeaderComponent,
    ProjectsTasksTableComponent,
    ProjectsTasksToolbarComponent,
    TaskFormModalComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-tasks-list.component.html",
})
export class ProjectsTasksListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly tasksService = inject(TasksService);

  ngOnInit(): void {
    void this.projectsService.cargar();
    void this.subprojectsService.cargar();
    void this.tasksService.cargar();
  }

  constructor() {
    // Recarga tareas del subproyecto cuando cambia el subId en la URL.
    effect(() => {
      const sid = this.subId();
      if (sid) {
        void this.tasksService.cargarPorSubproyecto(sid);
      }
    });
  }

  protected readonly IconArrowLeftComponent = IconArrowLeftComponent;
  protected readonly IconPlusSimpleComponent = IconPlusSimpleComponent;

  protected readonly situationOptions = TASK_SITUATION_OPTIONS;

  protected readonly projectId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get("projectId"))),
    { initialValue: null as string | null },
  );

  protected readonly subId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get("subId"))),
    { initialValue: null as string | null },
  );

  protected readonly project = computed(() => {
    const id = this.projectId();
    return id ? this.projectsService.getById(id) : undefined;
  });

  protected readonly subproject = computed(() => {
    const id = this.subId();
    return id ? this.subprojectsService.getById(id) : undefined;
  });

  protected readonly tasks = computed<Task[]>(() => {
    const id = this.subId();
    return id ? this.tasksService.getBySubproject(id) : [];
  });

  protected readonly candidates = computed<Task[]>(() =>
    this.tasks().filter((t) => t.id !== this.selectedTask()?.id),
  );

  protected readonly searchTerm = signal<string>("");
  protected readonly filterSituation = signal<TaskSituation | null>(null);

  protected readonly visibleTasks = computed<Task[]>(() => {
    const list = this.tasks();
    const term = this.searchTerm();
    const sit = this.filterSituation();
    return list.filter((t) => {
      if (sit && t.situation !== sit) return false;
      return matchesSearch(term, t.name);
    });
  });

  protected readonly totalHours = computed<number>(() =>
    this.visibleTasks().reduce((acc, t) => acc + t.estimatedHours, 0),
  );

  protected readonly workdays = computed<number>(() => {
    const h = this.totalHours();
    return Math.round((h / 8) * 100) / 100;
  });

  protected readonly totalHoursLabel = computed<string>(
    () => `${this.totalHours()} h`,
  );

  protected readonly workdaysLabel = computed<string>(
    () => `${this.workdays().toFixed(2)} jornadas`,
  );

  protected readonly breadcrumbItems = computed(() => {
    const p = this.project();
    const s = this.subproject();
    const items: { label: string; route?: string }[] = [
      { label: "Operación" },
      { label: "Proyectos", route: "/app/operacion/proyectos" },
    ];
    if (p) {
      items.push({
        label: p.code,
        route: `/app/operacion/proyectos/${p.id}`,
      });
    }
    if (s && p) {
      items.push({
        label: `Subproyecto ${s.ticket ?? s.id}`,
        route: `/app/operacion/proyectos/${p.id}/subproyectos/${s.id}`,
      });
    }
    items.push({ label: "Tareas" });
    return items;
  });

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedTask = signal<Task | null>(null);

  protected openCreate(): void {
    this.formMode.set("create");
    this.selectedTask.set(null);
    this.formOpen.set(true);
  }

  protected onEdit(t: Task): void {
    this.formMode.set("edit");
    this.selectedTask.set(t);
    this.formOpen.set(true);
  }

  protected onDeactivate(t: Task): void {
    const subId = this.subId();
    if (!subId) return;
    void this.tasksService.deactivate(subId, t.id);
  }

  protected async onSave(payload: TaskFormSavePayload): Promise<void> {
    if (payload.mode === "create") {
      const created = await this.tasksService.create(
        payload.subprojectId,
        payload.data,
      );
      if (created) this.formOpen.set(false);
    } else {
      const updated = await this.tasksService.update(
        payload.subprojectId,
        payload.id,
        payload.data,
      );
      if (updated) this.formOpen.set(false);
    }
  }

  protected onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  protected onSituationChange(value: TaskSituation | null): void {
    this.filterSituation.set(value);
  }

  protected onClearFilters(): void {
    this.searchTerm.set("");
    this.filterSituation.set(null);
  }

  protected goBack(): void {
    const pid = this.projectId();
    const sid = this.subId();
    if (!pid || !sid) return;
    void this.router.navigate([
      "/app/operacion/proyectos",
      pid,
      "subproyectos",
      sid,
    ]);
  }
}