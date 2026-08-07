// Shape 1:1 con el backend (ms-seguimiento).
// Ver tfm-backend/.../dto/response/ActividadResponse.java y ActividadRequest.java.

export interface ActividadApi {
  id: string;
  tipoActividadId: string;
  modalidadId: string;
  titulo: string;
  descripcion: string | null;
  fecha: string; // ISO date
  horaInicio: string; // ISO time HH:mm:ss
  horaFin: string; // ISO time HH:mm:ss
  organizadorId: string;
  estado: number | null;
}

export interface ActividadCrearApi {
  tipoActividadId: string;
  modalidadId: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  organizadorId: string;
}
