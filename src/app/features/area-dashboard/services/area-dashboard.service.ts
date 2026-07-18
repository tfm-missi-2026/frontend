import { Injectable, inject } from "@angular/core";

import {
  DEFAULT_PERIOD_ID,
  type ManagerPeriod,
} from "@shared/common";
import { ProjectsMockService } from "@features/projects/services/projects-mock.service";
import { SubprojectsMockService } from "@features/projects/services/subprojects-mock.service";
import { TasksMockService } from "@features/projects/services/tasks-mock.service";
import { UsersMockService } from "@features/users/services/users-mock.service";
import { VariationsMockService } from "@features/variations/services/variations-mock.service";
import { TeamLoadService } from "@features/team-load/services/team-load.service";

import type { VariationType } from "@features/variations/models/variation";

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
  private readonly projectsService = inject(ProjectsMockService);
  private readonly subprojectsService = inject(SubprojectsMockService);
  private readonly tasksService = inject(TasksMockService);
  private readonly usersService = inject(UsersMockService);
  private readonly variationsService = inject(VariationsMockService);
  private readonly teamLoadService = inject(TeamLoadService);

  computeDashboard(period: ManagerPeriod): AreaDashboardData {
    const periodStart = period.startIso;
    const periodEnd = period.endIso;

    const allUsers = this.usersService.users();
    const totalUsersActive = allUsers.filter((u) => u.status === "active").length;

    const projects = this.projectsService
      .projects()
      .filter((p) => p.status === "active")
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

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

    const workloads = this.teamLoadService.computeWorkloads({
      fromIso: periodStart,
      toIso: periodEnd,
    });

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
      .sort((a, b) => b.utilizationPct - a.utilizationPct)
      .map((w) => ({
        resourceId: w.resourceId,
        resourceName: w.resourceName,
        utilizationPct: w.utilizationPct,
      }));

    const overloadResourcesCount = overloads.length;

    const teamWorkloadsAll: AlertOverload[] = workloads
      .slice()
      .sort((a, b) => b.utilizationPct - a.utilizationPct)
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
      .sort((a, b) => a.detectionDate.localeCompare(b.detectionDate))
      .map((v) => ({
        id: v.id,
        type: v.type,
        taskName: v.target?.label ?? "(sin tarea)",
        ref: v.target?.ref ?? "",
      }));

    return {
      managerName: "Carlos Vega",
      greeting: "Buenos días, Carlos",
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
