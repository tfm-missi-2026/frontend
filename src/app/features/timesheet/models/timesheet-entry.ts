import type { SelectOption } from "@shared/ui/select";

export type TimesheetEntryKind = "task" | "activity";

export type TimesheetEntryStatus = "draft" | "submitted" | "approved" | "rejected";

export interface TimesheetEntry {
  id: string;
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  kind: TimesheetEntryKind;
  project: string;
  task: string;
  taskCode?: string;
  activity?: string;
  description: string;
  status: TimesheetEntryStatus;
}

export interface TimesheetProject {
  id: string;
  code: string;
  name: string;
}

export interface TimesheetTask {
  id: string;
  projectId: string;
  code: string;
  name: string;
}

export const TIMESHEET_ENTRY_STATUS_LABELS: Record<TimesheetEntryStatus, string> = {
  draft: "Borrador",
  submitted: "Enviado",
  approved: "Aprobado",
  rejected: "Rechazado",
};

export const TIMESHEET_ACTIVITY_CATALOG = [
  "Reunión",
  "Capacitación",
  "Soporte",
  "Otro",
] as const;

export const TIMESHEET_PROJECTS: TimesheetProject[] = [
  { id: "p-alpha", code: "ALPHA", name: "Proyecto Alpha" },
  { id: "p-beta", code: "BETA", name: "Proyecto Beta" },
  { id: "p-gamma", code: "GAMMA", name: "Proyecto Gamma" },
];

export const TIMESHEET_TASKS: TimesheetTask[] = [
  {
    id: "t-req-014",
    projectId: "p-alpha",
    code: "#REQ-014",
    name: "Implementar validación de RUC",
  },
  {
    id: "t-req-021",
    projectId: "p-alpha",
    code: "#REQ-021",
    name: "Diseño de dashboard de reportes",
  },
  {
    id: "t-req-027",
    projectId: "p-beta",
    code: "#REQ-027",
    name: "Pruebas con casos reales",
  },
  {
    id: "t-req-033",
    projectId: "p-beta",
    code: "#REQ-033",
    name: "Migración de base de datos",
  },
  {
    id: "t-req-040",
    projectId: "p-gamma",
    code: "#REQ-040",
    name: "Refactor del módulo de autenticación",
  },
  {
    id: "t-req-046",
    projectId: "p-gamma",
    code: "#REQ-046",
    name: "Documentación técnica",
  },
];

export const TIMESHEET_PROJECT_OPTIONS: SelectOption[] = TIMESHEET_PROJECTS.map(
  (p) => ({ value: p.id, label: `${p.code} · ${p.name}` }),
);

export const TIMESHEET_ACTIVITY_OPTIONS: SelectOption[] =
  TIMESHEET_ACTIVITY_CATALOG.map((a) => ({ value: a, label: a }));

export const TIMESHEET_TASK_OPTIONS: SelectOption[] = TIMESHEET_TASKS.map((t) => ({
  value: t.id,
  label: `${t.name} · ${t.code}`,
}));

const INITIAL_TASK = TIMESHEET_TASKS[0];

export function emptyTimesheetEntry(
  date: string,
  resourceId = "u5",
): Omit<TimesheetEntry, "id"> {
  return {
    resourceId,
    date,
    startTime: "09:00",
    endTime: "10:00",
    hours: 1,
    kind: "task",
    project: INITIAL_TASK.projectId,
    task: INITIAL_TASK.id,
    taskCode: INITIAL_TASK.code,
    activity: TIMESHEET_ACTIVITY_CATALOG[0],
    description: "",
    status: "draft",
  };
}