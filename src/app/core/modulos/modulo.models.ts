export interface ModuloResponse {
  id: string;
  codigo: string;
  nombre: string;
  ruta: string;
  icono: string | null;
  orden: number;
  moduloPadreId: string | null;
  descripcion?: string | null;
  estado?: number | null;
}
