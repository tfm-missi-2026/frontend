import type { BadgeColor } from "@shared/ui/badge";
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
  requestDate: string | null;
  /** UUID del catalogo (grupo SITUACION) que representa la situacion actual. */
  situationId: string;
  situation: SubprojectSituation;
  rejectionReason: string | null;
  taskCount: number;
  active: boolean;
}

export function subprojectRequiresRequestData(type: SubprojectType): boolean {
  return type !== "Desarrollo modular";
}

const SUBPROJECT_LABEL_MAX_LENGTH = 40;

export function subprojectDisplayLabel(
  subproject: Pick<Subproject, "ticket" | "description">,
): string {
  if (subproject.ticket) return subproject.ticket;
  const { description } = subproject;
  return description.length > SUBPROJECT_LABEL_MAX_LENGTH
    ? `${description.slice(0, SUBPROJECT_LABEL_MAX_LENGTH).trimEnd()}…`
    : description;
}

export const REQUESTER_MAX_LENGTH = 150;
export const REQUESTER_SUGGESTION_MIN_CHARS = 5;
export const REQUESTER_SUGGESTION_LIMIT = 8;

export function normalizeRequesterName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function filterRequesterSuggestions(
  names: readonly string[],
  query: string,
): string[] {
  const normalizedQuery = normalizeRequesterName(query);
  if (normalizedQuery.length < REQUESTER_SUGGESTION_MIN_CHARS) return [];
  const matches = names.filter((name) =>
    normalizeRequesterName(name).includes(normalizedQuery),
  );
  const isOnlyExactMatch =
    matches.length === 1 &&
    normalizeRequesterName(matches[0]) === normalizedQuery;
  return isOnlyExactMatch ? [] : matches.slice(0, REQUESTER_SUGGESTION_LIMIT);
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

export const SUBPROJECT_PRIORITY_COLOR: Record<SubprojectPriority, BadgeColor> = {
  Alta: "warning",
  Media: "primary",
  Baja: "dark",
};

export const SUBPROJECT_PRIORITY_ARROW: Record<SubprojectPriority, string> = {
  Alta: "↑",
  Media: "→",
  Baja: "↓",
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

export type SubprojectActiveFilter = "active" | "inactive";

export const SUBPROJECT_ACTIVE_LABELS: Record<SubprojectActiveFilter, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

export const SUBPROJECT_ACTIVE_OPTIONS: SelectOption[] = [
  { value: "", label: "Estado: Todos" },
  ...(Object.entries(SUBPROJECT_ACTIVE_LABELS) as [
    SubprojectActiveFilter,
    string,
  ][]).map(([value, label]) => ({ value, label })),
];

