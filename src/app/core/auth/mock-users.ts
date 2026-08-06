import type { LoginResponse } from "./auth.models";

interface MockUser {
  email: string;
  contrasenia: string;
  nombreCompleto: string;
  id: string;
}

const MOCK_USERS: MockUser[] = [
  {
    id: "u-pedro-soria",
    email: "pedro.soria@institucion.gob.pe",
    contrasenia: "Spsrt.2026",
    nombreCompleto: "Pedro Soria",
  },
  {
    id: "u-marcos-pacheco",
    email: "marcos.pacheco@institucion.gob.pe",
    contrasenia: "Spsrt.2026",
    nombreCompleto: "Marcos Pacheco",
  },
  {
    id: "u-edwin-pacheco",
    email: "edwin.pacheco@institucion.gob.pe",
    contrasenia: "Spsrt.2026",
    nombreCompleto: "Edwin Pacheco",
  },
];

export const ADMIN_ROL = {
  id: "r1",
  codigo: "ADM",
  nombre: "Administrador",
  descripcion: "Acceso total al sistema.",
  estado: 1,
};

export function findMockUser(
  email: string,
  contrasenia: string,
): MockUser | null {
  const normalizado = email.trim().toLowerCase();
  return (
    MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === normalizado && u.contrasenia === contrasenia,
    ) ?? null
  );
}

export function buildMockLoginResponse(usuario: MockUser): LoginResponse {
  return {
    tokenAcceso: `mock-token-${usuario.id}-${Date.now()}`,
    tipoToken: "Bearer",
    expiraEnSegundos: 3600,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nombreCompleto: usuario.nombreCompleto,
      rol: ADMIN_ROL,
    },
  };
}