import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { environment } from "@env/environment";
import { extractProblemMessage } from "@utils/problem-detail";

import { LookupsService } from "@core/lookups/lookups.service";

import type { ModuloResponse } from "./modulo.models";

const NAV_FALLBACK: ModuloResponse[] = [];

@Injectable({ providedIn: "root" })
export class ModulosService {
  private readonly http = inject(HttpClient);
  private readonly lookups = inject(LookupsService);
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/modulos`;

  private readonly _modulos = signal<ModuloResponse[]>([]);
  private readonly _rolActivo = signal<string | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private _cargaEnProgreso: Promise<void> | null = null;

  readonly modulos = this._modulos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._modulos().length);
  readonly tieneDatos = computed(() => this._modulos().length > 0);

  async cargar(rolId: string): Promise<void> {
    if (!rolId) return;
    if (this._rolActivo() === rolId && this._modulos().length > 0) return;
    if (this._cargaEnProgreso) return this._cargaEnProgreso;
    this._cargaEnProgreso = this.ejecutarCarga(rolId).finally(() => {
      this._cargaEnProgreso = null;
    });
    return this._cargaEnProgreso;
  }

  tieneModulo(codigo: string): boolean {
    return this._modulos().some((m) => m.codigo === codigo && m.estado === 1);
  }

  invalidar(rolId: string): void {
    if (this._rolActivo() !== rolId) return;
    this._modulos.set(NAV_FALLBACK);
    this._rolActivo.set(null);
    this.lookups.setRolActivo(null);
  }

  reset(): void {
    this._modulos.set(NAV_FALLBACK);
    this._rolActivo.set(null);
    this._error.set(null);
    this.lookups.setRolActivo(null);
  }

  listarPorRol(rolId: string) {
    return this.http.get<ModuloResponse[]>(`${this.baseUrl}/por-rol/${rolId}`);
  }

  private async ejecutarCarga(rolId: string): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(this.listarPorRol(rolId));
      this._modulos.set(data ?? NAV_FALLBACK);
      this._rolActivo.set(rolId);
      this.lookups.setModulosPorRol(rolId, data ?? NAV_FALLBACK);
      this.lookups.setRolActivo(rolId);
    } catch (err) {
      this._modulos.set(NAV_FALLBACK);
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }
}