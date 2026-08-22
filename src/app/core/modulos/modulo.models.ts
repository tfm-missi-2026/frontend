export interface ModuloResponse {
  id: string;
  codigo: string;
  nombre: string;
  icono: string | null;
  orden: number;
  moduloPadreId: string | null;
  seccion: string;
  tipo?: "SECTION" | "MENU" | "SUBMENU" | null;
  seccionTitulo?: string | null;
  seccionOrden?: number | null;
  sistema?: boolean | null;
  descripcion?: string | null;
  estado?: number | null;
}