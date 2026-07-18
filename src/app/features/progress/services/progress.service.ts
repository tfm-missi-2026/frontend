import { Injectable, inject } from "@angular/core";

import { AssignmentsMockService } from "@features/planning/services/assignments-mock.service";
import { SubprojectsMockService } from "@features/projects/services/subprojects-mock.service";
import { TasksMockService } from "@features/projects/services/tasks-mock.service";

import type {
  ProjectProgress,
  TaskProgressRow,
} from "../models/project-progress";
import { TaskEffortMockService } from "./task-effort-mock.service";

const EMPTY_PROGRESS: ProjectProgress = {
  projectId: "",
  hasBaseline: false,
  baselineLabel: "",
  baselineDate: "",
  estimatedHours: 0,
  loggedHours: 0,
  progressPct: 0,
  rows: [],
};

@Injectable({ providedIn: "root" })
export class ProgressService {
  private readonly assignmentsService = inject(AssignmentsMockService);
  private readonly subprojectsService = inject(SubprojectsMockService);
  private readonly tasksService = inject(TasksMockService);
  private readonly taskEffortService = inject(TaskEffortMockService);

  computeProjectProgress(projectId: string): ProjectProgress {
    if (!projectId) return EMPTY_PROGRESS;

    const assignments = this.assignmentsService.getByProject(projectId);
    const hasBaseline = assignments.some((a) => a.frozen);

    const subprojects = this.subprojectsService
      .subs()
      .filter((s) => s.projectId === projectId && s.active);
    const tasks = subprojects.flatMap((s) =>
      this.tasksService.getBySubproject(s.id),
    );

    const rows: TaskProgressRow[] = tasks.map((t) => {
      const sub = subprojects.find((s) => s.id === t.subprojectId);
      const ref = sub?.ticket ? `#${sub.ticket}` : `#${t.subprojectId}`;
      const estimatedHours = t.estimatedHours;
      const loggedHours = this.taskEffortService.totalForTask(t.id);
      const progressPct =
        estimatedHours > 0
          ? Math.round((loggedHours / estimatedHours) * 100)
          : 0;
      const deviationHours = loggedHours - estimatedHours;
      const isOverExecuted = loggedHours > estimatedHours;
      return {
        taskId: t.id,
        taskName: t.name,
        taskRef: ref,
        estimatedHours,
        loggedHours,
        progressPct,
        deviationHours,
        isOverExecuted,
      };
    });

    const estimatedHours = rows.reduce((acc, r) => acc + r.estimatedHours, 0);
    const loggedHours = rows.reduce((acc, r) => acc + r.loggedHours, 0);
    const progressPct =
      estimatedHours > 0
        ? Math.round((loggedHours / estimatedHours) * 100)
        : 0;

    return {
      projectId,
      hasBaseline,
      baselineLabel: "Línea base v2",
      baselineDate: "18/05/2026",
      estimatedHours,
      loggedHours,
      progressPct,
      rows,
    };
  }
}
