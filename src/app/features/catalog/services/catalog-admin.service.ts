import { Injectable, inject, signal } from "@angular/core";

import { CatalogoQueryParams } from "@core/query-params";
import { type PageData } from "@core/models";
import { cloneQuery } from "@shared/ui/table";
import { safeFirstValueFrom } from "@utils/safe-async";

import type {
  CatalogGroupCode,
  CatalogItem,
  CatalogItemFormData,
} from "../models/catalog-item";
import { CatalogApiService } from "./catalog-api.service";
import {
  catalogoApiToItem,
  formDataToCrearApi,
  grupoUiToBackend,
} from "./catalog.mapper";
import { CatalogService } from "./catalog.service";

@Injectable({ providedIn: "root" })
export class CatalogoAdminService {
  private readonly api = inject(CatalogApiService);
  private readonly catalog = inject(CatalogService);

  readonly query = signal<CatalogoQueryParams>(
    new CatalogoQueryParams({ pageSize: 10 }),
  );
  private readonly _error = signal<string | null>(null);

  readonly error = this._error.asReadonly();

  async fetchData(q: CatalogoQueryParams): Promise<PageData<CatalogItem>> {
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
    const items = raw.items
      .map(catalogoApiToItem)
      .filter((x): x is CatalogItem => x !== null);
    return {
      items,
      total: raw.total,
      page: raw.page,
      pageSize: raw.pageSize,
      totalPages: raw.totalPages,
    };
  }

  filterByGrupo(grupo: CatalogGroupCode | null): void {
    this.query.update((q) => {
      const next = cloneQuery(q);
      next.grupo = grupo ? grupoUiToBackend(grupo) : null;
      next.page = 1;
      return next;
    });
  }

  filterByEstado(estado: 0 | 1 | null): void {
    this.query.update((q) => {
      const next = cloneQuery(q);
      next.estado = estado;
      next.page = 1;
      return next;
    });
  }

  async create(data: CatalogItemFormData): Promise<CatalogItem | null> {
    const creado = await safeFirstValueFrom(
      this.api.crear(formDataToCrearApi(data)),
      (msg) => this._error.set(msg),
    );
    if (!creado) return null;
    const item = catalogoApiToItem(creado);
    if (!item) {
      this._error.set(`Grupo desconocido: ${creado.grupo}`);
      return null;
    }
    await this.catalog.cargar();
    this.query.update((q) => q.bumpRefresh());
    return item;
  }

  async update(
    id: string,
    data: CatalogItemFormData,
  ): Promise<CatalogItem | null> {
    const actualizado = await safeFirstValueFrom(
      this.api.actualizar(id, formDataToCrearApi(data)),
      (msg) => this._error.set(msg),
    );
    if (!actualizado) return null;
    const item = catalogoApiToItem(actualizado);
    if (!item) {
      this._error.set(`Grupo desconocido: ${actualizado.grupo}`);
      return null;
    }
    await this.catalog.cargar();
    this.query.update((q) => q.bumpRefresh());
    return item;
  }

  async deactivate(id: string): Promise<boolean> {
    const result = await safeFirstValueFrom(
      this.api.eliminar(id, { motivoEliminacion: "Baja desde panel de administracion" }),
      (msg) => this._error.set(msg),
    );
    if (result === null) return false;
    await this.catalog.cargar();
    this.query.update((q) => q.bumpRefresh());
    return true;
  }

  reset(): void {
    this.query.update((q) => q.reset());
    this._error.set(null);
  }
}
