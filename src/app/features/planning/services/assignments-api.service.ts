import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  AsignacionApi,
  AsignacionCrearApi,
} from "../models/assignment-api";

// Capa fina contra /api/asignaciones. Firma 1:1 con AsignacionController.java.
@Injectable({ providedIn: "root" })
export class AssignmentsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/asignaciones`;

  listar(): Observable<AsignacionApi[]> {
    return this.http.get<AsignacionApi[]>(this.baseUrl);
  }

  listarPorUsuario(usuarioId: string): Observable<AsignacionApi[]> {
    return this.http.get<AsignacionApi[]>(
      `${this.baseUrl}/por-usuario/${usuarioId}`,
    );
  }

  listarPorTarea(tareaId: string): Observable<AsignacionApi[]> {
    return this.http.get<AsignacionApi[]>(
      `${this.baseUrl}/por-tarea/${tareaId}`,
    );
  }

  buscarPorId(id: string): Observable<AsignacionApi> {
    return this.http.get<AsignacionApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: AsignacionCrearApi): Observable<AsignacionApi> {
    return this.http.post<AsignacionApi>(this.baseUrl, body);
  }

  eliminar(id: string, motivo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      body: { motivoEliminacion: motivo },
    });
  }
}
