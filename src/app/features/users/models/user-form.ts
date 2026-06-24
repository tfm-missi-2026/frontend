import type { UserRole, UserStatus } from "./user";

export interface UserFormData {
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  initialPassword?: string;
}

export type UserFormSavePayload =
  | { mode: "create"; data: Required<Omit<UserFormData, "initialPassword">> & { initialPassword: string } }
  | { mode: "edit"; id: string; data: Omit<UserFormData, "initialPassword"> };

export function emptyUserForm(): UserFormData {
  return {
    firstName: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    email: "",
    role: "recurso_tecnico",
    status: "active",
    initialPassword: "",
  };
}