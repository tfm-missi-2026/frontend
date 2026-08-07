import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  ActividadApi,
  ActividadCrearApi,
} from "../models/timesheet-actividad-api";

// Capa fina contra /api/actividades. Firma 1:1 con ActividadController.java.
@Injectable({ providedIn: "root" })
export class ActividadesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/actividades`;

  listar(): Observable<ActividadApi[]> {
    return this.http.get<ActividadApi[]>(this.baseUrl);
  }

  listarPorFecha(fecha: string): Observable<ActividadApi[]> {
    const params = new HttpParams().set("fecha", fecha);
    return this.http.get<ActividadApi[]>(`${this.baseUrl}/por-fecha`, { params });
  }

  buscarPorId(id: string): Observable<ActividadApi> {
    return this.http.get<ActividadApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: ActividadCrearApi): Observable<ActividadApi> {
    return this.http.post<ActividadApi>(this.baseUrl, body);
  }

  actualizar(id: string, body: ActividadCrearApi): Observable<ActividadApi> {
    return this.http.put<ActividadApi>(`${this.baseUrl}/${id}`, body);
  }

  eliminar(id: string, motivo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      body: { motivoEliminacion: motivo },
    });
  }
}
