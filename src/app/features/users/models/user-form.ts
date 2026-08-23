import type { UserRole, UserStatus } from "./user";

export interface UserFormData {
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  email: string;
  role: UserRole | null;
  status: UserStatus;
  initialPassword?: string;
}

export type UserFormSavePayload =
  | {
      mode: "create";
      data: {
        firstName: string;
        lastNamePaternal: string;
        lastNameMaternal: string;
        email: string;
        role: UserRole;
        status: UserStatus;
        initialPassword: string;
      };
    }
  | {
      mode: "edit";
      id: string;
      data: {
        firstName: string;
        lastNamePaternal: string;
        lastNameMaternal: string;
        email: string;
        role: UserRole;
        status: UserStatus;
      };
    };

export function emptyUserForm(): UserFormData {
  return {
    firstName: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    email: "",
    role: null,
    status: "active",
    initialPassword: "",
  };
}
