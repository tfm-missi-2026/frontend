export interface LoginRequest {
  email: string;
  contrasenia: string;
}

export interface Rol {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  estado?: number | null;
}

export interface UsuarioInfo {
  id: string;
  email: string;
  nombreCompleto: string;
  rol: Rol;
}

export interface LoginResponse {
  tokenAcceso: string;
  tipoToken: string;
  expiraEnSegundos: number;
  usuario: UsuarioInfo;
}
