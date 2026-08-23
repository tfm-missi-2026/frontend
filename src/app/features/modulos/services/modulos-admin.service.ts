import { Injectable, inject, signal } from "@angular/core";

import { LookupsService } from "@core/lookups/lookups.service";
import { ModuloQueryParams } from "@core/query-params";
import { type PageData } from "@core/models";
import { safeFirstValueFrom } from "@utils/safe-async";

import type { ModuloResponse } from "@core/modulos/modulo.models";

import type {
  ModuloActualizarRequest,
  ModuloCrearRequest,
  ModuloEstadoRequest,
} from "./modulos-admin-api.service";
import { ModulosAdminApiService } from "./modulos-admin-api.service";

/**
 * Servicio de administracion de modulos con paginacion server-side.
 *
 * Sigue el mismo patron que {@link UsersAdminService}:
 *  - `query` (signal publico): fuente unica de verdad para UI.
 *  - `fetchData(q)`: funcion consumida por el UiTable.
 *  - `filterBySeccion` / `filterByEstado`: helpers para filtros de
 *    dominio.
 *  - Mutaciones (create/update/changeState): bumpRefresh al final.
 */
@Injectable({ providedIn: "root" })
export class ModulosAdminService {
  private readonly api = inject(ModulosAdminApiService);
  private readonly lookups = inject(LookupsService);

  readonly query = signal<ModuloQueryParams>(
    new ModuloQueryParams({ pageSize: 20 }),
  );
  private readonly _error = signal<string | null>(null);

  readonly error = this._error.asReadonly();

  /**
   * Funcion consumida por el UiTable como `[fetchData]`.
   */
  async fetchData(q: ModuloQueryParams): Promise<PageData<ModuloResponse>> {
    if (this._error()) this._error.set(null);
    const p = await safeFirstValueFrom(
      this.api.list(q),
      (msg) => this._error.set(msg),
    );
    if (!p) {
      return {
        items: [],
        total: 0,
        page: q.page,
        pageSize: q.pageSize,
        totalPages: 0,
      };
    }
    return p;
  }

  filterBySeccion(seccion: string | null): void {
    this.query.update((q) => {
      q.seccion = seccion && seccion !== "" ? seccion : null;
      q.page = 1;
      return q;
    });
  }

  filterByEstado(estado: 0 | 1 | null): void {
    this.query.update((q) => {
      q.estado = estado;
      q.page = 1;
      return q;
    });
  }

  async create(data: ModuloCrearRequest): Promise<ModuloResponse | null> {
    const creado = await safeFirstValueFrom(
      this.api.create(data),
      (msg) => this._error.set(msg),
    );
    if (!creado) return null;
    this.lookups.setModulo(creado);
    this.query.update((q) => q.bumpRefresh());
    return creado;
  }

  async update(
    id: string,
    data: ModuloActualizarRequest,
  ): Promise<ModuloResponse | null> {
    const actualizado = await safeFirstValueFrom(
      this.api.update(id, data),
      (msg) => this._error.set(msg),
    );
    if (!actualizado) return null;
    this.lookups.setModulo(actualizado);
    this.query.update((q) => q.bumpRefresh());
    return actualizado;
  }

  async changeState(
    id: string,
    body: ModuloEstadoRequest,
  ): Promise<ModuloResponse | null> {
    const actualizado = await safeFirstValueFrom(
      this.api.changeState(id, body),
      (msg) => this._error.set(msg),
    );
    if (!actualizado) return null;
    this.lookups.setModulo(actualizado);
    this.query.update((q) => q.bumpRefresh());
    return actualizado;
  }

  reset(): void {
    this.query.update((q) => q.reset());
    this._error.set(null);
  }
}
