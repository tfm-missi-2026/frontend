import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  BitacoraApi,
  BitacoraCrearApi,
} from "../models/timesheet-api";

// Capa fina contra /api/bitacora del gateway. Firma 1:1 con BitacoraController.java.
@Injectable({ providedIn: "root" })
export class TimesheetApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/bitacora`;

  mia(fecha: string): Observable<BitacoraApi[]> {
    return this.http.get<BitacoraApi[]>(`${this.baseUrl}/mia`, {
      params: { fecha },
    });
  }

  miaRango(desde: string, hasta: string): Observable<BitacoraApi[]> {
    return this.http.get<BitacoraApi[]>(`${this.baseUrl}/mia/rango`, {
      params: { desde, hasta },
    });
  }

  buscarPorId(id: string): Observable<BitacoraApi> {
    return this.http.get<BitacoraApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: BitacoraCrearApi): Observable<BitacoraApi> {
    return this.http.post<BitacoraApi>(this.baseUrl, body);
  }

  actualizar(
    id: string,
    body: BitacoraCrearApi,
  ): Observable<BitacoraApi> {
    return this.http.put<BitacoraApi>(`${this.baseUrl}/${id}`, body);
  }

  eliminar(id: string, motivo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      body: { motivoEliminacion: motivo },
    });
  }
}
