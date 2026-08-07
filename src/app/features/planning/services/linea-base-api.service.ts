import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  CongelarLineaBaseRequestApi,
  LineaBaseApi,
} from "../models/linea-base-api";

// Capa fina contra /api/linea-base. Firma 1:1 con LineaBaseController.java.
@Injectable({ providedIn: "root" })
export class LineaBaseApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/linea-base`;

  porProyecto(proyectoId: string): Observable<LineaBaseApi[]> {
    return this.http.get<LineaBaseApi[]>(
      `${this.baseUrl}/por-proyecto/${proyectoId}`,
    );
  }

  buscarPorId(id: string): Observable<LineaBaseApi> {
    return this.http.get<LineaBaseApi>(`${this.baseUrl}/${id}`);
  }

  congelar(body: CongelarLineaBaseRequestApi): Observable<LineaBaseApi> {
    return this.http.post<LineaBaseApi>(`${this.baseUrl}/congelar`, body);
  }
}
