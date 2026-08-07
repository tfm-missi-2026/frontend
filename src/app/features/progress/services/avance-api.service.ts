import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type { AvanceProyectoApi } from "../models/progress-api";

// Capa fina contra /api/avance. Firma 1:1 con AvanceController.java.
@Injectable({ providedIn: "root" })
export class AvanceApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/avance`;

  porProyecto(proyectoId: string): Observable<AvanceProyectoApi> {
    return this.http.get<AvanceProyectoApi>(
      `${this.baseUrl}/por-proyecto/${proyectoId}`,
    );
  }
}
