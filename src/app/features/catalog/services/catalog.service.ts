import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import type {
  CatalogGroupCode,
  CatalogItem,
  CatalogItemFormData,
} from "../models/catalog-item";
import { CatalogApiService } from "./catalog-api.service";
import {
  catalogoApiToItem,
  formDataToCrearApi,
} from "./catalog.mapper";
import { extractProblemMessage } from "@utils/problem-detail";
import { sortBy } from "@utils/collections";

// Los datos vienen del backend via CatalogApiService. Los items
// desconocidos para el mapper (grupo no mapeado) se descartan en
// silencio.
@Injectable({ providedIn: "root" })
export class CatalogService {
  private readonly api = inject(CatalogApiService);

  private readonly _items = signal<CatalogItem[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._items().length);

  async cargar(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(this.api.listar());
      const items = data
        .map(catalogoApiToItem)
        .filter((x): x is CatalogItem => x !== null);
      this._items.set(items);
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  byGroup(code: CatalogGroupCode): CatalogItem[] {
    return sortBy(
      this._items().filter((i) => i.groupCode === code),
      (i) => i.order,
    );
  }

  async create(data: CatalogItemFormData): Promise<CatalogItem | null> {
    try {
      const creado = await firstValueFrom(
        this.api.crear(formDataToCrearApi(data)),
      );
      const item = catalogoApiToItem(creado);
      if (!item) {
        this._error.set(`Grupo desconocido: ${creado.grupo}`);
        return null;
      }
      this._items.update((arr) => [item, ...arr]);
      return item;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async update(
    id: string,
    data: CatalogItemFormData,
  ): Promise<CatalogItem | null> {
    try {
      const actualizado = await firstValueFrom(
        this.api.actualizar(id, formDataToCrearApi(data)),
      );
      const item = catalogoApiToItem(actualizado);
      if (!item) {
        this._error.set(`Grupo desconocido: ${actualizado.grupo}`);
        return null;
      }
      this._items.update((arr) =>
        arr.map((i) => (i.id === id ? item : i)),
      );
      return item;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async deactivate(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.api.eliminar(id));
      this._items.update((arr) =>
        arr.map((i) => (i.id === id ? { ...i, status: "Inactivo" } : i)),
      );
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

}
