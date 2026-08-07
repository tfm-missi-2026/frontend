import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type { CargaRecursoApi } from "../models/carga-api";

// Capa fina contra /api/carga del gateway. Firma 1:1 con CargaController.java.
@Injectable({ providedIn: "root" })
export class CargaApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/carga`;

  equipo(desde: string, hasta: string): Observable<CargaRecursoApi[]> {
    const params = new HttpParams().set("desde", desde).set("hasta", hasta);
    return this.http.get<CargaRecursoApi[]>(`${this.baseUrl}/equipo`, { params });
  }

  porUsuario(
    usuarioId: string,
    desde: string,
    hasta: string,
  ): Observable<CargaRecursoApi> {
    const params = new HttpParams().set("desde", desde).set("hasta", hasta);
    return this.http.get<CargaRecursoApi>(
      `${this.baseUrl}/por-usuario/${usuarioId}`,
      { params },
    );
  }
}
