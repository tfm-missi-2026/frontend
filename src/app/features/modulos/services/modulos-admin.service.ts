import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

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

@Injectable({ providedIn: "root" })
export class ModulosAdminService {
  private readonly api = inject(ModulosAdminApiService);
  private readonly lookups = inject(LookupsService);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _page = signal<PageData<ModuloResponse> | null>(null);
  private readonly _query = signal<ModuloQueryParams>(
    new ModuloQueryParams({ pageSize: 20 }),
  );

  readonly page = this._page.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly query = this._query.asReadonly();
  readonly count = computed(() => this._page()?.total ?? 0);

  async load(query?: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string | null;
    sortDir?: "asc" | "desc";
    seccion?: string | null;
    estado?: 0 | 1 | null;
  }): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    if (query) {
      const current = this._query();
      this._query.set(
        new ModuloQueryParams({
          page: query.page ?? current.page,
          pageSize: query.pageSize ?? current.pageSize,
          search: query.search ?? current.search,
          sortBy: query.sortBy ?? current.sortBy,
          sortDir: query.sortDir ?? current.sortDir,
          seccion: query.seccion ?? current.seccion,
          estado: query.estado ?? current.estado,
        }),
      );
    }
    try {
      const p = await safeFirstValueFrom(
        this.api.list(this._query()),
        (msg) => this._error.set(msg),
      );
      this._page.set(p);
    } finally {
      this._loading.set(false);
    }
  }

  updateQuery(query: ModuloQueryParams): void {
    this._query.set(query);
  }

  async create(data: ModuloCrearRequest): Promise<ModuloResponse | null> {
    const creado = await safeFirstValueFrom(
      this.api.create(data),
      (msg) => this._error.set(msg),
    );
    if (creado) {
      this.lookups.setModulo(creado);
      return creado;
    }
    return null;
  }

  async update(
    id: string,
    data: ModuloActualizarRequest,
  ): Promise<ModuloResponse | null> {
    const actualizado = await safeFirstValueFrom(
      this.api.update(id, data),
      (msg) => this._error.set(msg),
    );
    if (actualizado) {
      this.lookups.setModulo(actualizado);
      return actualizado;
    }
    return null;
  }

  async changeState(
    id: string,
    body: ModuloEstadoRequest,
  ): Promise<ModuloResponse | null> {
    const actualizado = await safeFirstValueFrom(
      this.api.changeState(id, body),
      (msg) => this._error.set(msg),
    );
    if (actualizado) {
      this.lookups.setModulo(actualizado);
      return actualizado;
    }
    return null;
  }

  reset(): void {
    this._page.set(null);
    this._error.set(null);
  }
}