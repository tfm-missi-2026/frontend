import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

import type { ModuloResponse } from "./modulo.models";

@Injectable({ providedIn: "root" })
export class ModulosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/modulos`;

  listarPorRol(rolId: string): Observable<ModuloResponse[]> {
    return this.http.get<ModuloResponse[]>(`${this.baseUrl}/por-rol/${rolId}`);
  }
}
