import { Injectable, inject, signal } from "@angular/core";

import {
  DEFAULT_PERIOD_ID,
  type ManagerPeriod,
} from "@shared/common";
import { ProjectsService } from "@features/projects/services/projects.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { VariationsService } from "@features/variations/services/variations.service";
import { TeamLoadService } from "@features/team-load/services/team-load.service";

import type { VariationType } from "@features/variations/models/variation";
import { extractProblemMessage } from "@utils/problem-detail";
import { compareIsoDateAsc, compareKeys } from "@utils/collections";

export interface AlertOverload {
  resourceId: string;
  resourceName: string;
  utilizationPct: number;
}

export interface AreaTodoVariation {
  id: string;
  type: VariationType;
  taskName: string;
  ref: string;
  projectName: string;
}

export interface AreaDashboardData {
  managerId: string;
  managerName: string;
  greeting: string;
  period: ManagerPeriod;
  totalUsersActive: number;
  overloadResourcesCount: number;
  teamAverageUtilizationPct: number;
  teamWorkloads: AlertOverload[];
  projectsTotal: number;
  variationsTotal: number;
  pendingVariations: AreaTodoVariation[];
}

@Injectable({ providedIn: "root" })
export class AreaDashboardService {
  private readonly projectsService = inject(ProjectsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly tasksService = inject(TasksService);
  private readonly variationsService = inject(VariationsService);
  private readonly teamLoadService = inject(TeamLoadService);

  // Cache local de workloads (periodo actual). Se llena en cargar().
  private readonly _workloads = this.teamLoadService.workloads;

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private _ultimoPeriodoCarga: { startIso: string; endIso: string } | null =
    null;
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  async cargar(): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      await Promise.all([
        this.projectsService.count() === 0
          ? this.projectsService.cargar()
          : Promise.resolve(),
        this.subprojectsService.count() === 0
          ? this.subprojectsService.cargar()
          : Promise.resolve(),
        this.tasksService.count() === 0
          ? this.tasksService.cargar()
          : Promise.resolve(),
        this.variationsService.count() === 0
          ? this.variationsService.cargar()
          : Promise.resolve(),
      ]);
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  computeDashboard(
    managerId: string,
    managerFirstName: string,
    period: ManagerPeriod,
  ): AreaDashboardData {
    const periodStart = period.startIso;
    const periodEnd = period.endIso;

    const projects = this.projectsService
      .projects()
      .filter((p) => p.status === "active")
      .sort((a, b) => compareIsoDateAsc(a.startDate, b.startDate));

    // Si el periodo del dashboard difiere del periodo cacheado, refrescar.
    if (
      this.teamLoadService.workloads().length === 0 ||
      this._ultimoPeriodoCarga?.startIso !== periodStart ||
      this._ultimoPeriodoCarga?.endIso !== periodEnd
    ) {
      this._ultimoPeriodoCarga = { startIso: periodStart, endIso: periodEnd };
      void this.teamLoadService.computeWorkloads({
        fromIso: periodStart,
        toIso: periodEnd,
      });
    }
    const workloads = this.teamLoadService.workloads();
    const totalUsersActive = workloads.length;

    const withPlan = workloads.filter((w) => w.hasPlan);
    const teamAverageUtilizationPct =
      withPlan.length === 0
        ? 0
        : Math.round(
            withPlan.reduce((acc, w) => acc + w.utilizationPct, 0) /
              withPlan.length,
          );

    const overloads: AlertOverload[] = workloads
      .filter((w) => w.isOverload)
      .sort((a, b) => compareKeys(b.utilizationPct, a.utilizationPct))
      .map((w) => ({
        resourceId: w.resourceId,
        resourceName: w.resourceName,
        utilizationPct: w.utilizationPct,
      }));

    const overloadResourcesCount = overloads.length;

    const teamWorkloadsAll: AlertOverload[] = workloads
      .slice()
      .sort((a, b) => compareKeys(b.utilizationPct, a.utilizationPct))
      .map((w) => ({
        resourceId: w.resourceId,
        resourceName: w.resourceName,
        utilizationPct: w.utilizationPct,
      }));

    const periodProjectIds = new Set(projects.map((p) => p.id));
    const allSubs = this.subprojectsService.subs();
    const managerSubIds = new Set<string>();
    for (const s of allSubs) {
      if (periodProjectIds.has(s.projectId)) managerSubIds.add(s.id);
    }

    const pendingVariations: AreaTodoVariation[] = this.variationsService
      .items()
      .filter((v) => v.status === "Pendiente" && v.target)
      .filter((v) => {
        if (!v.target) return false;
        if (v.target.kind === "subproject") {
          return managerSubIds.has(v.target.subprojectId);
        }
        const task = this.tasksService.getById(v.target.taskId);
        if (!task) return false;
        return managerSubIds.has(task.subprojectId);
      })
      .sort((a, b) => compareIsoDateAsc(a.detectionDate, b.detectionDate))
      .map((v) => {
        const subprojectId =
          v.target?.kind === "subproject"
            ? v.target.subprojectId
            : v.target
              ? this.tasksService.getById(v.target.taskId)?.subprojectId
              : undefined;
        const sub = allSubs.find((x) => x.id === subprojectId);
        const project = projects.find((x) => x.id === sub?.projectId);
        return {
          id: v.id,
          type: v.type,
          taskName: v.target?.label ?? "(sin tarea)",
          ref: v.target?.ref ?? "",
          projectName: project?.name ?? "",
        };
      });

    return {
      managerId,
      managerName: managerFirstName,
      greeting: managerFirstName
        ? `Buenos días, ${managerFirstName}`
        : "Buenos días",
      period,
      totalUsersActive,
      overloadResourcesCount,
      teamAverageUtilizationPct,
      teamWorkloads: teamWorkloadsAll,
      projectsTotal: projects.length,
      variationsTotal: pendingVariations.length,
      pendingVariations,
    };
  }
}
