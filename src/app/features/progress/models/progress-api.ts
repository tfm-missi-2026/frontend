// Shape 1:1 con el backend (ms-seguimiento).
// Ver tfm-backend/.../dto/response/AvanceProyectoResponse.java y AvanceTareaResponse.java.

export interface AvanceTareaApi {
  tareaId: string;
  nombre: string;
  horasEstimadas: number;
  horasRegistradas: number;
  porcentajeAvance: number;
  desviacionHoras: number;
}

export interface AvanceProyectoApi {
  proyectoId: string;
  lineaBaseId: string | null;
  version: number | null;
  horasEstimadasTotal: number;
  horasRegistradasTotal: number;
  porcentajeAvance: number;
  tareas: AvanceTareaApi[];
}
