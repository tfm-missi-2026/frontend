import { Injectable, inject, signal } from "@angular/core";

import { type ManagerPeriod } from "@shared/common";
import { AssignmentsService } from "@features/planning/services/assignments.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { UsersService } from "@features/users/services/users.service";
import { VariationsService } from "@features/variations/services/variations.service";

import type { TimesheetEntry } from "@features/timesheet/models/timesheet-entry";
import { TimesheetService } from "@features/timesheet/services/timesheet.service";

import type { TaskSituation } from "@features/projects/models/task";
import type { VariationType } from "@features/variations/models/variation";
import { extractProblemMessage } from "@utils/problem-detail";
import { compareIsoDateAsc } from "@utils/collections";
import { matchesSearch } from "@utils/strings";

export interface ResourceMyTask {
  assignmentId: string;
  taskId: string;
  taskName: string;
  ref: string;
  situation: TaskSituation;
  loggedHours: number;
  estimatedHours: number;
}

export interface ResourceMyVariation {
  id: string;
  type: VariationType;
  taskName: string;
  ref: string;
}

export interface ResourceDashboardData {
  resourceId: string;
  resourceFullName: string;
  firstName: string;
  greeting: string;
  todayIso: string;
  todayLabel: string;
  period: ManagerPeriod;
  activeTaskCount: number;
  loggedHoursTotal: number;
  plannedHoursTotal: number;
  utilizationPct: number;
  isOverload: boolean;
  variationsTotal: number;
  myTasks: ResourceMyTask[];
  myVariations: ResourceMyVariation[];
  todayEntries: TimesheetEntry[];
  todayTotalHours: number;
}

const TODAY_ISO = "2026-06-12";

const SPANISH_DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

@Injectable({ providedIn: "root" })
export class ResourceDashboardService {
  private readonly usersService = inject(UsersService);
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly tasksService = inject(TasksService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly variationsService = inject(VariationsService);
  private readonly timesheetService = inject(TimesheetService);

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
        this.tasksService.count() === 0
          ? this.tasksService.cargar()
          : Promise.resolve(),
        this.subprojectsService.count() === 0
          ? this.subprojectsService.cargar()
          : Promise.resolve(),
        this.timesheetService.count() === 0
          ? this.timesheetService.cargar()
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
    resourceId: string,
    period: ManagerPeriod,
  ): ResourceDashboardData {
    const user = this.usersService.users().find((u) => u.id === resourceId);
    const firstName = user?.firstName ?? "Recurso";
    const fullName = user
      ? `${user.firstName} ${user.lastNamePaternal}`
      : "Recurso Técnico";

    const assignments = this.assignmentsService
      .getByResourceInRange(resourceId, period.startIso, period.endIso)
      .sort((a, b) => compareIsoDateAsc(a.startDate, b.startDate));

    const allSubs = this.subprojectsService.subs();

    const myTasks: ResourceMyTask[] = assignments.map((a) => {
      const task = this.tasksService.getById(a.taskId);
      const sub = task
        ? allSubs.find((s) => s.id === task.subprojectId)
        : undefined;
      const ref = sub?.ticket
        ? `#REQ-${sub.ticket.replace(/^[A-Z]+-/, "")}`
        : `#${task?.subprojectId ?? a.taskId}`;
      const loggedHours = task
        ? this.timesheetService.totalHoursForResourceInRange(
            resourceId,
            a.startDate,
            a.endDate,
          )
        : 0;
      return {
        assignmentId: a.id,
        taskId: a.taskId,
        taskName: task?.name ?? a.taskId,
        ref,
        situation: task?.situation ?? "Pendiente",
        loggedHours,
        estimatedHours: task?.estimatedHours ?? a.plannedHours,
      };
    });

    const activeTaskCount = new Set(
      assignments.filter((a) => a.active).map((a) => a.taskId),
    ).size;

    const loggedHoursTotal = this.timesheetService.totalHoursForResourceInRange(
      resourceId,
      period.startIso,
      period.endIso,
    );
    const plannedHoursTotal = assignments.reduce(
      (acc, a) => acc + a.plannedHours,
      0,
    );
    const utilizationPct =
      plannedHoursTotal > 0
        ? Math.round((loggedHoursTotal / plannedHoursTotal) * 100)
        : 0;
    const isOverload = loggedHoursTotal > plannedHoursTotal;

    const myVariations: ResourceMyVariation[] = this.variationsService
      .items()
      .filter((v) => matchesSearch(fullName, v.reportedBy))
      .map((v) => ({
        id: v.id,
        type: v.type,
        taskName: v.target?.label ?? "(sin tarea)",
        ref: v.target?.ref ?? "",
      }));

    const todayEntries = this.timesheetService.entriesForResourceOnDate(
      resourceId,
      TODAY_ISO,
    );
    const todayTotalHours = todayEntries.reduce(
      (acc, e) => acc + e.hours,
      0,
    );

    return {
      resourceId,
      resourceFullName: fullName,
      firstName,
      greeting: `Buenos días, ${firstName}`,
      todayIso: TODAY_ISO,
      todayLabel: this.formatTodayLabel(TODAY_ISO),
      period,
      activeTaskCount,
      loggedHoursTotal,
      plannedHoursTotal,
      utilizationPct,
      isOverload,
      variationsTotal: myVariations.length,
      myTasks,
      myVariations,
      todayEntries,
      todayTotalHours,
    };
  }

  private formatTodayLabel(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    const date = new Date(Date.UTC(y, m - 1, d));
    const day = SPANISH_DAY_NAMES[date.getUTCDay()] ?? "";
    const dd = String(d).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `Hoy · ${day} ${dd}/${mm}/${y}`;
  }
}