import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type {
  ProyectoApi,
  ProyectoCrearApi,
} from "../models/project-api";

// Capa fina contra /api/proyectos del gateway. Firma 1:1 con ProyectoController.java.
@Injectable({ providedIn: "root" })
export class ProyectosApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/proyectos`;

  listar(): Observable<ProyectoApi[]> {
    return this.http.get<ProyectoApi[]>(this.baseUrl);
  }

  buscarPorId(id: string): Observable<ProyectoApi> {
    return this.http.get<ProyectoApi>(`${this.baseUrl}/${id}`);
  }

  crear(body: ProyectoCrearApi): Observable<ProyectoApi> {
    return this.http.post<ProyectoApi>(this.baseUrl, body);
  }

  actualizar(id: string, body: ProyectoCrearApi): Observable<ProyectoApi> {
    return this.http.put<ProyectoApi>(`${this.baseUrl}/${id}`, body);
  }

  eliminar(id: string, motivo: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      body: { motivoEliminacion: motivo },
    });
  }
}
