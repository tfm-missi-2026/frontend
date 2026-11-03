import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { matchesSearch } from "@utils/strings";

import { subprojectDisplayLabel } from "@features/projects/models/subproject";
import { LineaBaseService } from "@features/planning/services/linea-base.service";
import { ProjectsService } from "@features/projects/services/projects.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { AssignmentsService } from "@features/planning/services/assignments.service";
import { UsersService } from "@features/users/services/users.service";
import { ToastService } from "@core/http/toast.service";
import { DeleteVariationDialogComponent } from "../../components/delete-variation-dialog/delete-variation-dialog.component";
import { AuthService } from "@core/auth/auth.service";

import {
  VariationsToolbarComponent,
} from "../../components/variations-toolbar/variations-toolbar.component";
import {
  VariationsTableComponent,
  type VariationRowViewModel,
} from "../../components/variations-table/variations-table.component";
import {
  ReportVariationModalComponent,
  type ProjectOption,
  type SubprojectOption,
  type TaskOption,
} from "../../components/report-variation-modal/report-variation-modal.component";
import {
  ResolveVariationModalComponent,
  type ResolveMode,
} from "../../components/resolve-variation-modal/resolve-variation-modal.component";
import type {
  ReportVariationPayload,
  ResolveVariationPayload,
} from "../../models/variation-form";
import {
  VARIATION_STATUS_FILTER_OPTIONS,
  VARIATION_TYPE_FILTER_OPTIONS,
  type Variation,
  type VariationStatus,
  type VariationType,
} from "../../models/variation";
import { VariationsService } from "../../services/variations.service";

// Placeholder mientras el backend no devuelve reportadaPor/resueltoPor como
// nombres. Ahora se calcula del usuario autenticado via AuthService.
function nombreActual(auth: AuthService): string {
  const u = auth.usuario();
  if (!u) return "Usuario actual";
  return u.nombreCompleto || u.email;
}

@Component({
  selector: "VariationsListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    DeleteVariationDialogComponent,
    ReportVariationModalComponent,
    ResolveVariationModalComponent,
    UiBadgeComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
    VariationsTableComponent,
    VariationsToolbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./variations-list.component.html",
})
export class VariationsListComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly tasksService = inject(TasksService);
  private readonly variationsService = inject(VariationsService);
  private readonly auth = inject(AuthService);
  private readonly lineaBaseService = inject(LineaBaseService);
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);

  protected readonly currentReporter = computed(() => nombreActual(this.auth));

  ngOnInit(): void {
    void this.cargarLineasBase();
    void this.subprojectsService.cargar();
    void this.tasksService.cargar();
    void this.variationsService.cargar();
    void this.assignmentsService.cargar();
    void this.usersService.cargar();
  }

  private async cargarLineasBase(): Promise<void> {
    await this.projectsService.cargar();
    await Promise.all(
      this.projectsService
        .projects()
        .map((p) => this.lineaBaseService.cargarPorProyecto(p.id)),
    );
  }

  protected readonly VARIATION_TYPE_FILTER_OPTIONS =
    VARIATION_TYPE_FILTER_OPTIONS;
  protected readonly VARIATION_STATUS_FILTER_OPTIONS =
    VARIATION_STATUS_FILTER_OPTIONS;

  protected readonly breadcrumbItems = [
    { label: "Operación" },
    { label: "Variaciones" },
  ];

  protected readonly searchTerm = signal<string>("");
  protected readonly filterType = signal<VariationType | null>(null);
  protected readonly filterStatus = signal<VariationStatus | null>(null);

  protected readonly reportOpen = signal<boolean>(false);
  protected readonly resolveOpen = signal<boolean>(false);
  protected readonly resolveMode = signal<ResolveMode>("resolve");
  protected readonly selectedVariation = signal<Variation | null>(null);

  private readonly frozenTaskIds = computed<ReadonlySet<string>>(() => {
    const baselines = Object.values(this.lineaBaseService.latestByProject());
    return new Set(baselines.flatMap((b) => b.tareas.map((t) => t.tareaId)));
  });

  protected readonly taskOptions = computed<TaskOption[]>(() => {
    const frozen = this.frozenTaskIds();
    return this.tasksService
      .tasks()
      .filter((t) => t.active && frozen.has(t.id))
      .map((t) => ({
        id: t.id,
        subprojectId: t.subprojectId,
        label: t.name,
        estimatedDays: t.estimatedDays,
        estimatedHours: t.estimatedHours,
      }));
  });

  protected readonly subprojectOptions = computed<SubprojectOption[]>(() => {
    const withTasks = new Set(this.taskOptions().map((t) => t.subprojectId));
    return this.subprojectsService
      .subs()
      .filter((s) => s.active && withTasks.has(s.id))
      .map((s) => ({
        id: s.id,
        projectId: s.projectId,
        label: subprojectDisplayLabel(s),
        ref: s.ticket ? `#${s.ticket}` : null,
      }));
  });

  protected readonly projectOptions = computed<ProjectOption[]>(() => {
    const withTasks = new Set(this.subprojectOptions().map((s) => s.projectId));
    return this.projectsService
      .projects()
      .filter((p) => p.status === "active" && withTasks.has(p.id))
      .map((p) => ({ id: p.id, label: `${p.code} · ${p.name}` }));
  });

  protected readonly rows = computed<VariationRowViewModel[]>(() => {
    const term = this.searchTerm();
    const type = this.filterType();
    const status = this.filterStatus();

    const projectName = (v: Variation): string | null =>
      (v.projectId && this.projectsService.getById(v.projectId)?.name) || null;

    return this.variationsService
      .items()
      .filter((v) => {
        if (type && v.type !== type) return false;
        if (status && v.status !== status) return false;
        return matchesSearch(
          term,
          v.target?.label,
          v.target?.ref,
          projectName(v),
          v.description,
          v.justification,
          v.reportedBy,
        );
      })
      .map((v) => ({
        ...v,
        targetLabel: v.target?.label ?? "(sin tarea específica)",
        projectName: projectName(v),
      }));
  });

  protected readonly pendingCount = computed<number>(
    () => this.variationsService.countByStatus().Pendiente,
  );

  protected readonly approvedCount = computed<number>(
    () => this.variationsService.countByStatus().Aprobada,
  );

  protected readonly rejectedCount = computed<number>(
    () => this.variationsService.countByStatus().Rechazada,
  );

  protected openReport(): void {
    this.reportOpen.set(true);
  }

  protected onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  protected onTypeFilterChange(value: string | null): void {
    this.filterType.set(value as VariationType | null);
  }

  protected onStatusFilterChange(value: string | null): void {
    this.filterStatus.set(value as VariationStatus | null);
  }

  protected onView(v: Variation): void {
    this.selectedVariation.set(v);
    this.resolveMode.set("view");
    this.resolveOpen.set(true);
  }

  protected onResolve(v: Variation): void {
    if (v.status !== "Pendiente") return;
    this.selectedVariation.set(v);
    this.resolveMode.set("resolve");
    this.resolveOpen.set(true);
  }

  protected async onReportSubmit(payload: ReportVariationPayload): Promise<void> {
    // El reportadaPor del backend debe ser el UUID del usuario actual.
    // El mapper del FE lo usa para resolver a nombre via UsersService.
    const authUsuario = this.auth.usuario();
    const userId = authUsuario?.id ?? "";
    const created = await this.variationsService.create(
      userId || payload.reportedBy,
      payload.data,
    );
    if (created) this.reportOpen.set(false);
  }

  protected async onResolveSubmit(payload: ResolveVariationPayload): Promise<void> {
    // resueltoPor lo setea el backend desde CurrentUserResolver (del JWT).
    const resolved = await this.variationsService.resolve(payload.id, payload);
    if (resolved) {
      this.resolveOpen.set(false);
      this.selectedVariation.set(null);
    }
  }

  protected closeReport(): void {
    this.reportOpen.set(false);
  }

  protected closeResolve(): void {
    this.resolveOpen.set(false);
    this.selectedVariation.set(null);
  }

  protected readonly currentResolver = computed(() => nombreActual(this.auth));

  protected readonly canManage = computed<boolean>(
    () => this.auth.usuario()?.rol?.codigo !== "RECURSO_TECNICO",
  );

  protected readonly deleteTarget = signal<Variation | null>(null);
  protected readonly deleteSaving = signal<boolean>(false);

  protected async onDeleteConfirm(v: Variation, reason: string): Promise<void> {
    if (this.deleteSaving()) return;
    this.deleteSaving.set(true);
    try {
      const ok = await this.variationsService.remove(v.id, reason);
      if (ok) {
        this.deleteTarget.set(null);
        this.toastService.success(
          `La variación de "${v.target?.label ?? "la tarea"}" se eliminó correctamente.`,
          "Variación eliminada",
        );
      }
    } finally {
      this.deleteSaving.set(false);
    }
  }
}
