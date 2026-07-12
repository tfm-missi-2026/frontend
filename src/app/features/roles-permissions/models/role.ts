export type RoleKind = "system" | "custom";

export interface SystemModule {
  /** Slug del módulo del sidebar. */
  id: string;
  /** Etiqueta visible. */
  label: string;
  /** Restringido al rol Administrador. */
  adminOnly?: boolean;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  kind: RoleKind;
  users: number;
  /** IDs de `SystemModule` a los que el rol tiene acceso. */
  permissions: string[];
}

export const SYSTEM_MODULES: SystemModule[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "proyectos", label: "Proyectos" },
  { id: "planificacion", label: "Planificación" },
  { id: "seguimiento", label: "Seguimiento" },
  { id: "carga-equipo", label: "Carga del equipo" },
  { id: "avance", label: "Avance" },
  { id: "variaciones", label: "Variaciones" },
  { id: "administracion", label: "Administración", adminOnly: true },
];

export const ROLE_KIND_LABELS: Record<RoleKind, string> = {
  system: "Sistema",
  custom: "Personalizado",
};

export interface RoleFormData {
  code: string;
  name: string;
  description: string;
}

export function emptyRoleForm(): RoleFormData {
  return {
    code: "",
    name: "",
    description: "",
  };
}
