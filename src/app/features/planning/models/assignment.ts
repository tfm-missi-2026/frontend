export interface Assignment {
  id: string;
  projectId: string;
  taskId: string;
  resourceId: string;
  plannedHours: number;
  startDate: string;
  endDate: string;
  frozen: boolean;
  active: boolean;
}