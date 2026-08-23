import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";
import { UsuarioQueryParams } from "@core/query-params";
import { type PageData } from "@core/models";

import type {
  EliminacionRequest,
  ResetPasswordRequest,
  UsuarioActualizarRequest,
  UsuarioApi,
  UsuarioCrearRequest,
} from "../models/user-api";

// Capa fina contra el gateway. No contiene logica de UI ni signals.
// Las firmas son 1:1 con UsuarioController.java / UsuarioMapper.java.
//
// `listar()` consume `/todos` (listado completo sin paginar, usado por
// consumers legacy: dashboard, planning, projects, team-load, variations,
// resource-dashboard, etc.).
//
// `list(query)` consume `/` con paginacion server-side, usado por
// `UsersAdminService` para la pagina de administracion de usuarios
// (UiTable en modo server-side con sort + pageSize).
@Injectable({ providedIn: "root" })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/usuarios`;

  listar(): Observable<UsuarioApi[]> {
    return this.http.get<UsuarioApi[]>(`${this.baseUrl}/todos`);
  }

  list(query: UsuarioQueryParams): Observable<PageData<UsuarioApi>> {
    return this.http.get<PageData<UsuarioApi>>(this.baseUrl, {
      params: query.toHttpParams(),
    });
  }

  buscarPorId(id: string): Observable<UsuarioApi> {
    return this.http.get<UsuarioApi>(`${this.baseUrl}/${id}`);
  }

  me(): Observable<UsuarioApi> {
    return this.http.get<UsuarioApi>(`${this.baseUrl}/me`);
  }

  crear(body: UsuarioCrearRequest): Observable<UsuarioApi> {
    return this.http.post<UsuarioApi>(this.baseUrl, body);
  }

  actualizar(id: string, body: UsuarioActualizarRequest): Observable<UsuarioApi> {
    return this.http.put<UsuarioApi>(`${this.baseUrl}/${id}`, body);
  }

  eliminar(id: string, body: EliminacionRequest): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { body });
  }

  resetPassword(id: string, body: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/reset-password`, body);
  }
}
