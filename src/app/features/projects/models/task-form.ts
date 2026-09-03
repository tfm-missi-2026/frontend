export interface TaskFormData {
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  estimatedHours: number | null;
  /** UUID del catalogo (grupo SITUACION) seleccionado. Vacio en modo creacion. */
  situationId: string;
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
    situationId: "",
  };
}