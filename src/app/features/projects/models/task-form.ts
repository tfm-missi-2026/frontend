export interface TaskFormData {
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  estimatedHours: number | null;
}

export type TaskFormSavePayload =
  | { mode: "create"; subprojectId: string; data: TaskFormData }
  | { mode: "edit"; subprojectId: string; id: string; data: TaskFormData };

export function emptyTaskForm(): TaskFormData {
  return {
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    estimatedHours: null,
  };
}