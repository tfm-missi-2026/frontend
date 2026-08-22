import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { LookupsService } from "@core/lookups/lookups.service";
import { ModulosService } from "@core/modulos/modulos.service";
import { RolQueryParams } from "@core/query-params";
import { type PageData } from "@core/models";
import { safeFirstValueFrom } from "@utils/safe-async";

import type { Role, RoleFormData } from "../models/role";
import type { ModuloResponse } from "@core/modulos/modulo.models";
import type { RolApi } from "../models/role-api";
import { RolesApiService } from "./roles-api.service";

@Injectable({ providedIn: "root" })
export class RolesService {
  private readonly api = inject(RolesApiService);
  private readonly lookups = inject(LookupsService);
  private readonly modulos = inject(ModulosService);

  private readonly _roles = signal<Role[]>([]);
  private readonly _modulosRaiz = signal<ModuloResponse[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _page = signal<PageData<RolApi> | null>(null);
  private readonly _query = signal<RolQueryParams>(
    new RolQueryParams({ pageSize: 20 }),
  );

  readonly roles = this._roles.asReadonly();
  readonly modulosRaiz = this._modulosRaiz.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly page = this._page.asReadonly();
  readonly query = this._query.asReadonly();
  readonly count = computed(() => this._roles().length);

  async load(): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      await Promise.all([
        this.lookups.loadRoles(),
        this.lookups.loadModules(),
      ]);
      const roles = this.lookups.roles();
      this._roles.set(
        roles.map((r) => ({
          id: r.id,
          code: r.codigo,
          name: r.nombre,
          description: r.descripcion ?? "",
          sistema: r.sistema === true,
          paginaInicioId: r.paginaInicioId ?? null,
          paginaInicioCodigo: r.paginaInicioCodigo ?? null,
          users: 0,
          permissions: [],
        })),
      );
      this._modulosRaiz.set(
        this.lookups
          .modulos()
          .filter((m) => m.tipo !== "SECTION" && m.estado === 1)
          .slice()
          .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this._error.set(msg);
    } finally {
      this._loading.set(false);
    }
  }

  async loadPage(query?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string | null;
    sortDir?: "asc" | "desc";
    sistema?: boolean | null;
    estado?: number | null;
  }): Promise<void> {
    if (query) {
      const current = this._query();
      this._query.set(
        new RolQueryParams({
          page: query.page ?? current.page,
          pageSize: query.pageSize ?? current.pageSize,
          search: query.search ?? current.search,
          sortBy: query.sortBy ?? current.sortBy,
          sortDir: query.sortDir ?? current.sortDir,
          sistema: query.sistema ?? current.sistema,
          estado: query.estado ?? current.estado,
        }),
      );
    }
    const p = await safeFirstValueFrom(
      this.api.list(this._query()),
      (msg) => this._error.set(msg),
    );
    this._page.set(p);
  }

  updateQuery(query: RolQueryParams): void {
    this._query.set(query);
  }

  async loadPermissionsForRole(rolId: string): Promise<string[]> {
    if (this.lookups.getModulosPorRol(rolId).length > 0) {
      const codigos = this.getPermissionsForRole(rolId);
      this.syncRolePermissions(rolId, codigos);
      return codigos;
    }
    try {
      const modulos = await this.lookups.loadModulesForRole(rolId);
      const codigos = modulos
        .filter((m) => m.tipo !== "SECTION")
        .map((m) => m.codigo);
      this.syncRolePermissions(rolId, codigos);
      return codigos;
    } catch {
      this._error.set("Error al cargar permisos del rol");
      return [];
    }
  }

  private syncRolePermissions(rolId: string, codigos: string[]): void {
    this._roles.update((arr) =>
      arr.map((r) => (r.id === rolId ? { ...r, permissions: codigos } : r)),
    );
  }

  async create(data: RoleFormData): Promise<Role | null> {
    const creado = await safeFirstValueFrom(
      this.api.create({
        codigo: data.code.trim().toUpperCase(),
        nombre: data.name.trim(),
        descripcion: data.description.trim(),
        paginaInicioId: data.paginaInicioId,
      }),
      (msg) => this._error.set(msg),
    );
    if (creado) {
      const role: Role = {
        id: creado.id,
        code: creado.codigo,
        name: creado.nombre,
        description: creado.descripcion ?? "",
        sistema: creado.sistema === true,
        paginaInicioId: creado.paginaInicioId ?? null,
        paginaInicioCodigo: creado.paginaInicioCodigo ?? null,
        users: 0,
        permissions: [],
      };
      this._roles.update((arr) => [role, ...arr]);
      return role;
    }
    return null;
  }

  async update(
    rolId: string,
    payload: { nombre: string; descripcion: string; paginaInicioId: string },
  ): Promise<Role | null> {
    const actualizado = await safeFirstValueFrom(
      this.api.update(rolId, {
        nombre: payload.nombre.trim(),
        descripcion: payload.descripcion.trim(),
        paginaInicioId: payload.paginaInicioId,
      }),
      (msg) => this._error.set(msg),
    );
    if (actualizado) {
      const role: Role = {
        id: actualizado.id,
        code: actualizado.codigo,
        name: actualizado.nombre,
        description: actualizado.descripcion ?? "",
        sistema: actualizado.sistema === true,
        paginaInicioId: actualizado.paginaInicioId ?? null,
        paginaInicioCodigo: actualizado.paginaInicioCodigo ?? null,
        users: 0,
        permissions: [],
      };
      this._roles.update((arr) => arr.map((r) => (r.id === rolId ? role : r)));
      return role;
    }
    return null;
  }

  async delete(rolId: string, motivoEliminacion: string): Promise<boolean> {
    const ok = await safeFirstValueFrom(
      this.api.delete(rolId, { motivoEliminacion }),
      (msg) => this._error.set(msg),
    );
    if (ok) {
      this._roles.update((arr) => arr.filter((r) => r.id !== rolId));
      this.lookups.invalidarModulosPorRol(rolId);
      return true;
    }
    return false;
  }

  async updatePermissions(rolId: string, codigos: string[]): Promise<boolean> {
    const modulos = this.lookups.modulos();
    const moduloIds = codigos
      .map((codigo) => modulos.find((m) => m.codigo === codigo)?.id)
      .filter((x): x is string => Boolean(x));
    const respuesta = await safeFirstValueFrom(
      this.api.replaceModules(rolId, moduloIds),
      (msg) => this._error.set(msg),
    );
    if (respuesta) {
      this.lookups.setModulosPorRol(rolId, respuesta);
      if (this.lookups.getRolActivo() === rolId) {
        this.modulos.invalidar(rolId);
      }
      return true;
    }
    return false;
  }

  getPermissionsForRole(rolId: string): string[] {
    return this.lookups
      .getModulosPorRol(rolId)
      .filter((m) => m.tipo !== "SECTION")
      .map((m) => m.codigo);
  }

  reset(): void {
    this._roles.set([]);
    this._modulosRaiz.set([]);
    this._page.set(null);
    this._error.set(null);
  }
}