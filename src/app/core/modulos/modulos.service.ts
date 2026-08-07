import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { environment } from "@env/environment";
import { extractProblemMessage } from "@utils/problem-detail";

import type { ModuloResponse } from "./modulo.models";

const NAV_FALLBACK: ModuloResponse[] = [];

// Fuente de verdad para el sidebar. Cachea por rolId: si ya hay modulos
// cargados para el rol actual, no vuelve a la red. Se invalida solo
// cuando el usuario cambia de sesion (otro rol).
@Injectable({ providedIn: "root" })
export class ModulosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/modulos`;

  private readonly _modulos = signal<ModuloResponse[]>([]);
  private readonly _rolActivo = signal<string | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly modulos = this._modulos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._modulos().length);

  // Cache key es el rolId; si cambia el rol activo, recargar.
  async cargar(rolId: string): Promise<void> {
    if (!rolId) return;
    if (this._loading()) return;
    if (this._rolActivo() === rolId && this._modulos().length > 0) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(this.listarPorRol(rolId));
      this._modulos.set(data ?? NAV_FALLBACK);
      this._rolActivo.set(rolId);
    } catch (err) {
      this._modulos.set(NAV_FALLBACK);
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  // Llamado tras logout para no servir modulos de un rol previo a otro usuario.
  reset(): void {
    this._modulos.set(NAV_FALLBACK);
    this._rolActivo.set(null);
    this._error.set(null);
  }

  listarPorRol(rolId: string) {
    return this.http.get<ModuloResponse[]>(`${this.baseUrl}/por-rol/${rolId}`);
  }
}
