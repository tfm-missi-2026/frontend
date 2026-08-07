import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

import { environment } from "@env/environment";
import { readJson, removeItem, writeJson } from "@utils/storage";

import type { LoginRequest, LoginResponse, UsuarioInfo } from "./auth.models";

const TOKEN_KEY = "spsrt.token";
const USER_KEY = "spsrt.usuario";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/auth`;

  private readonly _token = signal<string | null>(this.readToken());
  private readonly _usuario = signal<UsuarioInfo | null>(readJson<UsuarioInfo | null>(USER_KEY, null));

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly rolId = computed(() => this._usuario()?.rol?.id ?? null);

  // Login contra el backend real (ms-administracion). Los 3 usuarios
  // Login contra el backend real (ms-administracion). Los 3 usuarios
  // de desarrollo (Pedro Soria, Marcos Pacheco, Edwin Pacheco) viven
  // ahora en la BD via V3__seed_mock_users.sql con contrasenia `Spsrt.2026`.
  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, credenciales)
      .pipe(tap((respuesta) => this.establecerSesion(respuesta)));
  }

  logout(): void {
    removeItem(TOKEN_KEY);
    removeItem(USER_KEY);
    this._token.set(null);
    this._usuario.set(null);
  }

  private readToken(): string | null {
    if (typeof localStorage === "undefined") return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private establecerSesion(respuesta: LoginResponse): void {
    writeJson(USER_KEY, respuesta.usuario);
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(TOKEN_KEY, respuesta.tokenAcceso);
      } catch {
        // ignora quota/security
      }
    }
    this._token.set(respuesta.tokenAcceso);
    this._usuario.set(respuesta.usuario);
  }
}
