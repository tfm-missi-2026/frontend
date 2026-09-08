import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";
import { CatalogoQueryParams } from "@core/query-params";
import { type PageData } from "@core/models";

import type {
  CatalogoApi,
  CatalogoCrearApi,
} from "../models/catalog-api";

@Injectable({ providedIn: "root" })
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/catalogo`;

  listar(): Observable<CatalogoApi[]> {
    return this.http.get<CatalogoApi[]>(`${this.baseUrl}/todos`);
  }

  list(query: CatalogoQueryParams): Observable<PageData<CatalogoApi>> {
    return this.http.get<PageData<CatalogoApi>>(this.baseUrl, {
      params: query.toHttpParams(),
    });
  }

  listarPorGrupo(grupo: string): Observable<CatalogoApi[]> {
    return this.http.get<CatalogoApi[]>(`${this.baseUrl}/grupo/${grupo}`);
  }

  buscarPorId(id: string): Observable<CatalogoApi> {
    return this.http.get<CatalogoApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: CatalogoCrearApi): Observable<CatalogoApi> {
    return this.http.post<CatalogoApi>(this.baseUrl, body);
  }

  actualizar(
    id: string,
    body: CatalogoCrearApi,
  ): Observable<CatalogoApi> {
    return this.http.put<CatalogoApi>(`${this.baseUrl}/${id}`, body);
  }

  eliminar(id: string, body: { motivoEliminacion: string }): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { body });
  }
}
