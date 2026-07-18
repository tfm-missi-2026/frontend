export interface TaskProgressRow {
  taskId: string;
  taskName: string;
  taskRef: string;
  estimatedHours: number;
  loggedHours: number;
  progressPct: number;
  deviationHours: number;
  isOverExecuted: boolean;
}

export interface ProjectProgress {
  projectId: string;
  hasBaseline: boolean;
  baselineLabel: string;
  baselineDate: string;
  estimatedHours: number;
  loggedHours: number;
  progressPct: number;
  rows: TaskProgressRow[];
}
