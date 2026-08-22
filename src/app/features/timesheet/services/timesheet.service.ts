import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import { todayIso } from "@utils/date";

import type { BitacoraApi } from "../models/timesheet-api";
import type { ActividadApi } from "../models/timesheet-actividad-api";
import type { TimesheetEntry } from "../models/timesheet-entry";
import {
  bitacoraApiToEntry,
  entryToBitacoraCrearApi,
} from "./timesheet.mapper";
import { ActividadesService } from "./timesheet-actividades.service";
import { TimesheetApiService } from "./timesheet-api.service";
import { extractProblemMessage } from "@utils/problem-detail";
import { compareKeys } from "@utils/collections";

// Datos desde el backend via TimesheetApiService. Mantiene la misma
// interfaz publica (entries signal + helpers + create/update/remove).
//
// Para kind="activity", el campo `activity` del UI guarda el titulo
// de la actividad (resuelto via ActividadesService -> map lookup).
// El backend requiere UUID; si el caller no lo resuelve, el create
// falla con VALIDACION_FALLIDA.
@Injectable({ providedIn: "root" })
export class TimesheetService {
  private readonly api = inject(TimesheetApiService);
  private readonly actividadesService = inject(ActividadesService);

  private readonly _entries = signal<TimesheetEntry[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly entries = this._entries.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._entries().length);

  private readonly actividadesById = computed(() => {
    const map = new Map<string, ActividadApi>();
    for (const a of this.actividadesService.items()) {
      map.set(a.id, a);
    }
    return map;
  });

  private async ensureActividades(): Promise<void> {
    if (this.actividadesService.count() === 0) {
      await this.actividadesService.cargar();
    }
  }

  private async mapEntries(data: BitacoraApi[]): Promise<TimesheetEntry[]> {
    await this.ensureActividades();
    return data.map((api) => bitacoraApiToEntry(api, this.actividadesById()));
  }

  async cargar(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(
        this.api.miaRango("1970-01-01", "2099-12-31"),
      );
      this._entries.set(await this.mapEntries(data));
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  async cargarRango(desde: string, hasta: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(this.api.miaRango(desde, hasta));
      this._entries.set(await this.mapEntries(data));
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  async cargarDia(fecha: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(this.api.mia(fecha));
      this._entries.set(await this.mapEntries(data));
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  totalHoursForDate(date: string): number {
    return this._entries()
      .filter((e) => e.date === date)
      .reduce((acc, e) => acc + e.hours, 0);
  }

  totalHoursInRange(from: string, toIso: string): number {
    return this._entries()
      .filter((e) => e.date >= from && e.date <= toIso)
      .reduce((acc, e) => acc + e.hours, 0);
  }

  countForDate(date: string): number {
    return this._entries().filter((e) => e.date === date).length;
  }

  entriesForResourceInRange(
    resourceId: string,
    fromIso: string,
    toIso: string,
  ): TimesheetEntry[] {
    return this._entries().filter(
      (e) =>
        e.resourceId === resourceId && e.date >= fromIso && e.date <= toIso,
    );
  }

  entriesForResourceOnDate(
    resourceId: string,
    date: string,
  ): TimesheetEntry[] {
    return this._entries()
      .filter((e) => e.resourceId === resourceId && e.date === date)
      .sort((a, b) => compareKeys(a.startTime, b.startTime));
  }

  totalHoursForResourceInRange(
    resourceId: string,
    fromIso: string,
    toIso: string,
  ): number {
    return this.entriesForResourceInRange(resourceId, fromIso, toIso).reduce(
      (acc, e) => acc + e.hours,
      0,
    );
  }

  async create(data: Omit<TimesheetEntry, "id">): Promise<TimesheetEntry | null> {
    try {
      const creado = await firstValueFrom(
        this.api.crear(entryToBitacoraCrearApi(data)),
      );
      const entry = bitacoraApiToEntry(creado, this.actividadesById());
      this._entries.update((arr) => [entry, ...arr]);
      return entry;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async update(
    id: string,
    patch: Partial<Omit<TimesheetEntry, "id">>,
  ): Promise<TimesheetEntry | null> {
    const actual = this._entries().find((e) => e.id === id);
    if (!actual) return null;
    const merged: Omit<TimesheetEntry, "id"> = { ...actual, ...patch };
    try {
      const actualizado = await firstValueFrom(
        this.api.actualizar(id, entryToBitacoraCrearApi(merged)),
      );
      const entry = bitacoraApiToEntry(actualizado, this.actividadesById());
      this._entries.update((arr) =>
        arr.map((e) => (e.id === id ? entry : e)),
      );
      return entry;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.api.eliminar(id, "Baja desde panel de bitacora"),
      );
      this._entries.update((arr) => arr.filter((e) => e.id !== id));
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

}

// Fecha inicial del toolbar de bitacora (hoy, en formato ISO).
export const TIMESHEET_INITIAL_DATE = todayIso();
