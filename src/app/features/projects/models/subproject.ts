import type { SelectOption } from "@shared/ui/select";

export type SubprojectType =
  | "Incidencia"
  | "Requerimiento"
  | "Desarrollo modular";

export type SubprojectPriority = "Alta" | "Media" | "Baja";

export type SubprojectSituation =
  | "Pendiente"
  | "En atención"
  | "Culminado"
  | "Rechazado";

export interface Subproject {
  id: string;
  projectId: string;
  ticket: string | null;
  type: SubprojectType;
  description: string;
  priority: SubprojectPriority;
  requester: string;
  requestDate: string;
  situation: SubprojectSituation;
  rejectionReason: string | null;
  taskCount: number;
  active: boolean;
}

export const SUBPROJECT_TYPE_LABELS: Record<SubprojectType, string> = {
  Incidencia: "Incidencia",
  Requerimiento: "Requerimiento",
  "Desarrollo modular": "Desarrollo modular",
};

export const SUBPROJECT_PRIORITY_LABELS: Record<SubprojectPriority, string> = {
  Alta: "Alta",
  Media: "Media",
  Baja: "Baja",
};

export const SUBPROJECT_SITUATION_LABELS: Record<SubprojectSituation, string> = {
  Pendiente: "Pendiente",
  "En atención": "En atención",
  Culminado: "Culminado",
  Rechazado: "Rechazado",
};

export const INITIAL_SUBPROJECT_SITUATION: SubprojectSituation = "Pendiente";

export const TICKET_REGEX = /^[A-Z0-9-]+$/;

export const SUBPROJECT_TYPE_OPTIONS: SelectOption[] = [
  { value: "", label: "Todos" },
  ...(Object.entries(SUBPROJECT_TYPE_LABELS) as [SubprojectType, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

export const SUBPROJECT_PRIORITY_OPTIONS: SelectOption[] = (
  Object.entries(SUBPROJECT_PRIORITY_LABELS) as [SubprojectPriority, string][]
).map(([value, label]) => ({ value, label }));

export const SUBPROJECT_SITUATION_OPTIONS: SelectOption[] = [
  { value: "", label: "Todas" },
  ...(Object.entries(SUBPROJECT_SITUATION_LABELS) as [
    SubprojectSituation,
    string,
  ][]).map(([value, label]) => ({ value, label })),
];

export const SUBPROJECT_REQUESTER_OPTIONS: SelectOption[] = [
  { value: "Mesa de Ayuda", label: "Mesa de Ayuda" },
  { value: "Of. de Trámites", label: "Of. de Trámites" },
  { value: "Jefatura de Área", label: "Jefatura de Área" },
];