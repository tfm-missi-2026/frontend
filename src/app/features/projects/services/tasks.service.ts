import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import { CatalogService } from "@features/catalog/services/catalog.service";

import type { TareaApi } from "../models/project-api";
import type { Task } from "../models/task";
import type { TaskFormData } from "../models/task-form";
import {
  buildCatalogLookup,
  TASK_SITUATION_FALLBACK,
  tareaApiToTask,
  taskFormDataToActualizarApi,
  taskFormDataToCrearApi,
} from "./project.mapper";
import { TareasApiService } from "./tasks-api.service";
import { extractProblemMessage } from "@utils/problem-detail";

const PENDIENTE_BACKEND = "Pendiente";

@Injectable({ providedIn: "root" })
export class TasksService {
  private readonly api = inject(TareasApiService);
  private readonly catalogService = inject(CatalogService);

  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._tasks().length);

  private readonly catalogLookup = computed(() =>
    buildCatalogLookup(this.catalogService.items()),
  );

  private async ensureCatalog(): Promise<void> {
    if (this.catalogService.count() === 0) {
      await this.catalogService.cargar();
    }
  }

  private findCatalogIdByOpcion(
    grupoBackend: string,
    opcion: string,
  ): string | null {
    const GRUPO_UI_TO_BACKEND: Record<string, string> = {
      TACT: "TIPO_ACTIVIDAD",
      MOD: "MODALIDAD",
      TVAR: "TIPO_VARIACION",
      SVAR: "SITUACION_VARIACION",
      TSUB: "TIPO_SUBPROYECTO",
      PRIO: "PRIORIDAD",
      SIT: "SITUACION",
    };
    const items = this.catalogService.items();
    for (const code of Object.keys(GRUPO_UI_TO_BACKEND)) {
      if (GRUPO_UI_TO_BACKEND[code] !== grupoBackend) continue;
      const match = items.find(
        (i) => i.groupCode === code && i.name === opcion,
      );
      return match?.id ?? null;
    }
    return null;
  }

  async cargar(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await this.ensureCatalog();
      const data = await firstValueFrom(this.api.listar());
      const lookup = this.catalogLookup();
      const mapped = data.map((api) => tareaApiToTask(api, lookup));
      this._tasks.set(mapped);
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  async cargarPorSubproyecto(subproyectoId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await this.ensureCatalog();
      const data = await firstValueFrom(
        this.api.listarPorSubproyecto(subproyectoId),
      );
      const lookup = this.catalogLookup();
      const mapped = data.map((api) => tareaApiToTask(api, lookup));
      this._tasks.update((arr) => {
        const others = arr.filter((t) => t.subprojectId !== subproyectoId);
        return [...mapped, ...others];
      });
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  getBySubproject(subprojectId: string): Task[] {
    return this._tasks().filter(
      (t) => t.subprojectId === subprojectId && t.active,
    );
  }

  getById(id: string): Task | undefined {
    return this._tasks().find((t) => t.id === id);
  }

  async create(
    subprojectId: string,
    data: TaskFormData,
  ): Promise<Task | null> {
    try {
      await this.ensureCatalog();
      const situacionId =
        this.findCatalogIdByOpcion("SITUACION", PENDIENTE_BACKEND) ?? "";
      if (!situacionId) {
        this._error.set("No se encontró la situación 'Pendiente' en el catálogo.");
        return null;
      }
      if (
        !data.name.trim() ||
        !data.startDate ||
        !data.endDate ||
        !data.estimatedHours
      ) {
        this._error.set("Faltan datos requeridos (nombre, fechas u horas).");
        return null;
      }
      const creado = await firstValueFrom(
        this.api.crear(taskFormDataToCrearApi(subprojectId, situacionId, data)),
      );
      const task = tareaApiToTask(creado, this.catalogLookup());
      this._tasks.update((arr) => [task, ...arr]);
      return task;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async update(
    subprojectId: string,
    id: string,
    data: TaskFormData,
  ): Promise<Task | null> {
    try {
      await this.ensureCatalog();
      const current = this.getById(id);
      const currentSituacion = current?.situation ?? TASK_SITUATION_FALLBACK;
      const situacionId =
        this.findCatalogIdByOpcion("SITUACION", currentSituacion) ?? "";
      if (!situacionId) {
        this._error.set("No se encontró la situación actual en el catálogo.");
        return null;
      }
      const actualizado = await firstValueFrom(
        this.api.actualizar(
          id,
          taskFormDataToActualizarApi(
            situacionId,
            current?.origin === "var" ? "PENDIENTE" : null,
            data,
          ),
        ),
      );
      const task = tareaApiToTask(actualizado, this.catalogLookup());
      this._tasks.update((arr) =>
        arr.map((t) => (t.id === id ? task : t)),
      );
      return task;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async deactivate(
    subprojectId: string,
    id: string,
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.api.eliminar(id, "Baja desde panel de proyectos"),
      );
      this._tasks.update((arr) =>
        arr.map((t) => (t.id === id ? { ...t, active: false } : t)),
      );
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

}
