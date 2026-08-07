import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";

import type {
  CongelarLineaBaseRequestApi,
  LineaBaseApi,
} from "../models/linea-base-api";
import { AssignmentsService } from "./assignments.service";
import { LineaBaseApiService } from "./linea-base-api.service";
import { extractProblemMessage } from "@utils/problem-detail";
import { sortByDesc } from "@utils/collections";

// Servicio para gestionar lineas base (snapshots del plan).
// Reemplaza el no-op freeze() del AssignmentsService.
@Injectable({ providedIn: "root" })
export class LineaBaseService {
  private readonly api = inject(LineaBaseApiService);
  private readonly tasksService = inject(TasksService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly assignmentsService = inject(AssignmentsService);

  private readonly _byProject = signal<Record<string, LineaBaseApi[]>>({});
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Map<proyectoId, ultima linea base>
  readonly latestByProject = computed<Record<string, LineaBaseApi>>(() => {
    const out: Record<string, LineaBaseApi> = {};
    for (const [pid, list] of Object.entries(this._byProject())) {
      if (list.length > 0) {
        // Ordenar descendente por version y tomar la primera.
        const sorted = sortByDesc(list, (x) => x.version);
        out[pid] = sorted[0];
      }
    }
    return out;
  });

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  async cargarPorProyecto(proyectoId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await firstValueFrom(this.api.porProyecto(proyectoId));
      this._byProject.update((m) => ({ ...m, [proyectoId]: data }));
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  latestForProject(proyectoId: string): LineaBaseApi | undefined {
    return this.latestByProject()[proyectoId];
  }

  async congelar(
    proyectoId: string,
    descripcion = "Snapshot inicial del plan",
  ): Promise<LineaBaseApi | null> {
    // Asegurar dependencias cargadas.
    if (this.tasksService.count() === 0) await this.tasksService.cargar();
    if (this.subprojectsService.count() === 0)
      await this.subprojectsService.cargar();
    if (this.assignmentsService.count() === 0)
      await this.assignmentsService.cargar();

    // Construir snapshot desde el estado actual.
    const subIds = new Set(
      this.subprojectsService
        .subs()
        .filter((s) => s.projectId === proyectoId)
        .map((s) => s.id),
    );
    const tasks = this.tasksService
      .tasks()
      .filter((t) => subIds.has(t.subprojectId));
    const taskIds = new Set(tasks.map((t) => t.id));
    const assignments = this.assignmentsService
      .assignments()
      .filter((a) => a.projectId === proyectoId && taskIds.has(a.taskId));

    const body: CongelarLineaBaseRequestApi = {
      proyectoId,
      descripcion,
      tareas: tasks.map((t) => ({
        tareaId: t.id,
        nombre: t.name,
        descripcion: t.description || null,
        fechaInicioPlanificada: t.startDate || "1970-01-01",
        fechaFinPlanificada: t.endDate || "1970-01-01",
        horasEstimadas: t.estimatedHours,
      })),
      asignaciones: assignments.map((a) => ({
        asignacionId: a.id,
        tareaId: a.taskId,
        usuarioId: a.resourceId,
      })),
    };

    try {
      const creada = await firstValueFrom(this.api.congelar(body));
      this._byProject.update((m) => ({
        ...m,
        [proyectoId]: [creada, ...(m[proyectoId] ?? [])],
      }));
      // Marcar assignments locales como frozen para que progress muestre
      // hasBaseline=true inmediatamente.
      this.assignmentsService.markFrozenLocal(proyectoId);
      return creada;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

}
