// Shape 1:1 con el backend (ms-seguimiento).
// Ver tfm-backend/.../dto/response/VariacionResponse.java y request/*.

export interface VariacionApi {
  id: string;
  tareaId: string | null;
  tipoVariacionId: string;
  descripcion: string;
  justificacion: string;
  valorAnterior: string | null;
  valorNuevo: string | null;
  fechaDeteccion: string; // ISO date
  reportadaPor: string;
  situacionId: string;
  observacionResolucion: string | null;
  fechaResolucion: string | null; // ISO datetime
  resueltoPor: string | null;
  estado: number | null;
}

export interface VariacionCrearApi {
  tareaId: string | null;
  tipoVariacionId: string;
  descripcion: string;
  justificacion: string;
  valorAnterior: string | null;
  valorNuevo: string | null;
  fechaDeteccion: string;
  reportadaPor: string;
  situacionId: string;
}

export interface VariacionResolverApi {
  situacionId: string;
  observacionResolucion: string | null;
}
