import type { SelectOption } from "@shared/ui/select";

import type { SubprojectSituation } from "./subproject";

export type TaskSituation = SubprojectSituation;

export type TaskOrigin = "base" | "var";

export interface Task {
  id: string;
  subprojectId: string;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  estimatedHours: number;
  /** UUID del catalogo (grupo SITUACION) que representa la situacion actual. */
  situationId: string;
  situation: TaskSituation;
  /** UUID de la variacion que origino esta tarea, o null si viene de la linea base. */
  origenVariacionId: string | null;
  origin: TaskOrigin;
  originLabel: string;
  dependsOnIds: string[];
  active: boolean;
}

export const TASK_ORIGIN_LABELS: Record<TaskOrigin, string> = {
  base: "Línea base",
  var: "Variación",
};

export const TASK_SITUATION_LABELS: Record<TaskSituation, string> = {
  Pendiente: "Pendiente",
  "En atención": "En atención",
  Culminado: "Culminado",
  Rechazado: "Rechazado",
};

export const TASK_SITUATION_OPTIONS: SelectOption[] = [
  { value: "", label: "Todas" },
  ...(
    Object.entries(TASK_SITUATION_LABELS) as [TaskSituation, string][]
  ).map(([value, label]) => ({ value, label })),
];

export type TaskActiveFilter = "active" | "inactive";

export const TASK_ACTIVE_LABELS: Record<TaskActiveFilter, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

export const TASK_ACTIVE_OPTIONS: SelectOption[] = [
  { value: "", label: "Estado: Todos" },
  ...(Object.entries(TASK_ACTIVE_LABELS) as [TaskActiveFilter, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];