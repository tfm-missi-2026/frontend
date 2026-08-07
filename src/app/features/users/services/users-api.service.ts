import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  EliminacionRequest,
  ResetPasswordRequest,
  UsuarioActualizarRequest,
  UsuarioApi,
  UsuarioCrearRequest,
} from "../models/user-api";

// Capa fina contra el gateway. No contiene logica de UI ni signals.
// Si necesitas un endpoint nuevo del backend, agregalo aca con
// la firma 1:1 de UsuarioMapper.java / UsuarioController.java.
@Injectable({ providedIn: "root" })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/usuarios`;

  listar(): Observable<UsuarioApi[]> {
    return this.http.get<UsuarioApi[]>(this.baseUrl);
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

  // Helper opcional para paginacion cuando el backend la exponga.
  // Hoy ms-administracion devuelve List<UsuarioResponse> plano; queda
  // como punto de extension para cuando se sume page/size al controller.
  listarPaginado(
    page: number,
    size: number,
  ): Observable<UsuarioApi[]> {
    const params = new HttpParams()
      .set("page", String(page))
      .set("size", String(size));
    return this.http.get<UsuarioApi[]>(this.baseUrl, { params });
  }
}
