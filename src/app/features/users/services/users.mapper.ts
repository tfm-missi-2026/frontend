import type {
  RolApi,
  RolCodigo,
  UsuarioApi,
} from "../models/user-api";
import type { User, UserRole, UserStatus } from "../models/user";

// Mapeos puros entre el shape del backend y el shape de UI.
// Sin DI, sin estado: funciones deterministas.

// Backend rol.codigo (RECURSO_TECNICO) <-> UI role (recurso_tecnico).
const ROL_BACKEND_TO_UI: Record<RolCodigo, UserRole> = {
  ADMIN: "administrador",
  JEFE_AREA: "jefe_area",
  GESTOR_PROYECTO: "gestor_proyecto",
  RECURSO_TECNICO: "recurso_tecnico",
};

const ROL_UI_TO_BACKEND: Record<UserRole, RolCodigo> = {
  administrador: "ADMIN",
  jefe_area: "JEFE_AREA",
  gestor_proyecto: "GESTOR_PROYECTO",
  recurso_tecnico: "RECURSO_TECNICO",
};

export function rolBackendToUi(codigo: string): UserRole {
  return (ROL_BACKEND_TO_UI as Record<string, UserRole>)[codigo] ?? "recurso_tecnico";
}

export function rolUiToBackend(role: UserRole): RolCodigo {
  return ROL_UI_TO_BACKEND[role];
}

// estado 1 -> active, 0 -> inactive.
export function estadoToStatus(estado: number): UserStatus {
  return estado === 1 ? "active" : "inactive";
}

export function statusToEstado(status: UserStatus): 0 | 1 {
  return status === "active" ? 1 : 0;
}

// Construye la UI User desde el backend. La planilla existente usa
// nombres separados (firstName/lastNamePaternal/lastNameMaternal)
// mientras el backend viene con nombres + dos apellidos.
export function usuarioApiToUser(api: UsuarioApi): User {
  return {
    id: api.id,
    firstName: api.nombres,
    lastNamePaternal: api.apellidoPaterno,
    lastNameMaternal: api.apellidoMaterno,
    email: api.email,
    role: rolBackendToUi(api.rol.codigo),
    status: estadoToStatus(api.estado ?? 1),
  };
}

// Solo para uso del facade: el modal hoy no pide rolId directamente,
// lo pide como role (UI). Acá lo transformamos cuando vamos al backend.
// Devuelve null si el rol no esta cargado (caso de error en la carga
// de roles: el facade deberia bloquear el submit hasta tenerlos).
export interface RolLookup {
  byId: ReadonlyMap<string, RolApi>;
  byCodigo: ReadonlyMap<string, RolApi>;
}

export function buildRolLookup(roles: RolApi[]): RolLookup {
  const byId = new Map(roles.map((r) => [r.id, r]));
  const byCodigo = new Map(roles.map((r) => [r.codigo, r]));
  return { byId, byCodigo };
}

export function resolveRolId(lookup: RolLookup, role: UserRole): string | null {
  const codigo = rolUiToBackend(role);
  return lookup.byCodigo.get(codigo)?.id ?? null;
}
