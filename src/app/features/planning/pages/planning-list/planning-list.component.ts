import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import type { SelectOption } from "@shared/ui/select";
import { todayIso } from "@utils/date";

import {
  AssignmentFormModalComponent,
} from "../../components/assignment-form-modal/assignment-form-modal.component";
import {
  OverloadDialogComponent,
} from "../../components/overload-dialog/overload-dialog.component";
import { FreezeBaselineDialogComponent } from "../../components/freeze-baseline-dialog/freeze-baseline-dialog.component";
import { DeleteAssignmentDialogComponent } from "../../components/delete-assignment-dialog/delete-assignment-dialog.component";
import { AssignmentDetailDialogComponent } from "../../components/assignment-detail-dialog/assignment-detail-dialog.component";
import {
  PlanningTableComponent,
  type AssignmentRowViewModel,
} from "../../components/planning-table/planning-table.component";
import {
  PlanningToolbarComponent,
} from "../../components/planning-toolbar/planning-toolbar.component";
import type { Assignment } from "../../models/assignment";
import type {
  AssignmentFormSavePayload,
  OverloadRequest,
} from "../../models/assignment-form";
import { AssignmentsService } from "../../services/assignments.service";
import type { LineaBaseApi } from "../../models/linea-base-api";
import { LineaBaseService } from "../../services/linea-base.service";
import { subprojectDisplayLabel } from "@features/projects/models/subproject";
import type { Task } from "@features/projects/models/task";
import { ProjectsService } from "@features/projects/services/projects.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { UsersService } from "@features/users/services/users.service";

const WORKDAY_HOURS = 8;

@Component({
  selector: "PlanningListPage",
  standalone: true,
  imports: [
    AssignmentDetailDialogComponent,
    AssignmentFormModalComponent,
    CommonBreadcrumbComponent,
    OverloadDialogComponent,
    FreezeBaselineDialogComponent,
    DeleteAssignmentDialogComponent,
    PlanningTableComponent,
    PlanningToolbarComponent,
    UiAlertComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./planning-list.component.html",
})
export class PlanningListComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly tasksService = inject(TasksService);
  private readonly usersService = inject(UsersService);
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly lineaBaseService = inject(LineaBaseService);

  ngOnInit(): void {
    void this.cargarDatos();
  }

  private async cargarDatos(): Promise<void> {
    await Promise.all([
      this.projectsService.cargar(),
      this.subprojectsService.cargar(),
      this.tasksService.cargar(),
      this.usersService.cargar(),
    ]);
    await this.assignmentsService.cargar();
    const pid = this.selectedProjectId();
    if (pid) await this.lineaBaseService.cargarPorProyecto(pid);
  }


  protected readonly projects = this.projectsService.projects;

  protected readonly projectOptions = computed<SelectOption[]>(() =>
    this.projects()
      .filter((p) => p.status === "active")
      .map((p) => ({ value: p.id, label: `${p.code} · ${p.name}` })),
  );

  protected readonly selectedProjectId = signal<string | null>(null);

  protected readonly selectedProject = computed(() => {
    const id = this.selectedProjectId();
    return id ? this.projectsService.getById(id) : undefined;
  });

  protected readonly subprojectsInProject = computed(() => {
    const id = this.selectedProjectId();
    return id ? this.subprojectsService.getByProject(id) : [];
  });

  protected readonly tasksInProject = computed(() => {
    const subs = this.subprojectsInProject();
    return subs.flatMap((s) => this.tasksService.getBySubproject(s.id));
  });

  protected readonly assignableTasks = computed<Task[]>(() => {
    const assigned = this.assignedTaskIds();
    const frozen = this.frozenTaskIds();
    const editingTaskId = this.selectedAssignment()?.taskId;
    const tasks = this.tasksInProject();
    const frozenSubprojects = new Set(
      tasks.filter((t) => frozen.has(t.id)).map((t) => t.subprojectId),
    );
    return tasks.filter(
      (t) =>
        t.id === editingTaskId ||
        (t.active &&
          !assigned.has(t.id) &&
          !frozenSubprojects.has(t.subprojectId)),
    );
  });

  protected readonly assignableSubprojectOptions = computed<SelectOption[]>(
    () => {
      const withTasks = new Set(
        this.assignableTasks().map((t) => t.subprojectId),
      );
      return this.subprojectsInProject()
        .filter((s) => withTasks.has(s.id))
        .map((s) => ({ value: s.id, label: subprojectDisplayLabel(s) }));
    },
  );

  protected readonly resourceOptions = computed<SelectOption[]>(() =>
    this.usersService
      .users()
      .filter((u) => u.role === "recurso_tecnico" && u.status === "active")
      .map((u) => ({
        value: u.id,
        label: `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal} — Recurso Técnico`,
      })),
  );

  protected readonly resourceNames = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const u of this.usersService.users()) {
      map[u.id] = `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`;
    }
    return map;
  });

  protected readonly assignments = computed<Assignment[]>(() => {
    const id = this.selectedProjectId();
    if (!id) return [];
    const subIds = new Set(this.subprojectsInProject().map((s) => s.id));
    const taskIds = new Set(
      this.tasksService
        .tasks()
        .filter((t) => subIds.has(t.subprojectId))
        .map((t) => t.id),
    );
    return this.assignmentsService
      .assignments()
      .filter((a) => a.active && taskIds.has(a.taskId));
  });

  protected readonly rows = computed<AssignmentRowViewModel[]>(() => {
    const tasks = this.tasksInProject();
    const subs = this.subprojectsInProject();
    const resources = this.usersService.users();
    const frozen = this.frozenTaskIds();
    return this.assignments().map((a) => {
      const t = tasks.find((x) => x.id === a.taskId);
      const sub = t ? subs.find((s) => s.id === t.subprojectId) : undefined;
      const r = resources.find((x) => x.id === a.resourceId);
      return {
        ...a,
        taskName: t?.name ?? "Tarea sin asignar",
        subprojectName: sub ? `${sub.description} · ${sub.type}` : "—",
        subprojectPriority: sub?.priority ?? null,
        resourceName: r
          ? `${r.firstName} ${r.lastNamePaternal} ${r.lastNameMaternal}`
          : "Sin recurso",
        resourceRole: r ? "Recurso Técnico" : "—",
        taskDays: t?.estimatedDays ?? 0,
        frozen: frozen.has(a.taskId),
      };
    });
  });

  protected readonly totalHours = computed<number>(() =>
    this.rows().reduce((acc, r) => acc + r.plannedHours, 0),
  );

  protected readonly workdays = computed<number>(() => {
    const h = this.totalHours();
    return Math.round((h / WORKDAY_HOURS) * 100) / 100;
  });

  protected readonly distinctResourceCount = computed<number>(() => {
    const ids = new Set(this.rows().map((r) => r.resourceId));
    return ids.size;
  });

  private readonly frozenTaskIds = computed<ReadonlySet<string>>(
    () => new Set(this.currentBaseline()?.tareas.map((t) => t.tareaId) ?? []),
  );

  private readonly assignedTaskIds = computed<ReadonlySet<string>>(
    () => new Set(this.assignments().map((a) => a.taskId)),
  );

  private readonly pendingGroups = computed(() => {
    const tasks = this.tasksInProject();
    const frozen = this.frozenTaskIds();
    return this.subprojectsInProject()
      .filter((s) => s.active)
      .map((s) => ({
        all: tasks.filter((t) => t.subprojectId === s.id),
        active: tasks.filter((t) => t.subprojectId === s.id && t.active),
      }))
      .filter((g) => g.active.length > 0 && !g.all.some((t) => frozen.has(t.id)))
      .map((g) => g.active);
  });

  private readonly pendingTasks = computed(() => this.pendingGroups().flat());

  private readonly tasksToFreeze = computed<ReadonlySet<string>>(() => {
    const assigned = this.assignedTaskIds();
    return new Set(
      this.pendingGroups()
        .filter((group) => group.every((t) => assigned.has(t.id)))
        .flat()
        .map((t) => t.id),
    );
  });

  private readonly assignmentsToFreeze = computed(() => {
    const ids = this.tasksToFreeze();
    return this.assignments().filter((a) => ids.has(a.taskId));
  });

  protected readonly freezeAssignmentCount = computed<number>(
    () => this.assignmentsToFreeze().length,
  );

  protected readonly freezeResourceCount = computed<number>(
    () => new Set(this.assignmentsToFreeze().map((a) => a.resourceId)).size,
  );

  protected readonly freezeHours = computed<number>(() =>
    this.assignmentsToFreeze().reduce((acc, a) => acc + a.plannedHours, 0),
  );

  protected readonly activeTaskCount = computed<number>(
    () => this.pendingTasks().length,
  );

  protected readonly assignedTaskCount = computed<number>(() => {
    const assigned = this.assignedTaskIds();
    return this.pendingTasks().filter((t) => assigned.has(t.id)).length;
  });

  protected readonly allFrozen = computed<boolean>(
    () => !!this.currentBaseline() && this.pendingTasks().length === 0,
  );

  protected readonly canFreeze = computed<boolean>(
    () => this.tasksToFreeze().size > 0,
  );

  protected readonly freezeHint = computed<string>(() => {
    if (this.allFrozen()) {
      return "Todos los subproyectos ya están congelados.";
    }
    if (this.pendingTasks().length === 0) {
      return "El proyecto todavía no tiene tareas.";
    }
    return this.canFreeze()
      ? "Guarda el plan actual como referencia."
      : "Asigna todas las tareas de un subproyecto para poder congelar.";
  });

  protected readonly breadcrumbItems = [
    { label: "Operación" },
    { label: "Planificación" },
  ];

  protected readonly freezeAlert = signal<string | null>(null);

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedAssignment = signal<Assignment | null>(null);

  protected readonly overloadOpen = signal<boolean>(false);
  protected readonly pendingOverload = signal<OverloadRequest | null>(null);

  protected onProjectChange(value: string | null): void {
    this.selectedProjectId.set(value);
    this.formOpen.set(false);
    if (value) void this.lineaBaseService.cargarPorProyecto(value);
  }

  protected readonly freezeOpen = signal<boolean>(false);
  protected readonly freezeSaving = signal<boolean>(false);

  protected readonly currentBaseline = computed<LineaBaseApi | null>(() => {
    const id = this.selectedProjectId();
    if (!id) return null;
    return this.lineaBaseService.latestByProject()[id] ?? null;
  });

  protected onFreeze(): void {
    if (!this.selectedProjectId()) return;
    this.freezeOpen.set(true);
  }

  protected onFreezeCancel(): void {
    this.freezeOpen.set(false);
  }

  protected async onFreezeConfirm(): Promise<void> {
    const id = this.selectedProjectId();
    if (!id || this.freezeSaving()) return;
    this.freezeSaving.set(true);
    try {
      const ok = await this.lineaBaseService.congelar(
        id,
        `Snapshot ${todayIso()}`,
        this.tasksToFreeze(),
      );
      if (ok) {
        this.freezeOpen.set(false);
        this.flashAlert("Línea base congelada correctamente.");
      }
    } finally {
      this.freezeSaving.set(false);
    }
  }

  protected onSearchClear(): void {}

  protected openCreate(): void {
    this.formMode.set("create");
    this.selectedAssignment.set(null);
    this.formOpen.set(true);
  }

  protected onEdit(a: Assignment): void {
    this.formMode.set("edit");
    this.selectedAssignment.set(a);
    this.formOpen.set(true);
  }

  protected readonly detailRow = signal<AssignmentRowViewModel | null>(null);

  protected readonly deleteTarget = signal<Assignment | null>(null);
  protected readonly deleteSaving = signal<boolean>(false);

  protected readonly deleteRow = computed<AssignmentRowViewModel | null>(() => {
    const target = this.deleteTarget();
    if (!target) return null;
    return this.rows().find((r) => r.id === target.id) ?? null;
  });

  protected onRemove(a: Assignment): void {
    this.deleteTarget.set(a);
  }

  protected onDeleteCancel(): void {
    this.deleteTarget.set(null);
  }

  protected async onDeleteConfirm(): Promise<void> {
    const target = this.deleteTarget();
    const id = this.selectedProjectId();
    if (!target || !id || this.deleteSaving()) return;
    this.deleteSaving.set(true);
    try {
      const ok = await this.assignmentsService.deactivate(id, target.id);
      if (ok) {
        const nombre = this.deleteRow()?.resourceName ?? "la asignación";
        this.deleteTarget.set(null);
        this.flashAlert(`Se eliminó la asignación de ${nombre}.`);
      }
    } finally {
      this.deleteSaving.set(false);
    }
  }

  protected readonly formSaving = signal<boolean>(false);

  protected async onSave(payload: AssignmentFormSavePayload): Promise<void> {
    if (this.formSaving()) return;
    this.formSaving.set(true);
    try {
      await this.guardar(payload);
    } finally {
      this.formSaving.set(false);
    }
  }

  private async guardar(payload: AssignmentFormSavePayload): Promise<void> {
    if (payload.mode === "create") {
      const created = await this.assignmentsService.create(
        payload.projectId,
        payload.data,
      );
      if (created) this.formOpen.set(false);
    } else {
      const updated = await this.assignmentsService.update(
        payload.projectId,
        payload.id,
        payload.data,
      );
      if (updated) this.formOpen.set(false);
    }
  }

  protected onOverloadRequest(req: OverloadRequest): void {
    this.pendingOverload.set(req);
    this.formOpen.set(false);
    this.overloadOpen.set(true);
  }

  protected onOverloadCancel(): void {
    this.pendingOverload.set(null);
    this.overloadOpen.set(false);
  }

  private flashAlert(message: string): void {
    this.freezeAlert.set(message);
    setTimeout(() => this.freezeAlert.set(null), 3000);
  }
}