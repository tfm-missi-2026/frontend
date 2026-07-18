import { Injectable, inject } from "@angular/core";

import { AssignmentsMockService } from "@features/planning/services/assignments-mock.service";
import { UsersMockService } from "@features/users/services/users-mock.service";

import { LoggedHoursMockService } from "./logged-hours-mock.service";
import type { ResourceWorkload } from "../models/resource-workload";

export interface ComputeWorkloadsOptions {
  fromIso: string;
  toIso: string;
  projectId?: string | null;
}

@Injectable({ providedIn: "root" })
export class TeamLoadService {
  private readonly usersService = inject(UsersMockService);
  private readonly assignmentsService = inject(AssignmentsMockService);
  private readonly loggedHoursService = inject(LoggedHoursMockService);

  computeWorkloads(opts: ComputeWorkloadsOptions): ResourceWorkload[] {
    const { fromIso, toIso, projectId } = opts;
    const resources = this.usersService
      .users()
      .filter((u) => u.role === "recurso_tecnico" && u.status === "active");

    return resources.map((u) => {
      const assignments = this.assignmentsService
        .getByResourceInRange(u.id, fromIso, toIso)
        .filter((a) => !projectId || a.projectId === projectId);

      const plannedHours = assignments.reduce(
        (acc, a) => acc + a.plannedHours,
        0,
      );
      const loggedHours = this.loggedHoursService.totalForResourceInRange(
        u.id,
        fromIso,
        toIso,
      );
      const activeTaskIds = new Set(assignments.map((a) => a.taskId));
      const activeTaskCount = activeTaskIds.size;
      const hasPlan = plannedHours > 0;
      const utilizationPct = hasPlan
        ? Math.round((loggedHours / plannedHours) * 100)
        : 0;
      const isOverload = hasPlan && loggedHours > plannedHours;

      return {
        resourceId: u.id,
        resourceName: `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`,
        resourceRole: "Recurso Técnico",
        plannedHours,
        loggedHours,
        activeTaskCount,
        utilizationPct,
        hasPlan,
        isOverload,
      };
    });
  }
}
