import { Injectable, computed, signal } from "@angular/core";

import type { LoggedHour } from "../models/logged-hour";

// Horas registradas distribuidas en mayo 2026 (rango del wireframe).
// Totales target: Ana 198, Marco 138, Sofia 118, Bruno 24.
const SEED: LoggedHour[] = [
  { id: "lh-001", resourceId: "u5", date: "2026-05-04", hours: 8 },
  { id: "lh-002", resourceId: "u5", date: "2026-05-05", hours: 9 },
  { id: "lh-003", resourceId: "u5", date: "2026-05-06", hours: 10 },
  { id: "lh-004", resourceId: "u5", date: "2026-05-07", hours: 9 },
  { id: "lh-005", resourceId: "u5", date: "2026-05-08", hours: 8 },
  { id: "lh-006", resourceId: "u5", date: "2026-05-11", hours: 9 },
  { id: "lh-007", resourceId: "u5", date: "2026-05-12", hours: 11 },
  { id: "lh-008", resourceId: "u5", date: "2026-05-13", hours: 9 },
  { id: "lh-009", resourceId: "u5", date: "2026-05-14", hours: 10 },
  { id: "lh-010", resourceId: "u5", date: "2026-05-15", hours: 8 },
  { id: "lh-011", resourceId: "u5", date: "2026-05-18", hours: 12 },
  { id: "lh-012", resourceId: "u5", date: "2026-05-19", hours: 11 },
  { id: "lh-013", resourceId: "u5", date: "2026-05-20", hours: 13 },
  { id: "lh-014", resourceId: "u5", date: "2026-05-21", hours: 9 },
  { id: "lh-015", resourceId: "u5", date: "2026-05-22", hours: 10 },
  { id: "lh-016", resourceId: "u5", date: "2026-05-25", hours: 11 },
  { id: "lh-017", resourceId: "u5", date: "2026-05-26", hours: 10 },
  { id: "lh-018", resourceId: "u5", date: "2026-05-27", hours: 9 },
  { id: "lh-019", resourceId: "u5", date: "2026-05-28", hours: 11 },
  { id: "lh-020", resourceId: "u5", date: "2026-05-29", hours: 11 },

  { id: "lh-101", resourceId: "u7", date: "2026-05-04", hours: 7 },
  { id: "lh-102", resourceId: "u7", date: "2026-05-05", hours: 8 },
  { id: "lh-103", resourceId: "u7", date: "2026-05-06", hours: 9 },
  { id: "lh-104", resourceId: "u7", date: "2026-05-07", hours: 6 },
  { id: "lh-105", resourceId: "u7", date: "2026-05-08", hours: 8 },
  { id: "lh-106", resourceId: "u7", date: "2026-05-11", hours: 9 },
  { id: "lh-107", resourceId: "u7", date: "2026-05-12", hours: 11 },
  { id: "lh-108", resourceId: "u7", date: "2026-05-13", hours: 7 },
  { id: "lh-109", resourceId: "u7", date: "2026-05-14", hours: 8 },
  { id: "lh-110", resourceId: "u7", date: "2026-05-15", hours: 9 },
  { id: "lh-111", resourceId: "u7", date: "2026-05-18", hours: 8 },
  { id: "lh-112", resourceId: "u7", date: "2026-05-19", hours: 9 },
  { id: "lh-113", resourceId: "u7", date: "2026-05-20", hours: 7 },
  { id: "lh-114", resourceId: "u7", date: "2026-05-21", hours: 9 },
  { id: "lh-115", resourceId: "u7", date: "2026-05-22", hours: 8 },
  { id: "lh-116", resourceId: "u7", date: "2026-05-25", hours: 8 },
  { id: "lh-117", resourceId: "u7", date: "2026-05-26", hours: 7 },
  { id: "lh-118", resourceId: "u7", date: "2026-05-27", hours: 6 },

  { id: "lh-201", resourceId: "u8", date: "2026-05-04", hours: 8 },
  { id: "lh-202", resourceId: "u8", date: "2026-05-05", hours: 7 },
  { id: "lh-203", resourceId: "u8", date: "2026-05-06", hours: 8 },
  { id: "lh-204", resourceId: "u8", date: "2026-05-07", hours: 8 },
  { id: "lh-205", resourceId: "u8", date: "2026-05-08", hours: 7 },
  { id: "lh-206", resourceId: "u8", date: "2026-05-11", hours: 8 },
  { id: "lh-207", resourceId: "u8", date: "2026-05-12", hours: 6 },
  { id: "lh-208", resourceId: "u8", date: "2026-05-13", hours: 8 },
  { id: "lh-209", resourceId: "u8", date: "2026-05-14", hours: 7 },
  { id: "lh-210", resourceId: "u8", date: "2026-05-15", hours: 8 },
  { id: "lh-211", resourceId: "u8", date: "2026-05-18", hours: 7 },
  { id: "lh-212", resourceId: "u8", date: "2026-05-19", hours: 8 },
  { id: "lh-213", resourceId: "u8", date: "2026-05-20", hours: 6 },
  { id: "lh-214", resourceId: "u8", date: "2026-05-21", hours: 7 },
  { id: "lh-215", resourceId: "u8", date: "2026-05-22", hours: 6 },
  { id: "lh-216", resourceId: "u8", date: "2026-05-25", hours: 5 },

  { id: "lh-301", resourceId: "u9", date: "2026-05-04", hours: 3 },
  { id: "lh-302", resourceId: "u9", date: "2026-05-06", hours: 4 },
  { id: "lh-303", resourceId: "u9", date: "2026-05-08", hours: 5 },
  { id: "lh-304", resourceId: "u9", date: "2026-05-12", hours: 3 },
  { id: "lh-305", resourceId: "u9", date: "2026-05-15", hours: 4 },
  { id: "lh-306", resourceId: "u9", date: "2026-05-22", hours: 5 },
];

@Injectable({ providedIn: "root" })
export class LoggedHoursMockService {
  private readonly _entries = signal<LoggedHour[]>(SEED);
  readonly entries = this._entries.asReadonly();
  readonly count = computed(() => this._entries().length);

  getById(id: string): LoggedHour | undefined {
    return this._entries().find((e) => e.id === id);
  }

  forResourceInRange(
    resourceId: string,
    fromIso: string,
    toIso: string,
  ): LoggedHour[] {
    return this._entries().filter(
      (e) =>
        e.resourceId === resourceId && e.date >= fromIso && e.date <= toIso,
    );
  }

  totalForResourceInRange(
    resourceId: string,
    fromIso: string,
    toIso: string,
  ): number {
    return this.forResourceInRange(resourceId, fromIso, toIso).reduce(
      (acc, e) => acc + e.hours,
      0,
    );
  }
}
