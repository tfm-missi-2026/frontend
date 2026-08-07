// Shape 1:1 con el backend (ms-seguimiento).
// Ver tfm-backend/.../dto/response/CargaRecursoResponse.java.

export interface CargaRecursoApi {
  usuarioId: string;
  horasPlanificadas: number;
  horasRegistradas: number;
  numeroTareasActivas: number;
  porcentajeUtilizacion: number;
  sobrecarga: boolean;
}
