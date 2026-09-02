export interface ProjectFormData {
  code: string;
  name: string;
  description: string;
  managerId: string;
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
  };
}