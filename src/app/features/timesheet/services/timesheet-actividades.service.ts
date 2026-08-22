import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import type { ActividadApi, ActividadCrearApi } from "../models/timesheet-actividad-api";
import { ActividadesApiService } from "./timesheet-actividad-api.service";
import { extractProblemMessage } from "@utils/problem-detail";

// Servicio base de actividades (ms-seguimiento /api/actividades).
// Por ahora expone cargar() + signals basicos para que el timesheet pueda
// resolver titulos de actividades al mostrar entradas kind="activity".
// El flujo completo (crear actividad desde form + asignarla a bitacora)
// queda como siguiente iteracion.
@Injectable({ providedIn: "root" })
export class ActividadesService {
  private readonly api = inject(ActividadesApiService);

  private readonly _items = signal<ActividadApi[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._items().length);

  async cargar(): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(this.api.listar());
      this._items.set(data);
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  buscarPorId(id: string): ActividadApi | undefined {
    return this._items().find((a) => a.id === id);
  }

  async crear(body: ActividadCrearApi): Promise<ActividadApi | null> {
    try {
      const creada = await firstValueFrom(this.api.crear(body));
      this._items.update((arr) => [creada, ...arr]);
      return creada;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async eliminar(id: string, motivo: string): Promise<boolean> {
    try {
      await firstValueFrom(this.api.eliminar(id, motivo));
      this._items.update((arr) => arr.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

}
