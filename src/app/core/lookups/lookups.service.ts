import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { environment } from "@env/environment";

import type { ModuloResponse } from "@core/modulos/modulo.models";
import type { RolApi } from "@features/roles-permissions/models/role-api";

// Cache compartida para datos de catalogo transversal (roles, modulos
// de sistema). Evita N fetches cuando varios features piden el mismo
// recurso (ej. UsersService y RolesService ambos piden /api/roles).
@Injectable({ providedIn: "root" })
export class LookupsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiGatewayUrl}${environment.apiPrefix}`;

  private readonly _roles = signal<RolApi[]>([]);
  private readonly _modulos = signal<ModuloResponse[]>([]);
  private readonly _rolesLoading = signal<boolean>(false);
  private readonly _modulosLoading = signal<boolean>(false);

  readonly roles = this._roles.asReadonly();
  readonly modulos = this._modulos.asReadonly();
  readonly rolesLoading = this._rolesLoading.asReadonly();
  readonly modulosLoading = this._modulosLoading.asReadonly();
  readonly rolesCount = computed(() => this._roles().length);
  readonly modulosCount = computed(() => this._modulos().length);

  async cargarRoles(): Promise<void> {
    if (this._rolesLoading()) return;
    if (this._roles().length > 0) return;
    this._rolesLoading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<RolApi[]>(`${this.baseUrl}/roles`),
      );
      this._roles.set(data ?? []);
    } finally {
      this._rolesLoading.set(false);
    }
  }

  async cargarModulos(): Promise<void> {
    if (this._modulosLoading()) return;
    if (this._modulos().length > 0) return;
    this._modulosLoading.set(true);
    try {
      const data = await firstValueFrom(
        this.http.get<ModuloResponse[]>(`${this.baseUrl}/modulos`),
      );
      this._modulos.set(data ?? []);
    } finally {
      this._modulosLoading.set(false);
    }
  }

  // El backend es la fuente de verdad de la relacion rol -> modulos.
  // Si la cache por rol ya existe, devolverla; si no, ir a la red y
  // cachear la respuesta cruda (ModuloResponse[]).
  async cargarModulosPorRol(rolId: string): Promise<ModuloResponse[]> {
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

  // Para que updatePermissions cachee la respuesta del PUT sin un GET extra.
  setModulosPorRol(rolId: string, modulos: ModuloResponse[]): void {
    this._modulosPorRol.update((m) => {
      const next = new Map(m);
      next.set(rolId, modulos);
      return next;
    });
  }

  getModulosPorRol(rolId: string): ModuloResponse[] {
    return this._modulosPorRol().get(rolId) ?? [];
  }

  reset(): void {
    this._roles.set([]);
    this._modulos.set([]);
    this._modulosPorRol.set(new Map());
  }

  // --- privados ---

  private readonly _modulosPorRol = signal<Map<string, ModuloResponse[]>>(
    new Map(),
  );
}
