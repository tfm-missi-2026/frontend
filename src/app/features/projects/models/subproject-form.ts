import type {
  SubprojectPriority,
  SubprojectSituation,
  SubprojectType,
} from "./subproject";

export interface SubprojectFormData {
  type: SubprojectType;
  ticket: string | null;
  description: string;
  priority: SubprojectPriority;
  requester: string;
  requestDate: string;
  rejectionReason: string | null;
}

export type SubprojectFormSavePayload =
  | { mode: "create"; projectId: string; data: SubprojectFormData }
  | { mode: "edit"; projectId: string; id: string; data: SubprojectFormData };

export function emptySubprojectForm(): SubprojectFormData {
  return {
    type: "Incidencia",
    ticket: null,
    description: "",
    priority: "Media",
    requester: "Mesa de Ayuda",
    requestDate: "",
    rejectionReason: null,
  };
}