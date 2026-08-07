import { Injectable, inject, signal } from "@angular/core";

import {
  DEFAULT_PERIOD_ID,
  type ManagerPeriod,
} from "@shared/common";
import { ProjectsService } from "@features/projects/services/projects.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { UsersService } from "@features/users/services/users.service";
import { VariationsService } from "@features/variations/services/variations.service";
import { TeamLoadService } from "@features/team-load/services/team-load.service";

import type { VariationType } from "@features/variations/models/variation";
import { extractProblemMessage } from "@utils/problem-detail";
import { compareIsoDateAsc, compareKeys } from "@utils/collections";

export interface AreaProjectStatus {
  projectId: string;
  code: string;
  name: string;
  statusTag: "En plazo" | "En riesgo" | "Retrasado";
}

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
  projectsBreakdown: AreaProjectStatus[];
  enPlazoCount: number;
  enRiesgoCount: number;
  retrasadoCount: number;
  variationsTotal: number;
  pendingVariations: AreaTodoVariation[];
}

@Injectable({ providedIn: "root" })
export class AreaDashboardService {
  private readonly projectsService = inject(ProjectsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly tasksService = inject(TasksService);
  private readonly usersService = inject(UsersService);
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
      const period = this._periodoPorDefecto();
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
      // Carga inicial de carga del equipo con el periodo por defecto.
      await this.teamLoadService.computeWorkloads({
        fromIso: period.startIso,
        toIso: period.endIso,
      });
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  private _periodoPorDefecto(): { startIso: string; endIso: string } {
    // Coincide con DEFAULT_PERIODS del toolbar; aqui usamos 2026-05 (mes actual del wireframe).
    return { startIso: "2026-05-01", endIso: "2026-05-31" };
  }


  computeDashboard(
    managerId: string,
    managerFirstName: string,
    period: ManagerPeriod,
  ): AreaDashboardData {
    const periodStart = period.startIso;
    const periodEnd = period.endIso;

    const allUsers = this.usersService.users();
    const totalUsersActive = allUsers.filter((u) => u.status === "active").length;

    const projects = this.projectsService
      .projects()
      .filter((p) => p.status === "active")
      .sort((a, b) => compareIsoDateAsc(a.startDate, b.startDate));

    const projectStatuses: AreaProjectStatus[] = projects.map((p, idx) => {
      const tag: AreaProjectStatus["statusTag"] =
        idx === 0 ? "En riesgo" : idx === 1 ? "En plazo" : "Retrasado";
      return {
        projectId: p.id,
        code: p.code,
        name: p.name,
        statusTag: tag,
      };
    });

    const enPlazoCount = projectStatuses.filter(
      (p) => p.statusTag === "En plazo",
    ).length;
    const enRiesgoCount = projectStatuses.filter(
      (p) => p.statusTag === "En riesgo",
    ).length;
    const retrasadoCount = projectStatuses.filter(
      (p) => p.statusTag === "Retrasado",
    ).length;

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
      .map((v) => ({
        id: v.id,
        type: v.type,
        taskName: v.target?.label ?? "(sin tarea)",
        ref: v.target?.ref ?? "",
      }));

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
      projectsBreakdown: projectStatuses,
      enPlazoCount,
      enRiesgoCount,
      retrasadoCount,
      variationsTotal: pendingVariations.length,
      pendingVariations,
    };
  }
}
