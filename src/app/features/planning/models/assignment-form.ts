export interface AssignmentFormData {
  taskId: string;
  resourceId: string;
  plannedHours: number;
  startDate: string;
  endDate: string;
}

export type AssignmentFormSavePayload =
  | { mode: "create"; projectId: string; data: AssignmentFormData }
  | { mode: "edit"; projectId: string; id: string; data: AssignmentFormData };

export interface OverloadRequest {
  resourceId: string;
  resourceName: string;
  committedHours: number;
  newHours: number;
  capacityHours: number;
  periodStart: string;
  periodEnd: string;
  businessDays: number;
  payload: AssignmentFormSavePayload;
}

export function emptyAssignmentForm(): AssignmentFormData {
  return {
    taskId: "",
    resourceId: "",
    plannedHours: 0,
    startDate: "",
    endDate: "",
  };
}