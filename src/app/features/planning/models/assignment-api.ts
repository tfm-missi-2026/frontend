// Shape 1:1 con el backend (ms-seguimiento).
// Ver tfm-backend/.../dto/response/AsignacionResponse.java y AsignacionRequest.java.

export interface AsignacionApi {
  id: string;
  tareaId: string;
  usuarioId: string;
  horasPlanificadas: number | null;
  fechaInicioPlanificada: string | null;
  fechaFinPlanificada: string | null;
  estado: number | null;
}

export interface AsignacionCrearApi {
  tareaId: string;
  usuarioId: string;
  horasPlanificadas: number | null;
  fechaInicioPlanificada: string | null;
  fechaFinPlanificada: string | null;
  confirmarSobrecarga: boolean;
}
