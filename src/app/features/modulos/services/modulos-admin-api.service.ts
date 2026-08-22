import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";
import { ModuloQueryParams } from "@core/query-params";
import { type PageData } from "@core/models";

import type { ModuloResponse } from "@core/modulos/modulo.models";

export interface ModuloCrearRequest {
  codigo: string;
  nombre: string;
  icono?: string;
  orden: number;
  seccion: string;
  tipo: "SECTION" | "MENU" | "SUBMENU";
  descripcion?: string;
}

export type ModuloActualizarRequest = Omit<ModuloCrearRequest, "codigo">;

export interface ModuloEstadoRequest {
  estado: 0 | 1;
  motivoEliminacion?: string;
}

@Injectable({ providedIn: "root" })
export class ModulosAdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/modulos`;

  list(query: ModuloQueryParams): Observable<PageData<ModuloResponse>> {
    return this.http.get<PageData<ModuloResponse>>(this.baseUrl, {
      params: query.toHttpParams(),
    });
  }

  listAll(): Observable<ModuloResponse[]> {
    return this.http.get<ModuloResponse[]>(`${this.baseUrl}/todos`);
  }

  findById(id: string): Observable<ModuloResponse> {
    return this.http.get<ModuloResponse>(`${this.baseUrl}/${id}`);
  }

  create(body: ModuloCrearRequest): Observable<ModuloResponse> {
    return this.http.post<ModuloResponse>(this.baseUrl, body);
  }

  update(
    id: string,
    body: ModuloActualizarRequest,
  ): Observable<ModuloResponse> {
    return this.http.put<ModuloResponse>(`${this.baseUrl}/${id}`, body);
  }

  changeState(
    id: string,
    body: ModuloEstadoRequest,
  ): Observable<ModuloResponse> {
    return this.http.put<ModuloResponse>(
      `${this.baseUrl}/${id}/estado`,
      body,
    );
  }
}