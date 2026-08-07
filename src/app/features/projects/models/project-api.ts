// Shape del backend (ProyectoResponse.java, SubproyectoResponse.java,
// TareaResponse.java) tal cual viaja por wire. Nombres en espanol.
export interface ProyectoApi {
  id: string;
  nombreCorto: string | null;
  nombre: string;
  descripcion: string | null;
  gestorId: string;
  estado: number | null;
}

export interface ProyectoCrearApi {
  nombreCorto: string | null;
  nombre: string;
  descripcion: string | null;
  gestorId: string;
}

export interface SubproyectoApi {
  id: string;
  proyectoId: string;
  tipoSubproyectoId: string;
  codigoTicket: string | null;
  prioridadId: string;
  descripcion: string;
  solicitanteId: string;
  fechaSolicitud: string;
  situacionId: string;
  justificacionRechazo: string | null;
  estado: number | null;
}

export interface SubproyectoCrearApi {
  proyectoId: string;
  tipoSubproyectoId: string;
  codigoTicket: string | null;
  prioridadId: string;
  descripcion: string;
  solicitanteId: string;
  fechaSolicitud: string;
  situacionId: string;
}

export interface SubproyectoActualizarApi {
  tipoSubproyectoId: string;
  codigoTicket: string | null;
  prioridadId: string;
  descripcion: string;
  situacionId: string;
  justificacionRechazo: string | null;
}

export interface TareaApi {
  id: string;
  subproyectoId: string;
  nombre: string;
  descripcion: string | null;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  horasEstimadas: number;
  situacionId: string;
  origenVariacionId: string | null;
  estado: number | null;
}

export interface TareaCrearApi {
  subproyectoId: string;
  nombre: string;
  descripcion: string | null;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  horasEstimadas: number;
  situacionId: string;
  origenVariacionId: string | null;
}

export interface TareaActualizarApi {
  nombre: string;
  descripcion: string | null;
  fechaInicioPlanificada: string;
  fechaFinPlanificada: string;
  horasEstimadas: number;
  situacionId: string;
  origenVariacionId: string | null;
}
