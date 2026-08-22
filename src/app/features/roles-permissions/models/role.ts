export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  sistema: boolean;
  paginaInicioId: string | null;
  paginaInicioCodigo?: string | null;
  users: number;
  permissions: string[];
}

export interface RoleFormData {
  code: string;
  name: string;
  description: string;
  paginaInicioId: string;
}

export function emptyRoleForm(): RoleFormData {
  return {
    code: "",
    name: "",
    description: "",
    paginaInicioId: "",
  };
}