import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  SubproyectoActualizarApi,
  SubproyectoApi,
  SubproyectoCrearApi,
} from "../models/project-api";

// Capa fina contra /api/subproyectos. Firma 1:1 con SubproyectoController.java.
@Injectable({ providedIn: "root" })
export class SubproyectosApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/subproyectos`;

  listar(): Observable<SubproyectoApi[]> {
    return this.http.get<SubproyectoApi[]>(this.baseUrl);
  }

  listarPorProyecto(proyectoId: string): Observable<SubproyectoApi[]> {
    return this.http.get<SubproyectoApi[]>(
      `${this.baseUrl}/por-proyecto/${proyectoId}`,
    );
  }

  buscarPorId(id: string): Observable<SubproyectoApi> {
    return this.http.get<SubproyectoApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: SubproyectoCrearApi): Observable<SubproyectoApi> {
    return this.http.post<SubproyectoApi>(this.baseUrl, body);
  }

  actualizar(
    id: string,
    body: SubproyectoActualizarApi,
  ): Observable<SubproyectoApi> {
    return this.http.put<SubproyectoApi>(`${this.baseUrl}/${id}`, body);
  }

  eliminar(id: string, motivo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      body: { motivoEliminacion: motivo },
    });
  }
}
