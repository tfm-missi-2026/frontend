import { Injectable, computed, signal } from "@angular/core";

import type { Assignment } from "../models/assignment";
import type { AssignmentFormData } from "../models/assignment-form";

const SEED: Assignment[] = [
  {
    id: "a-001",
    projectId: "p-sigtramites",
    taskId: "t-spsrt-003",
    resourceId: "u5",
    plannedHours: 20,
    startDate: "2026-05-26",
    endDate: "2026-05-30",
    frozen: false,
    active: true,
  },
  {
    id: "a-002",
    projectId: "p-sigtramites",
    taskId: "t-spsrt-004",
    resourceId: "u5",
    plannedHours: 10,
    startDate: "2026-06-01",
    endDate: "2026-06-03",
    frozen: false,
    active: true,
  },
  {
    id: "a-003",
    projectId: "p-sigtramites",
    taskId: "t-spsrt-005",
    resourceId: "u6",
    plannedHours: 64,
    startDate: "2026-05-19",
    endDate: "2026-06-13",
    frozen: false,
    active: true,
  },
  {
    id: "a-004",
    projectId: "p-sigtramites",
    taskId: "t-spsrt-001",
    resourceId: "u6",
    plannedHours: 32,
    startDate: "2026-06-02",
    endDate: "2026-06-09",
    frozen: false,
    active: true,
  },
  {
    id: "a-005",
    projectId: "p-sigtramites",
    taskId: "t-spsrt-002",
    resourceId: "u7",
    plannedHours: 50,
    startDate: "2026-05-12",
    endDate: "2026-05-23",
    frozen: false,
    active: true,
  },
  {
    id: "a-006",
    projectId: "p-sigtramites",
    taskId: "t-spsrt-001",
    resourceId: "u5",
    plannedHours: 8,
    startDate: "2026-05-19",
    endDate: "2026-05-20",
    frozen: false,
    active: true,
  },
  {
    id: "a-007",
    projectId: "p-sigtramites",
    taskId: "t-spsrt-005",
    resourceId: "u5",
    plannedHours: 12,
    startDate: "2026-06-04",
    endDate: "2026-06-05",
    frozen: false,
    active: true,
  },
];

@Injectable({ providedIn: "root" })
export class AssignmentsMockService {
  private readonly _assignments = signal<Assignment[]>(SEED);
  readonly assignments = this._assignments.asReadonly();
  readonly count = computed(() => this._assignments().length);

  getByProject(projectId: string): Assignment[] {
    return this._assignments().filter(
      (a) => a.projectId === projectId && a.active,
    );
  }

  getById(id: string): Assignment | undefined {
    return this._assignments().find((a) => a.id === id);
  }

  getByResourceInRange(
    resourceId: string,
    isoStart: string,
    isoEnd: string,
  ): Assignment[] {
    return this._assignments().filter(
      (a) =>
        a.active &&
        a.resourceId === resourceId &&
        a.startDate <= isoEnd &&
        a.endDate >= isoStart,
    );
  }

  create(projectId: string, data: AssignmentFormData): Assignment {
    const next: Assignment = {
      id: `a-${Date.now()}`,
      projectId,
      taskId: data.taskId,
      resourceId: data.resourceId,
      plannedHours: data.plannedHours,
      startDate: data.startDate,
      endDate: data.endDate,
      frozen: false,
      active: true,
    };
    this._assignments.update((arr) => [next, ...arr]);
    return next;
  }

  update(
    projectId: string,
    id: string,
    data: AssignmentFormData,
  ): void {
    this._assignments.update((arr) =>
      arr.map((a) =>
        a.id === id
          ? {
              ...a,
              ...data,
              projectId,
              id,
              frozen: a.frozen,
            }
          : a,
      ),
    );
  }

  deactivate(projectId: string, id: string): void {
    this._assignments.update((arr) =>
      arr.map((a) => (a.id === id ? { ...a, active: false } : a)),
    );
  }

  freeze(projectId: string): void {
    this._assignments.update((arr) =>
      arr.map((a) =>
        a.projectId === projectId && a.active ? { ...a, frozen: true } : a,
      ),
    );
  }
}