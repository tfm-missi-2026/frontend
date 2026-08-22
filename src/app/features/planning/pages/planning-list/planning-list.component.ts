import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { IconPlusSimpleComponent } from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
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
import { LineaBaseService } from "../../services/linea-base.service";
import { ProjectsService } from "@features/projects/services/projects.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { UsersService } from "@features/users/services/users.service";

const WORKDAY_HOURS = 8;

@Component({
  selector: "PlanningListPage",
  standalone: true,
  imports: [
    AssignmentFormModalComponent,
    CommonBreadcrumbComponent,
    OverloadDialogComponent,
    PlanningTableComponent,
    PlanningToolbarComponent,
    UiAlertComponent,
    UiButtonComponent,
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
    void this.projectsService.cargar();
    void this.subprojectsService.cargar();
    void this.tasksService.cargar();
    void this.usersService.cargar();
    void this.assignmentsService.cargar();
    const pid = this.selectedProjectId();
    if (pid) void this.lineaBaseService.cargarPorProyecto(pid);
  }

  protected readonly IconPlusSimpleComponent = IconPlusSimpleComponent;

  protected readonly projects = this.projectsService.projects;

  protected readonly projectOptions = computed<SelectOption[]>(() =>
    this.projects()
      .filter((p) => p.status === "active")
      .map((p) => ({ value: p.id, label: `${p.code} · ${p.name}` })),
  );

  protected readonly selectedProjectId = signal<string | null>("p-sigtramites");

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

  protected readonly taskOptions = computed<SelectOption[]>(() => {
    const subs = this.subprojectsInProject();
    return this.tasksInProject().map((t) => {
      const sub = subs.find((s) => s.id === t.subprojectId);
      const subLabel = sub?.ticket ?? t.subprojectId;
      return {
        value: t.id,
        label: `${t.name} · #${subLabel}`,
      };
    });
  });

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
    return this.assignmentsService.getByProject(id);
  });

  protected readonly rows = computed<AssignmentRowViewModel[]>(() => {
    const tasks = this.tasksInProject();
    const subs = this.subprojectsInProject();
    const resources = this.usersService.users();
    return this.assignments().map((a) => {
      const t = tasks.find((x) => x.id === a.taskId);
      const sub = t ? subs.find((s) => s.id === t.subprojectId) : undefined;
      const r = resources.find((x) => x.id === a.resourceId);
      return {
        ...a,
        taskName: t?.name ?? "Tarea sin asignar",
        taskSubprojectLabel: sub
          ? `#${sub.ticket ?? sub.id} · ${sub.type}`
          : "—",
        resourceName: r
          ? `${r.firstName} ${r.lastNamePaternal} ${r.lastNameMaternal}`
          : "Sin recurso",
        resourceRole: r ? "Recurso Técnico" : "—",
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

  protected readonly canFreeze = computed<boolean>(
    () => this.assignments().length > 0,
  );

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
  }

  protected async onFreeze(): Promise<void> {
    const id = this.selectedProjectId();
    if (!id) return;
    const ok = await this.lineaBaseService.congelar(
      id,
      `Snapshot ${todayIso()}`,
    );
    if (ok) {
      this.flashAlert(
        `Línea base v${ok.version} congelada correctamente.`,
      );
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

  protected onRemove(a: Assignment): void {
    const id = this.selectedProjectId();
    if (!id) return;
    void this.assignmentsService.deactivate(id, a.id);
  }

  protected async onSave(payload: AssignmentFormSavePayload): Promise<void> {
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

  protected async onOverloadConfirm(): Promise<void> {
    const req = this.pendingOverload();
    if (!req) {
      this.overloadOpen.set(false);
      return;
    }
    const p = req.payload;
    if (p.mode === "create") {
      await this.assignmentsService.create(p.projectId, p.data, true);
    } else {
      await this.assignmentsService.update(
        p.projectId,
        p.id,
        p.data,
        true,
      );
    }
    this.pendingOverload.set(null);
    this.overloadOpen.set(false);
    this.formOpen.set(false);
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