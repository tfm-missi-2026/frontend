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
  /** UUID del usuario solicitante. */
  requesterId: string;
  requestDate: string;
  /** UUID del catalogo (grupo SITUACION) seleccionado. Vacio en modo creacion. */
  situationId: string;
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
    requesterId: "",
    requestDate: "",
    situationId: "",
    rejectionReason: null,
  };
}