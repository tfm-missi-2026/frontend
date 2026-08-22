import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { environment } from "@env/environment";

import type { ModuloResponse } from "@core/modulos/modulo.models";

import type { RolApi } from "@features/roles-permissions/models/role-api";

@Injectable({ providedIn: "root" })
export class LookupsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}`;

  private readonly _roles = signal<RolApi[]>([]);
  private readonly _modulos = signal<ModuloResponse[]>([]);
  private readonly _rolesLoading = signal<boolean>(false);
  private readonly _modulosLoading = signal<boolean>(false);
  private readonly _rolesError = signal<string | null>(null);
  private readonly _modulosError = signal<string | null>(null);
  private readonly _rolActivo = signal<string | null>(null);

  readonly roles = this._roles.asReadonly();
  readonly modulos = this._modulos.asReadonly();
  readonly rolesLoading = this._rolesLoading.asReadonly();
  readonly modulosLoading = this._modulosLoading.asReadonly();
  readonly rolesError = this._rolesError.asReadonly();
  readonly modulosError = this._modulosError.asReadonly();
  readonly rolesCount = computed(() => this._roles().length);
  readonly modulosCount = computed(() => this._modulos().length);

  async loadRoles(): Promise<void> {
    if (this._rolesLoading()) return;
    if (this._roles().length > 0) return;
    this._rolesLoading.set(true);
    this._rolesError.set(null);
    try {
      const data = await firstValueFrom(
        this.http.get<RolApi[]>(`${this.baseUrl}/roles/todos`),
      );
      this._roles.set(data ?? []);
    } catch (err) {
      this._rolesError.set(err instanceof Error ? err.message : String(err));
    } finally {
      this._rolesLoading.set(false);
    }
  }

  async loadModules(): Promise<void> {
    if (this._modulosLoading()) return;
    if (this._modulos().length > 0) return;
    this._modulosLoading.set(true);
    this._modulosError.set(null);
    try {
      const data = await firstValueFrom(
        this.http.get<ModuloResponse[]>(`${this.baseUrl}/modulos/todos`),
      );
      this._modulos.set(data ?? []);
    } catch (err) {
      this._modulosError.set(err instanceof Error ? err.message : String(err));
    } finally {
      this._modulosLoading.set(false);
    }
  }

  async loadModulesForRole(rolId: string): Promise<ModuloResponse[]> {
    const cached = this._modulosPorRol().get(rolId);
    if (cached) return cached;
    const data = await firstValueFrom(
      this.http.get<ModuloResponse[]>(`${this.baseUrl}/roles/${rolId}/modulos`),
    );
    const list = data ?? [];
    this._modulosPorRol.update((m) => {
      const next = new Map(m);
      next.set(rolId, list);
      return next;
    });
    return list;
  }

  setModulosPorRol(rolId: string, modulos: ModuloResponse[]): void {
    this._modulosPorRol.update((m) => {
      const next = new Map(m);
      next.set(rolId, modulos);
      return next;
    });
  }

  invalidarModulosPorRol(rolId: string): void {
    this._modulosPorRol.update((m) => {
      if (!m.has(rolId)) return m;
      const next = new Map(m);
      next.delete(rolId);
      return next;
    });
  }

  getModulosPorRol(rolId: string): ModuloResponse[] {
    return this._modulosPorRol().get(rolId) ?? [];
  }

  setRolActivo(rolId: string | null): void {
    this._rolActivo.set(rolId);
  }

  getRolActivo(): string | null {
    return this._rolActivo();
  }

  setModulo(modulo: ModuloResponse): void {
    this._modulos.update((arr) => {
      const idx = arr.findIndex((m) => m.id === modulo.id);
      if (idx === -1) return [...arr, modulo];
      const next = arr.slice();
      next[idx] = modulo;
      return next;
    });
  }

  invalidarModulo(id: string): void {
    this._modulos.update((arr) => arr.filter((m) => m.id !== id));
  }

  replaceModulos(modulos: ModuloResponse[]): void {
    this._modulos.set(modulos);
  }

  readonly secciones = computed(() => {
    const map = new Map<string, { codigo: string; titulo: string; orden: number }>();
    for (const m of this._modulos()) {
      const codigo = m.seccion ?? "_otros";
      if (!map.has(codigo)) {
        map.set(codigo, {
          codigo,
          titulo: m.seccionTitulo ?? codigo,
          orden: m.seccionOrden ?? 99,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.orden - b.orden);
  });

  reset(): void {
    this._roles.set([]);
    this._modulos.set([]);
    this._modulosPorRol.set(new Map());
    this._rolesError.set(null);
    this._modulosError.set(null);
    this._rolActivo.set(null);
  }

  private readonly _modulosPorRol = signal<Map<string, ModuloResponse[]>>(
    new Map(),
  );
}