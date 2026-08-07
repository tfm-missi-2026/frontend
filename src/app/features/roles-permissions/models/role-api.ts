// Shape 1:1 con el backend (ms-administracion).
// Ver tfm-backend/.../dto/response/RolResponse.java.

import type { Estado } from "../../users/models/user-api";

export interface RolApi {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  estado?: Estado;
}
