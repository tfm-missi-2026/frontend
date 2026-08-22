import type { Project, ProjectStatus } from "./project";

export interface ProjectFormData {
  code: string;
  name: string;
  description: string;
  managerId: string;
  subCount: number;
  status: ProjectStatus;
  startDate: string;
}

export type ProjectFormSavePayload =
  | { mode: "create"; data: ProjectFormData }
  | { mode: "edit"; id: string; data: ProjectFormData };

export function emptyProjectForm(): ProjectFormData {
  return {
    code: "",
    name: "",
    description: "",
    managerId: "",
    subCount: 0,
    status: "active",
    startDate: "",
  };
}