import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "@env/environment";

export interface CambiarContraseniaRequest {
  contraseniaActual: string;
  contraseniaNueva: string;
}

@Injectable({ providedIn: "root" })
export class AccountApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}/usuarios`;

  cambiarContrasenia(body: CambiarContraseniaRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/me/password`, body);
  }
}
