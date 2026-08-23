import { Injectable, inject, signal } from "@angular/core";

import { LookupsService } from "@core/lookups/lookups.service";
import { UsuarioQueryParams } from "@core/query-params";
import { type PageData } from "@core/models";
import { safeFirstValueFrom } from "@utils/safe-async";

import type { UsuarioApi } from "../models/user-api";
import type { User } from "../models/user";
import type { UserFormData } from "../models/user-form";
import {
  buildRolLookup,
  resolveRolId,
  rolUiToBackend,
  statusToEstado,
  usuarioApiToUser,
} from "./users.mapper";
import { UsersApiService } from "./users-api.service";

export interface CreateUserInput {
  data: UserFormData;
  initialPassword: string;
}

export interface UpdateUserInput {
  data: Omit<UserFormData, "initialPassword">;
}

export interface FilterByRolInput {
  rol: import("../models/user").UserRole | null;
}

export interface FilterByEstadoInput {
  estado: import("../models/user").UserStatus | null;
}

/**
 * Servicio de administracion de usuarios con paginacion server-side.
 *
 * Sigue el patron `{@link ModulosAdminService}`:
 *  - `query` (signal publico): fuente unica de verdad para UI.
 *  - `fetchData(q)`: funcion consumida por el UiTable.
 *  - `filterByRol` / `filterByEstado`: helpers para filtros de dominio
 *    que mutan `query` sin tocar el resto.
 *  - Mutaciones (create/update/deactivate): bumpRefresh al final
 *    para forzar refetch sin alterar filtros visibles.
 *
 * El `UsersService` legacy (carga todos los usuarios en memoria) sigue
 * siendo usado por features que necesitan una lista completa:
 * `area-dashboard`, `planning`, `projects`, `team-load`,
 * `resource-dashboard`, `variations`.
 */
@Injectable({ providedIn: "root" })
export class UsersAdminService {
  private readonly api = inject(UsersApiService);
  private readonly lookups = inject(LookupsService);

  readonly query = signal<UsuarioQueryParams>(
    new UsuarioQueryParams({ pageSize: 10 }),
  );
  private readonly _error = signal<string | null>(null);

  /** Errores fatales para mostrar fuera del UiTable (UiAlert). */
  readonly error = this._error.asReadonly();

  /**
   * Funcion consumida por el UiTable como `[fetchData]`.
   * El UiTable la invoca cada vez que `query()` cambia (incluyendo
   * cuando una mutacion hace `bumpRefresh()`).
   */
  async fetchData(q: UsuarioQueryParams): Promise<PageData<User>> {
    if (this._error()) this._error.set(null);
    const raw = await safeFirstValueFrom(
      this.api.list(q),
      (msg) => this._error.set(msg),
    );
    if (!raw) {
      return {
        items: [],
        total: 0,
        page: q.page,
        pageSize: q.pageSize,
        totalPages: 0,
      };
    }
    return {
      items: raw.items.map(usuarioApiToUser),
      total: raw.total,
      page: raw.page,
      pageSize: raw.pageSize,
      totalPages: raw.totalPages,
    };
  }

  filterByRol(input: FilterByRolInput): void {
    this.query.update((q) => {
      q.rolCodigo = input.rol ? rolUiToBackend(input.rol) : null;
      q.page = 1;
      return q;
    });
  }

  filterByEstado(input: FilterByEstadoInput): void {
    this.query.update((q) => {
      q.estado = input.estado ? statusToEstado(input.estado) : null;
      q.page = 1;
      return q;
    });
  }

  async crear(input: CreateUserInput): Promise<User | null> {
    const lookup = buildRolLookup(this.lookups.roles());
    const rolId = resolveRolId(lookup, input.data.role);
    if (!rolId) {
      this._error.set(`No se encontro el rol ${input.data.role} en el catalogo.`);
      return null;
    }
    const creado = await safeFirstValueFrom(
      this.api.crear({
        email: input.data.email.trim(),
        contrasenia: input.initialPassword,
        nombres: input.data.firstName.trim(),
        apellidoPaterno: input.data.lastNamePaternal.trim(),
        apellidoMaterno: input.data.lastNameMaternal.trim(),
        rolId,
      }),
      (msg) => this._error.set(msg),
    );
    if (!creado) return null;
    this.query.update((q) => q.bumpRefresh());
    return usuarioApiToUser(creado as UsuarioApi);
  }

  async actualizar(id: string, input: UpdateUserInput): Promise<User | null> {
    const lookup = buildRolLookup(this.lookups.roles());
    const rolId = resolveRolId(lookup, input.data.role);
    if (!rolId) {
      this._error.set(`No se encontro el rol ${input.data.role} en el catalogo.`);
      return null;
    }
    const actualizado = await safeFirstValueFrom(
      this.api.actualizar(id, {
        email: input.data.email.trim(),
        nombres: input.data.firstName.trim(),
        apellidoPaterno: input.data.lastNamePaternal.trim(),
        apellidoMaterno: input.data.lastNameMaternal.trim(),
        rolId,
      }),
      (msg) => this._error.set(msg),
    );
    if (!actualizado) return null;
    this.query.update((q) => q.bumpRefresh());
    return usuarioApiToUser(actualizado as UsuarioApi);
  }

  async desactivar(
    id: string,
    motivo = "Baja desde panel de administracion",
  ): Promise<boolean> {
    const result = await safeFirstValueFrom(
      this.api.eliminar(id, { motivoEliminacion: motivo }),
      (msg) => this._error.set(msg),
    );
    if (result === null) return false;
    this.query.update((q) => q.bumpRefresh());
    return true;
  }

  async resetPassword(id: string, contraseniaPlano: string): Promise<boolean> {
    const result = await safeFirstValueFrom(
      this.api.resetPassword(id, { contrasenia: contraseniaPlano }),
      (msg) => this._error.set(msg),
    );
    return result !== null;
  }

  reset(): void {
    this.query.update((q) => q.reset());
    this._error.set(null);
  }
}
