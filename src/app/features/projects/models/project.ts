import type { SelectOption } from "@shared/ui/select";

export type ProjectStatus = "active" | "inactive";

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  managerId: string;
  subCount: number;
  status: ProjectStatus;
  startDate: string;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

export const PROJECT_STATUS_OPTIONS: SelectOption[] = (
  Object.entries(PROJECT_STATUS_LABELS) as [ProjectStatus, string][]
).map(([value, label]) => ({ value, label }));