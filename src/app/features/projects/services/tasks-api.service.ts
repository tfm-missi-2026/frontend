import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  TareaActualizarApi,
  TareaApi,
  TareaCrearApi,
} from "../models/project-api";

// Capa fina contra /api/tareas. Firma 1:1 con TareaController.java.
@Injectable({ providedIn: "root" })
export class TareasApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/tareas`;

  listar(): Observable<TareaApi[]> {
    return this.http.get<TareaApi[]>(this.baseUrl);
  }

  listarPorSubproyecto(subproyectoId: string): Observable<TareaApi[]> {
    return this.http.get<TareaApi[]>(
      `${this.baseUrl}/por-subproyecto/${subproyectoId}`,
    );
  }

  buscarPorId(id: string): Observable<TareaApi> {
    return this.http.get<TareaApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: TareaCrearApi): Observable<TareaApi> {
    return this.http.post<TareaApi>(this.baseUrl, body);
  }

  actualizar(id: string, body: TareaActualizarApi): Observable<TareaApi> {
    return this.http.put<TareaApi>(`${this.baseUrl}/${id}`, body);
  }

  eliminar(id: string, motivo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      body: { motivoEliminacion: motivo },
    });
  }
}
