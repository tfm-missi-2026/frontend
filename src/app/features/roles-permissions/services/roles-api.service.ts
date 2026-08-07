import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type { ModuloResponse } from "@core/modulos/modulo.models";
import type { RolApi } from "../models/role-api";

// Capa fina contra /api/roles y /api/modulos del gateway.
// Usuarios lo consume para resolver rolId. RolesService lo envuelve
// para agregar signals y mapear el shape UI.
@Injectable({ providedIn: "root" })
export class RolesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/roles`;
  private readonly modulosBaseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/modulos`;

  listar(): Observable<RolApi[]> {
    return this.http.get<RolApi[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<RolApi> {
    return this.http.get<RolApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: {
    codigo: string;
    nombre: string;
    descripcion?: string;
  }): Observable<RolApi> {
    return this.http.post<RolApi>(this.baseUrl, body);
  }

  listarModulos(rolId: string): Observable<ModuloResponse[]> {
    return this.http.get<ModuloResponse[]>(`${this.baseUrl}/${rolId}/modulos`);
  }

  asignarModulos(
    rolId: string,
    moduloIds: string[],
  ): Observable<ModuloResponse[]> {
    return this.http.put<ModuloResponse[]>(
      `${this.baseUrl}/${rolId}/modulos`,
      { moduloIds },
    );
  }

  listarModulosTodos(): Observable<ModuloResponse[]> {
    return this.http.get<ModuloResponse[]>(this.modulosBaseUrl);
  }
}
