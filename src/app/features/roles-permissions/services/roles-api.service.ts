import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";
import { RolQueryParams } from "@core/query-params";
import { type PageData } from "@core/models";

import type { ModuloResponse } from "@core/modulos/modulo.models";
import type { RolApi } from "../models/role-api";

@Injectable({ providedIn: "root" })
export class RolesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/roles`;
  private readonly modulosBaseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/modulos`;

  list(query: RolQueryParams): Observable<PageData<RolApi>> {
    return this.http.get<PageData<RolApi>>(this.baseUrl, {
      params: query.toHttpParams(),
    });
  }

  listAll(): Observable<RolApi[]> {
    return this.http.get<RolApi[]>(`${this.baseUrl}/todos`);
  }

  findById(id: string): Observable<RolApi> {
    return this.http.get<RolApi>(`${this.baseUrl}/${id}`);
  }

  create(body: {
    codigo: string;
    nombre: string;
    descripcion?: string;
    paginaInicioId: string;
  }): Observable<RolApi> {
    return this.http.post<RolApi>(this.baseUrl, body);
  }

  update(
    id: string,
    body: { nombre: string; descripcion?: string; paginaInicioId: string },
  ): Observable<RolApi> {
    return this.http.put<RolApi>(`${this.baseUrl}/${id}`, body);
  }

  delete(id: string, body: { motivoEliminacion: string }): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { body });
  }

  listModules(rolId: string): Observable<ModuloResponse[]> {
    return this.http.get<ModuloResponse[]>(`${this.baseUrl}/${rolId}/modulos`);
  }

  replaceModules(
    rolId: string,
    moduloIds: string[],
  ): Observable<ModuloResponse[]> {
    return this.http.put<ModuloResponse[]>(
      `${this.baseUrl}/${rolId}/modulos`,
      { moduloIds },
    );
  }
}