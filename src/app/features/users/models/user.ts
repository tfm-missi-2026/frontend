import type { SelectOption } from "@shared/ui/select/select.interface";

export type UserRole =
  | "recurso_tecnico"
  | "gestor_proyecto"
  | "jefe_area"
  | "administrador";

export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  recurso_tecnico: "Recurso Técnico",
  gestor_proyecto: "Gestor de Proyecto",
  jefe_area: "Jefe de Área",
  administrador: "Administrador",
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

export const USER_ROLE_OPTIONS: SelectOption[] = (
  Object.entries(USER_ROLE_LABELS) as [UserRole, string][]
).map(([value, label]) => ({ value, label }));

export const USER_STATUS_OPTIONS: SelectOption[] = (
  Object.entries(USER_STATUS_LABELS) as [UserStatus, string][]
).map(([value, label]) => ({ value, label }));

export function userFullName(u: User): string {
  return `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`.trim();
}