import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

import { environment } from "@env/environment";

import type { LoginRequest, LoginResponse, UsuarioInfo } from "./auth.models";

const TOKEN_KEY = "spsrt.token";
const USER_KEY = "spsrt.usuario";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/auth`;

  private readonly _token = signal<string | null>(
    localStorage.getItem(TOKEN_KEY),
  );
  private readonly _usuario = signal<UsuarioInfo | null>(this.leerUsuario());

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly rolId = computed(() => this._usuario()?.rol?.id ?? null);

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, credenciales)
      .pipe(tap((respuesta) => this.establecerSesion(respuesta)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._usuario.set(null);
  }

  private establecerSesion(respuesta: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, respuesta.tokenAcceso);
    localStorage.setItem(USER_KEY, JSON.stringify(respuesta.usuario));
    this._token.set(respuesta.tokenAcceso);
    this._usuario.set(respuesta.usuario);
  }

  private leerUsuario(): UsuarioInfo | null {
    const crudo = localStorage.getItem(USER_KEY);
    if (!crudo) {
      return null;
    }
    try {
      return JSON.parse(crudo) as UsuarioInfo;
    } catch {
      return null;
    }
  }
}
