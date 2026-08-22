import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  CatalogoApi,
  CatalogoCrearApi,
} from "../models/catalog-api";

// Capa fina contra /api/catalogo del gateway.
// Firma 1:1 con CatalogoController.java.
@Injectable({ providedIn: "root" })
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/catalogo`;

  listar(): Observable<CatalogoApi[]> {
    return this.http.get<CatalogoApi[]>(this.baseUrl);
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

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
