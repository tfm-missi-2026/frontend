// Shape 1:1 con el backend (ms-seguimiento).
// Ver tfm-backend/.../dto/response/BitacoraResponse.java y BitacoraRequest.java.

export interface BitacoraApi {
  id: string;
  usuarioId: string;
  fecha: string; // ISO date YYYY-MM-DD
  horaInicio: string; // ISO time HH:mm:ss
  horaFin: string; // ISO time HH:mm:ss
  descripcion: string | null;
  asignacionId: string | null;
  actividadId: string | null;
  estado: number | null;
}

export interface BitacoraCrearApi {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  descripcion: string | null;
  asignacionId: string | null;
  actividadId: string | null;
}
