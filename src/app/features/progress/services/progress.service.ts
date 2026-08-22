import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";

import {
  AssignmentsService,
} from "@features/planning/services/assignments.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";

import type {
  ProjectProgress,
  TaskProgressRow,
} from "../models/project-progress";
import type { AvanceProyectoApi, AvanceTareaApi } from "../models/progress-api";
import { AvanceApiService } from "./avance-api.service";

const EMPTY_PROGRESS: ProjectProgress = {
  projectId: "",
  hasBaseline: false,
  baselineLabel: "",
  baselineDate: "",
  estimatedHours: 0,
  loggedHours: 0,
  progressPct: 0,
  rows: [],
};

// Ahora el progreso real viene del backend (/api/avance/por-proyecto/{id}).
// El service solo ensambla refs (subproyecto.ticket) y adapta al shape UI.
@Injectable({ providedIn: "root" })
export class ProgressService {
  private readonly avanceApi = inject(AvanceApiService);
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly tasksService = inject(TasksService);

  async computeProjectProgress(
    projectId: string,
  ): Promise<ProjectProgress> {
    if (!projectId) return EMPTY_PROGRESS;

    // Asegurar subproyectos y tasks para resolver refs locales.
    if (this.tasksService.count() === 0) {
      await this.tasksService.cargar();
    }
    if (this.subprojectsService.count() === 0) {
      await this.subprojectsService.cargar();
    }

    const avance = await firstValueFrom(
      this.avanceApi.porProyecto(projectId),
    );

    const subprojects = this.subprojectsService
      .subs()
      .filter((s) => s.projectId === projectId && s.active);
    const subById = new Map(subprojects.map((s) => [s.id, s]));

    const rows: TaskProgressRow[] = (avance.tareas ?? []).map(
      (t: AvanceTareaApi) => {
        const task = this.tasksService.getById(t.tareaId);
        const sub = task ? subById.get(task.subprojectId) : undefined;
        const ref = sub?.ticket
          ? `#${sub.ticket}`
          : `#${task?.subprojectId ?? t.tareaId}`;
        return {
          taskId: t.tareaId,
          taskName: t.nombre,
          taskRef: ref,
          estimatedHours: t.horasEstimadas,
          loggedHours: t.horasRegistradas,
          progressPct: t.porcentajeAvance,
          deviationHours: t.desviacionHoras,
          isOverExecuted: t.horasRegistradas > t.horasEstimadas,
        };
      },
    );

    const hasBaseline = avance.lineaBaseId !== null;
    const baselineLabel = hasBaseline
      ? `Línea base v${avance.version ?? "?"}`
      : "Sin línea base congelada";
    const baselineDate = ""; // backend no expone fecha_congelacion en este DTO

    return {
      projectId,
      hasBaseline,
      baselineLabel,
      baselineDate,
      estimatedHours: avance.horasEstimadasTotal,
      loggedHours: avance.horasRegistradasTotal,
      progressPct: avance.porcentajeAvance,
      rows,
    };
  }

  // API sincrona legacy para callers existentes. Internamente dispara
  // el computo async y devuelve el progreso cacheado por projectId. Si el
  // caller necesita datos frescos, debe usar computeProjectProgress async.
  private readonly _cache = new Map<string, ProjectProgress>();

  computeProjectProgressSync(projectId: string): ProjectProgress {
    return this._cache.get(projectId) ?? EMPTY_PROGRESS;
  }

  // Wrapper: ejecuta computeProjectProgress y guarda en cache.
  async refreshProjectProgress(projectId: string): Promise<ProjectProgress> {
    const result = await this.computeProjectProgress(projectId);
    this._cache.set(projectId, result);
    return result;
  }
}
