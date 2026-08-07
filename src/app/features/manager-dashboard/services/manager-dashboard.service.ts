import { Injectable, inject, signal } from "@angular/core";

import { ProgressService } from "@features/progress/services/progress.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { ProjectsService } from "@features/projects/services/projects.service";
import { VariationsService } from "@features/variations/services/variations.service";

import type { ManagerPeriod } from "@shared/common";
import type { VariationType } from "@features/variations/models/variation";
import { formatShortDate } from "@utils/date";
import { extractProblemMessage } from "@utils/problem-detail";
import { compareIsoDateAsc } from "@utils/collections";

export interface ProjectProgressItem {
  projectId: string;
  projectCode: string;
  projectName: string;
  progressPct: number;
  hasBaseline: boolean;
  baselineLabel: string;
}

export interface TodoVariation {
  id: string;
  type: VariationType;
  taskName: string;
  ref: string;
}

export interface TodoDueTask {
  taskId: string;
  taskName: string;
  ref: string;
  endDate: string;
  isSoon: boolean;
}

export interface DashboardData {
  managerId: string;
  managerName: string;
  greeting: string;
  period: ManagerPeriod;
  projects: ProjectProgressItem[];
  kpiProjectCount: number;
  kpiAverageProgressPct: number;
  kpiPendingVariationsCount: number;
  kpiWithoutBaselineCount: number;
  pendingVariations: TodoVariation[];
  upcomingTasks: TodoDueTask[];
}

const TODAY_ISO = "2026-06-12";
const SOON_DAYS = 7;
const UPCOMING_WINDOW_DAYS = 21;

function isoDays(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function todayUtc(): number {
  return isoDays(TODAY_ISO);
}

@Injectable({ providedIn: "root" })
export class ManagerDashboardService {
  private readonly projectsService = inject(ProjectsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly tasksService = inject(TasksService);
  private readonly variationsService = inject(VariationsService);
  private readonly progressService = inject(ProgressService);

  // Cache local de progress por projectId, refrescado en cargar().
  private readonly _progressByProject = signal<
    Record<string, import("@features/progress/models/project-progress").ProjectProgress>
  >({});
  readonly progressByProject = this._progressByProject.asReadonly();

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
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
      // Cargar progreso real del backend para cada proyecto del gestor.
      const projects = this.projectsService.projects();
      const progressEntries = await Promise.all(
        projects.map(async (p) => {
          try {
            const progress = await this.progressService.refreshProjectProgress(p.id);
            return [p.id, progress] as const;
          } catch {
            return [p.id, null] as const;
          }
        }),
      );
      const map: Record<string, any> = {};
      for (const [id, prog] of progressEntries) {
        if (prog) map[id] = prog;
      }
      this._progressByProject.set(map);
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
  ): DashboardData {
    const periodStart = period.startIso;
    const periodEnd = period.endIso;

    const projects = this.projectsService
      .projects()
      .filter(
        (p) =>
          p.status === "active" &&
          p.managerId === managerId &&
          p.startDate >= periodStart &&
          p.startDate <= periodEnd,
      );

    const projectProgress: ProjectProgressItem[] = projects.map((p) => {
      const progress =
        this._progressByProject()[p.id] ??
        ({
          projectId: p.id,
          hasBaseline: false,
          baselineLabel: "",
          baselineDate: "",
          estimatedHours: 0,
          loggedHours: 0,
          progressPct: 0,
          rows: [],
        });
      const hasBaseline = progress.hasBaseline;
      return {
        projectId: p.id,
        projectCode: p.code,
        projectName: p.name,
        progressPct: progress.progressPct,
        hasBaseline,
        baselineLabel: hasBaseline
          ? `${progress.baselineLabel} · vigente`
          : "Sin línea base congelada",
      };
    });

    const withBaseline = projectProgress.filter((p) => p.hasBaseline);
    const kpiAverageProgressPct =
      withBaseline.length === 0
        ? 0
        : Math.round(
            withBaseline.reduce((acc, p) => acc + p.progressPct, 0) /
              withBaseline.length,
          );

    const kpiWithoutBaselineCount = projectProgress.filter(
      (p) => !p.hasBaseline,
    ).length;

    const managerProjectIds = new Set(projects.map((p) => p.id));
    const allSubprojects = this.subprojectsService.subs();
    const subByProject = new Map<string, string[]>();
    const managerSubIds = new Set<string>();
    for (const s of allSubprojects) {
      if (managerProjectIds.has(s.projectId)) {
        managerSubIds.add(s.id);
        const arr = subByProject.get(s.projectId) ?? [];
        arr.push(s.id);
        subByProject.set(s.projectId, arr);
      }
    }

    const allVariations = this.variationsService.items();
    const pendingVariations: TodoVariation[] = allVariations
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

    const today = todayUtc();
    const soonMs = SOON_DAYS * 86_400_000;
    const upcomingMs = UPCOMING_WINDOW_DAYS * 86_400_000;
    const soonLimit = today + soonMs;
    const upcomingLimit = today + upcomingMs;
    const allTasks = this.tasksService
      .tasks()
      .filter((t) => t.active && managerSubIds.has(t.subprojectId) && t.endDate);
    const upcomingTasks: TodoDueTask[] = allTasks
      .map((t) => {
        const sub = allSubprojects.find((s) => s.id === t.subprojectId);
        const ref = sub?.ticket ? `#${sub.ticket}` : `#${t.subprojectId}`;
        return {
          taskId: t.id,
          taskName: t.name,
          ref,
          endDate: t.endDate as string,
          isSoon: false,
        };
      })
      .filter((t) => {
        const d = isoDays(t.endDate);
        return d >= today && d <= upcomingLimit;
      })
      .map((t) => ({ ...t, isSoon: isoDays(t.endDate) <= soonLimit }))
      .sort((a, b) => compareIsoDateAsc(a.endDate, b.endDate))
      .slice(0, 5);

    return {
      managerId,
      managerName: managerFirstName,
      greeting: managerFirstName
        ? `Buenos días, ${managerFirstName}`
        : "Buenos días",
      period,
      projects: projectProgress,
      kpiProjectCount: projectProgress.length,
      kpiAverageProgressPct,
      kpiPendingVariationsCount: pendingVariations.length,
      kpiWithoutBaselineCount,
      pendingVariations,
      upcomingTasks,
    };
  }

  formatShortDate(iso: string): string {
    return formatShortDate(iso);
  }
}
