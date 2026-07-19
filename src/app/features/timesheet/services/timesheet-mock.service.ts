import { Injectable, computed, signal } from "@angular/core";

import type {
  TimesheetEntry,
  TimesheetEntryKind,
  TimesheetEntryStatus,
} from "../models/timesheet-entry";

export const TIMESHEET_INITIAL_DATE = "2026-06-02";

const INITIAL: TimesheetEntry[] = [
  {
    id: "ts-001",
    resourceId: "u7",
    date: TIMESHEET_INITIAL_DATE,
    startTime: "08:30",
    endTime: "09:00",
    hours: 0.5,
    kind: "activity",
    project: "",
    task: "",
    taskCode: undefined,
    activity: "Reunión",
    description: "Daily del equipo de SIGTRAMITES; revisión de pendientes.",
    status: "approved",
  },
  {
    id: "ts-002",
    resourceId: "u7",
    date: TIMESHEET_INITIAL_DATE,
    startTime: "09:00",
    endTime: "12:00",
    hours: 3,
    kind: "task",
    project: "p-alpha",
    task: "t-req-014",
    taskCode: "#REQ-014",
    activity: "",
    description: "Codificación de la regla de validación y pruebas unitarias.",
    status: "approved",
  },
  {
    id: "ts-003",
    resourceId: "u7",
    date: TIMESHEET_INITIAL_DATE,
    startTime: "13:00",
    endTime: "15:00",
    hours: 2,
    kind: "task",
    project: "p-beta",
    task: "t-req-027",
    taskCode: "#REQ-027",
    activity: "",
    description: "Ejecución de casos con expedientes de muestra.",
    status: "submitted",
  },
  {
    id: "ts-004",
    resourceId: "u7",
    date: TIMESHEET_INITIAL_DATE,
    startTime: "15:00",
    endTime: "18:00",
    hours: 3,
    kind: "activity",
    project: "",
    task: "",
    taskCode: undefined,
    activity: "Soporte",
    description: "Atención de consultas sobre el módulo de trámites.",
    status: "draft",
  },
  {
    id: "ts-005",
    resourceId: "u7",
    date: "2026-06-03",
    startTime: "09:00",
    endTime: "12:30",
    hours: 3.5,
    kind: "task",
    project: "p-alpha",
    task: "t-req-021",
    taskCode: "#REQ-021",
    activity: "",
    description: "Bocetos del dashboard y revisión con stakeholders.",
    status: "submitted",
  },
  {
    id: "ts-006",
    resourceId: "u7",
    date: "2026-06-03",
    startTime: "14:00",
    endTime: "17:00",
    hours: 3,
    kind: "task",
    project: "p-gamma",
    task: "t-req-040",
    taskCode: "#REQ-040",
    activity: "",
    description: "Refactor del módulo de autenticación; cobertura de tests.",
    status: "draft",
  },
  {
    id: "ts-007",
    resourceId: "u7",
    date: "2026-06-04",
    startTime: "08:30",
    endTime: "09:00",
    hours: 0.5,
    kind: "activity",
    project: "",
    task: "",
    taskCode: undefined,
    activity: "Reunión",
    description: "Daily y planificación del sprint.",
    status: "draft",
  },
  {
    id: "ts-008",
    resourceId: "u7",
    date: "2026-06-04",
    startTime: "09:00",
    endTime: "13:00",
    hours: 4,
    kind: "task",
    project: "p-beta",
    task: "t-req-033",
    taskCode: "#REQ-033",
    activity: "",
    description: "Migración de base de datos: scripts DDL y validación.",
    status: "draft",
  },
  {
    id: "ts-009",
    resourceId: "u7",
    date: "2026-06-05",
    startTime: "09:00",
    endTime: "12:00",
    hours: 3,
    kind: "task",
    project: "p-alpha",
    task: "t-req-014",
    taskCode: "#REQ-014",
    activity: "",
    description: "Cierre de la implementación con code review.",
    status: "draft",
  },
  {
    id: "ts-010",
    resourceId: "u7",
    date: "2026-06-05",
    startTime: "14:00",
    endTime: "17:30",
    hours: 3.5,
    kind: "task",
    project: "p-gamma",
    task: "t-req-046",
    taskCode: "#REQ-046",
    activity: "",
    description: "Documentación técnica del API público.",
    status: "draft",
  },
  {
    id: "ts-011",
    resourceId: "u7",
    date: "2026-06-08",
    startTime: "10:00",
    endTime: "13:00",
    hours: 3,
    kind: "activity",
    project: "",
    task: "",
    taskCode: undefined,
    activity: "Capacitación",
    description: "Capacitación interna sobre Angular Signals.",
    status: "submitted",
  },
  {
    id: "ts-012",
    resourceId: "u7",
    date: "2026-06-08",
    startTime: "15:00",
    endTime: "17:00",
    hours: 2,
    kind: "task",
    project: "p-beta",
    task: "t-req-027",
    taskCode: "#REQ-027",
    activity: "",
    description: "Cierre de bugs reportados en QA.",
    status: "draft",
  },
  {
    id: "ts-101",
    resourceId: "u5",
    date: "2026-06-12",
    startTime: "08:30",
    endTime: "09:00",
    hours: 0.5,
    kind: "activity",
    project: "",
    task: "",
    taskCode: undefined,
    activity: "Reunión",
    description: "Daily del equipo; revisión de pendientes del sprint.",
    status: "approved",
  },
  {
    id: "ts-102",
    resourceId: "u5",
    date: "2026-06-12",
    startTime: "09:00",
    endTime: "12:00",
    hours: 3,
    kind: "task",
    project: "p-sigtramites",
    task: "t-spsrt-003",
    taskCode: "#REQ-014",
    activity: "",
    description:
      "Implementación de la regla de validación del RUC en el formulario de expediente.",
    status: "approved",
  },
  {
    id: "ts-103",
    resourceId: "u5",
    date: "2026-06-12",
    startTime: "13:00",
    endTime: "14:30",
    hours: 1.5,
    kind: "task",
    project: "p-sigtramites",
    task: "t-spsrt-004",
    taskCode: "#REQ-014",
    activity: "",
    description: "Pruebas con casos reales de la regla de validación.",
    status: "draft",
  },
];

@Injectable({ providedIn: "root" })
export class TimesheetMockService {
  private readonly _entries = signal<TimesheetEntry[]>(INITIAL);
  readonly entries = this._entries.asReadonly();
  readonly count = computed(() => this._entries().length);

  create(data: Omit<TimesheetEntry, "id">): TimesheetEntry {
    const next: TimesheetEntry = { ...data, id: `ts-${Date.now()}` };
    this._entries.update((arr) => [next, ...arr]);
    return next;
  }

  update(id: string, patch: Partial<Omit<TimesheetEntry, "id">>): void {
    this._entries.update((arr) =>
      arr.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );
  }

  remove(id: string): void {
    this._entries.update((arr) => arr.filter((e) => e.id !== id));
  }

  totalHoursForDate(date: string): number {
    return this._entries()
      .filter((e) => e.date === date)
      .reduce((acc, e) => acc + e.hours, 0);
  }

  totalHoursInRange(from: string, to: string): number {
    return this._entries()
      .filter((e) => e.date >= from && e.date <= to)
      .reduce((acc, e) => acc + e.hours, 0);
  }

  countForDate(date: string): number {
    return this._entries().filter((e) => e.date === date).length;
  }

  entriesForResourceInRange(
    resourceId: string,
    fromIso: string,
    toIso: string,
  ): TimesheetEntry[] {
    return this._entries().filter(
      (e) =>
        e.resourceId === resourceId && e.date >= fromIso && e.date <= toIso,
    );
  }

  entriesForResourceOnDate(
    resourceId: string,
    date: string,
  ): TimesheetEntry[] {
    return this._entries()
      .filter((e) => e.resourceId === resourceId && e.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  totalHoursForResourceInRange(
    resourceId: string,
    fromIso: string,
    toIso: string,
  ): number {
    return this.entriesForResourceInRange(resourceId, fromIso, toIso).reduce(
      (acc, e) => acc + e.hours,
      0,
    );
  }
}

export type { TimesheetEntry, TimesheetEntryKind, TimesheetEntryStatus };