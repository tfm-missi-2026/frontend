import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import { CatalogService } from "@features/catalog/services/catalog.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { UsersService } from "@features/users/services/users.service";
import { buildCatalogLookup } from "@features/projects/services/project.mapper";

import type { Variation, VariationStatus } from "../models/variation";
import type {
  ResolveVariationPayload,
  VariationFormData,
} from "../models/variation-form";
import type { VariacionApi } from "../models/variation-api";
import {
  formDataToCrearApi,
  resolverPayloadToApi,
  variacionApiToVariation,
} from "./variations.mapper";
import { VariationsApiService } from "./variations-api.service";
import { extractProblemMessage } from "@utils/problem-detail";

// Datos del backend via VariationsApiService.
//
// Limitaciones:
// - reportedBy / resueltoPor: backend guarda UUID; el FE los muestra
//   como string hasta que se migre la resolucion de usuarios.
// - target.subprojectId: backend solo guarda tareaId; cuando la variacion
//   es a nivel subproyecto, queda como null en backend (no soportado aun).
@Injectable({ providedIn: "root" })
export class VariationsService {
  private readonly api = inject(VariationsApiService);
  private readonly catalogService = inject(CatalogService);
  private readonly tasksService = inject(TasksService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly usersService = inject(UsersService);

  private readonly _items = signal<Variation[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._items().length);

  readonly countByStatus = computed<Record<VariationStatus, number>>(() => {
    const out: Record<VariationStatus, number> = {
      Pendiente: 0,
      Aprobada: 0,
      Rechazada: 0,
    };
    for (const v of this._items()) {
      out[v.status]++;
    }
    return out;
  });

  // Lookup en tiempo real: se recalcula cuando cambian catalog/tasks/subs/users.
  private readonly context = computed(() => {
    const subs = this.subprojectsService.subs();
    const projectIdBySubprojectId = new Map<string, string>();
    const subprojectIdByTaskId = new Map<string, string>();
    for (const s of subs) {
      projectIdBySubprojectId.set(s.id, s.projectId);
    }
    const tasks = this.tasksService.tasks();
    const taskLabelByTaskId = new Map<string, string>();
    const taskRefByTaskId = new Map<string, string>();
    for (const t of tasks) {
      taskLabelByTaskId.set(t.id, t.name);
      taskRefByTaskId.set(t.id, t.subprojectId);
      subprojectIdByTaskId.set(t.id, t.subprojectId);
    }
    // userId -> "Nombre ApellidoP ApellidoM" para resolver UUIDs.
    const userNameById = new Map<string, string>();
    for (const u of this.usersService.users()) {
      const full = `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`.trim();
      userNameById.set(u.id, full || u.email);
    }
    return {
      catalog: buildCatalogLookup(this.catalogService.items()),
      taskLabelByTaskId,
      taskRefByTaskId,
      subprojectIdByTaskId,
      projectIdBySubprojectId,
      userNameById,
    };
  });

  async cargar(): Promise<void> {
    if (this._loading()) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      if (this.catalogService.count() === 0) {
        await this.catalogService.cargar();
      }
      if (this.tasksService.count() === 0) {
        await this.tasksService.cargar();
      }
      if (this.subprojectsService.count() === 0) {
        await this.subprojectsService.cargar();
      }
      if (this.usersService.count() === 0) {
        await this.usersService.cargar();
      }
      const data = await firstValueFrom(this.api.listar());
      this._items.set(data.map((v) => variacionApiToVariation(v, this.context())));
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  getById(id: string): Variation | undefined {
    return this._items().find((v) => v.id === id);
  }

  getByProject(projectId: string): Variation[] {
    return this._items().filter((v) => v.projectId === projectId);
  }

  getBySubproject(subprojectId: string): Variation[] {
    return this._items().filter(
      (v) =>
        v.target?.kind === "subproject" &&
        v.target.subprojectId === subprojectId,
    );
  }

  getByTask(taskId: string): Variation[] {
    return this._items().filter(
      (v) => v.target?.kind === "task" && v.target.taskId === taskId,
    );
  }

  async create(
    reportedById: string,
    data: VariationFormData,
  ): Promise<Variation | null> {
    try {
      const catalog = buildCatalogLookup(this.catalogService.items());
      const tipoId =
        catalog.byId.get(`__type__:${data.type}`) ??
        this.findCatalogIdByName("TIPO_VARIACION", data.type) ??
        "";
      // Para "reportar" asumimos situacion = "Pendiente".
      const situacionId =
        this.findCatalogIdByName("SITUACION_VARIACION", "Pendiente") ?? "";
      if (!tipoId || !situacionId) {
        this._error.set("No se encontraron los catalogos requeridos.");
        return null;
      }
      const body = formDataToCrearApi(
        data,
        tipoId,
        situacionId,
        reportedById,
      );
      const creada = await firstValueFrom(this.api.crear(body));
      const variation = variacionApiToVariation(creada, this.context());
      this._items.update((arr) => [variation, ...arr]);
      return variation;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async resolve(
    id: string,
    payload: ResolveVariationPayload,
  ): Promise<Variation | null> {
    try {
      const situacionId =
        this.findCatalogIdByName("SITUACION_VARIACION", payload.decision) ?? "";
      if (!situacionId) {
        this._error.set("No se encontró la situación de resolución.");
        return null;
      }
      const actualizada = await firstValueFrom(
        this.api.resolver(
          id,
          resolverPayloadToApi(situacionId, payload.observation),
        ),
      );
      const variation = variacionApiToVariation(actualizada, this.context());
      this._items.update((arr) =>
        arr.map((v) => (v.id === id ? variation : v)),
      );
      return variation;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  private findCatalogIdByName(grupo: string, opcion: string): string | null {
    const items = this.catalogService.items();
    const GRUPO_UI_TO_BACKEND: Record<string, string> = {
      TACT: "TIPO_ACTIVIDAD",
      MOD: "MODALIDAD",
      TVAR: "TIPO_VARIACION",
      SVAR: "SITUACION_VARIACION",
      TSUB: "TIPO_SUBPROYECTO",
      PRIO: "PRIORIDAD",
      SIT: "SITUACION",
    };
    for (const code of Object.keys(GRUPO_UI_TO_BACKEND)) {
      if (GRUPO_UI_TO_BACKEND[code] !== grupo) continue;
      const match = items.find(
        (i) => i.groupCode === code && i.name === opcion,
      );
      return match?.id ?? null;
    }
    return null;
  }

}
