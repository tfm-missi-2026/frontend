import { Injectable, inject } from "@angular/core";

import { type ManagerPeriod } from "@shared/common";
import { AssignmentsMockService } from "@features/planning/services/assignments-mock.service";
import { SubprojectsMockService } from "@features/projects/services/subprojects-mock.service";
import { TasksMockService } from "@features/projects/services/tasks-mock.service";
import { UsersMockService } from "@features/users/services/users-mock.service";
import { VariationsMockService } from "@features/variations/services/variations-mock.service";
import { LoggedHoursMockService } from "@features/team-load/services/logged-hours-mock.service";

import type { TimesheetEntry } from "@features/timesheet/models/timesheet-entry";
import { TimesheetMockService } from "@features/timesheet/services/timesheet-mock.service";

import type { TaskSituation } from "@features/projects/models/task";
import type { VariationType } from "@features/variations/models/variation";

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
  private readonly usersService = inject(UsersMockService);
  private readonly assignmentsService = inject(AssignmentsMockService);
  private readonly tasksService = inject(TasksMockService);
  private readonly subprojectsService = inject(SubprojectsMockService);
  private readonly variationsService = inject(VariationsMockService);
  private readonly loggedHoursService = inject(LoggedHoursMockService);
  private readonly timesheetService = inject(TimesheetMockService);

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
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

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
        ? this.loggedHoursService.totalForResourceInRange(
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

    const loggedHoursTotal = this.loggedHoursService.totalForResourceInRange(
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
      .filter((v) =>
        v.reportedBy.toLowerCase().includes(fullName.toLowerCase()),
      )
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