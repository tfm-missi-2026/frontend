import { Injectable, computed, signal } from "@angular/core";

import type { TaskEffort } from "../models/task-effort";

// Horas registradas por tarea, distribuidas en mayo 2026.
// Totales target (alineados al wireframe): 8 + 14 + 9 + 58 + 40 + 20 = 149h.
const SEED: TaskEffort[] = [
  { id: "te-001", taskId: "t-spsrt-001", date: "2026-05-19", hours: 4 },
  { id: "te-002", taskId: "t-spsrt-001", date: "2026-05-20", hours: 4 },

  { id: "te-011", taskId: "t-spsrt-002", date: "2026-05-21", hours: 5 },
  { id: "te-012", taskId: "t-spsrt-002", date: "2026-05-22", hours: 5 },
  { id: "te-013", taskId: "t-spsrt-002", date: "2026-05-23", hours: 4 },

  { id: "te-021", taskId: "t-spsrt-003", date: "2026-05-26", hours: 3 },
  { id: "te-022", taskId: "t-spsrt-003", date: "2026-05-27", hours: 3 },
  { id: "te-023", taskId: "t-spsrt-003", date: "2026-05-28", hours: 3 },

  { id: "te-101", taskId: "t-dm018-001", date: "2026-05-19", hours: 6 },
  { id: "te-102", taskId: "t-dm018-001", date: "2026-05-20", hours: 7 },
  { id: "te-103", taskId: "t-dm018-001", date: "2026-05-21", hours: 6 },
  { id: "te-104", taskId: "t-dm018-001", date: "2026-05-22", hours: 6 },
  { id: "te-105", taskId: "t-dm018-001", date: "2026-05-26", hours: 7 },
  { id: "te-106", taskId: "t-dm018-001", date: "2026-05-27", hours: 6 },
  { id: "te-107", taskId: "t-dm018-001", date: "2026-05-28", hours: 6 },
  { id: "te-108", taskId: "t-dm018-001", date: "2026-05-29", hours: 7 },
  { id: "te-109", taskId: "t-dm018-001", date: "2026-06-01", hours: 7 },

  { id: "te-201", taskId: "t-sd4821-001", date: "2026-06-02", hours: 8 },
  { id: "te-202", taskId: "t-sd4821-001", date: "2026-06-03", hours: 8 },
  { id: "te-203", taskId: "t-sd4821-001", date: "2026-06-04", hours: 8 },
  { id: "te-204", taskId: "t-sd4821-001", date: "2026-06-05", hours: 8 },
  { id: "te-205", taskId: "t-sd4821-001", date: "2026-06-08", hours: 8 },

  { id: "te-301", taskId: "t-sd4790-001", date: "2026-05-12", hours: 4 },
  { id: "te-302", taskId: "t-sd4790-001", date: "2026-05-13", hours: 4 },
  { id: "te-303", taskId: "t-sd4790-001", date: "2026-05-14", hours: 4 },
  { id: "te-304", taskId: "t-sd4790-001", date: "2026-05-15", hours: 4 },
  { id: "te-305", taskId: "t-sd4790-001", date: "2026-05-19", hours: 4 },
];

@Injectable({ providedIn: "root" })
export class TaskEffortMockService {
  private readonly _entries = signal<TaskEffort[]>(SEED);
  readonly entries = this._entries.asReadonly();
  readonly count = computed(() => this._entries().length);

  getById(id: string): TaskEffort | undefined {
    return this._entries().find((e) => e.id === id);
  }

  forTask(taskId: string): TaskEffort[] {
    return this._entries().filter((e) => e.taskId === taskId);
  }

  totalForTask(taskId: string): number {
    return this.forTask(taskId).reduce((acc, e) => acc + e.hours, 0);
  }
}
