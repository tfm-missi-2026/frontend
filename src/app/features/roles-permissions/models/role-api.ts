import type { Estado } from "../../users/models/user-api";

export interface RolApi {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  paginaInicioId?: string | null;
  paginaInicioCodigo?: string | null;
  sistema?: boolean | null;
  estado?: Estado;
}