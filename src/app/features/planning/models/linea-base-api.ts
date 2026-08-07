// Shape 1:1 con el backend (ms-seguimiento).
// Ver tfm-backend/.../dto/response/LineaBaseResponse.java + CongelarLineaBaseRequest.java.

export interface LineaBaseApi {
  id: string;
  proyectoId: string;
  version: number;
  descripcion: string | null;
  fechaCongelacion: string; // ISO datetime
  congeladaPor: string;
  tareas: LbTareaApi[];
  asignaciones: LbAsignacionApi[];
}

export interface LbTareaApi {
  id: string;
  lineaBaseId: string;
  tareaId: string;
  nombre: string;
  descripcion: string | null;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  horasEstimadas: number;
}

export interface LbAsignacionApi {
  id: string;
  lineaBaseId: string;
  asignacionId: string;
  tareaId: string;
  usuarioId: string;
}

export interface CongelarLineaBaseRequestApi {
  proyectoId: string;
  descripcion: string | null;
  tareas: TareaSnapshotApi[];
  asignaciones: AsignacionSnapshotApi[];
}

export interface TareaSnapshotApi {
  tareaId: string;
  nombre: string;
  descripcion: string | null;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  horasEstimadas: number;
}

export interface AsignacionSnapshotApi {
  asignacionId: string;
  tareaId: string;
  usuarioId: string;
}
