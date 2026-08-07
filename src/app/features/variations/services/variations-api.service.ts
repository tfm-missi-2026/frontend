import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  VariacionApi,
  VariacionCrearApi,
  VariacionResolverApi,
} from "../models/variation-api";

// Capa fina contra /api/variaciones. Firma 1:1 con VariacionController.java.
@Injectable({ providedIn: "root" })
export class VariationsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/variaciones`;

  listar(): Observable<VariacionApi[]> {
    return this.http.get<VariacionApi[]>(this.baseUrl);
  }

  listarPorTarea(tareaId: string): Observable<VariacionApi[]> {
    return this.http.get<VariacionApi[]>(
      `${this.baseUrl}/por-tarea/${tareaId}`,
    );
  }

  buscarPorId(id: string): Observable<VariacionApi> {
    return this.http.get<VariacionApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: VariacionCrearApi): Observable<VariacionApi> {
    return this.http.post<VariacionApi>(this.baseUrl, body);
  }

  resolver(
    id: string,
    body: VariacionResolverApi,
  ): Observable<VariacionApi> {
    return this.http.put<VariacionApi>(
      `${this.baseUrl}/${id}/resolver`,
      body,
    );
  }

  eliminar(id: string, motivo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      body: { motivoEliminacion: motivo },
    });
  }
}
