export interface ResourceWorkload {
  resourceId: string;
  resourceName: string;
  resourceRole: "Recurso Técnico";
  plannedHours: number;
  loggedHours: number;
  activeTaskCount: number;
  utilizationPct: number;
  hasPlan: boolean;
  isOverload: boolean;
}
