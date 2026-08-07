// Shape 1:1 con el backend (ms-administracion).
// Mantener estos tipos sincronizados con:
//   tfm-backend/ms-administracion/src/main/java/pe/unir/tfm/srp/administracion/dto/response/UsuarioResponse.java
//   .../dto/response/RolResponse.java
//   .../dto/request/UsuarioCrearRequest.java
//   .../dto/request/UsuarioActualizarRequest.java
//   .../dto/request/EliminacionRequest.java
//
// Cualquier cambio aca debe reflejarse en los services y en el mapper
// (./users.mapper.ts). NO usar este modelo directamente en componentes.

export type Estado = 0 | 1;

export interface RolApi {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  estado?: Estado;
}

export interface UsuarioApi {
  id: string;
  email: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: RolApi;
  estado: Estado;
}

export interface UsuarioCrearRequest {
  email: string;
  contrasenia: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rolId: string;
}

export interface UsuarioActualizarRequest {
  email: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rolId: string;
}

export interface EliminacionRequest {
  motivoEliminacion: string;
}

export interface ResetPasswordRequest {
  contrasenia: string;
}

// Codigos de rol que espera el backend (case-sensitive en la BD).
// Coinciden con los Rol.codigo del seed en V2__seed.sql (ms-administracion).
export const ROL_CODIGO = {
  ADMIN: "ADMIN",
  JEFE_AREA: "JEFE_AREA",
  GESTOR_PROYECTO: "GESTOR_PROYECTO",
  RECURSO_TECNICO: "RECURSO_TECNICO",
} as const;

export type RolCodigo = (typeof ROL_CODIGO)[keyof typeof ROL_CODIGO];
