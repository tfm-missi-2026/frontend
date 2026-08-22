import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";

import type { Assignment } from "../models/assignment";
import type { AssignmentFormData } from "../models/assignment-form";
import type { AsignacionCrearApi } from "../models/assignment-api";
import {
  asignacionApiToAssignment,
  buildAssignmentContext,
  formDataToCrearApi,
} from "./assignments.mapper";
import { AssignmentsApiService } from "./assignments-api.service";
import { extractProblemMessage } from "@utils/problem-detail";

// projectId se deriva por join tarea -> subproyecto -> proyecto.
//
// Nota: el backend no expone PUT /api/asignaciones/{id}. Para editar
// se elimina y se vuelve a crear. update() queda como delete + create.
// freeze() no tiene contraparte backend: se delega a /api/linea-base/congelar.
@Injectable({ providedIn: "root" })
export class AssignmentsService {
  private readonly api = inject(AssignmentsApiService);
  private readonly tasksService = inject(TasksService);
  private readonly subprojectsService = inject(SubprojectsService);

  private readonly _assignments = signal<Assignment[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly assignments = this._assignments.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._assignments().length);

  // Lookup tarea -> proyecto, recalculado cuando cambian tareas o subproyectos.
  private readonly context = computed(() =>
    buildAssignmentContext(
      this.tasksService.tasks(),
      this.subprojectsService.subs(),
    ),
  );

  async cargar(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      // Asegurar que tasks y subproyectos esten disponibles para derivar projectId.
      if (this.tasksService.count() === 0) {
        await this.tasksService.cargar();
      }
      if (this.subprojectsService.count() === 0) {
        await this.subprojectsService.cargar();
      }
      const data = await firstValueFrom(this.api.listar());
      this._assignments.set(data.map((a) => asignacionApiToAssignment(a, this.context())));
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  getByProject(projectId: string): Assignment[] {
    return this._assignments().filter(
      (a) => a.projectId === projectId && a.active,
    );
  }

  getById(id: string): Assignment | undefined {
    return this._assignments().find((a) => a.id === id);
  }

  getByResourceInRange(
    resourceId: string,
    isoStart: string,
    isoEnd: string,
  ): Assignment[] {
    return this._assignments().filter(
      (a) =>
        a.active &&
        a.resourceId === resourceId &&
        a.startDate <= isoEnd &&
        a.endDate >= isoStart,
    );
  }

  async create(
    projectId: string,
    data: AssignmentFormData,
    confirmarSobrecarga = false,
  ): Promise<Assignment | null> {
    const body: AsignacionCrearApi = formDataToCrearApi(
      data,
      confirmarSobrecarga,
    );
    try {
      const creada = await firstValueFrom(this.api.crear(body));
      const assignment = asignacionApiToAssignment(creada, this.context());
      this._assignments.update((arr) => [assignment, ...arr]);
      return assignment;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  // El backend no tiene PUT. Esta implementacion hace delete + create.
  // El caller debe pedir confirmacion de sobrecarga si aplica.
  async update(
    projectId: string,
    id: string,
    data: AssignmentFormData,
    confirmarSobrecarga = false,
  ): Promise<Assignment | null> {
    const ok = await this.deactivate(projectId, id);
    if (!ok) return null;
    return this.create(projectId, data, confirmarSobrecarga);
  }

  async deactivate(
    projectId: string,
    id: string,
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.api.eliminar(id, "Baja desde panel de planificacion"),
      );
      this._assignments.update((arr) =>
        arr.map((a) => (a.id === id ? { ...a, active: false } : a)),
      );
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

  // freeze() no tiene contraparte backend; linea-base se gestiona aparte.
  // Se mantiene la firma para no romper consumidores; marca local sin persistir.
  freeze(projectId: string): void {
    this._assignments.update((arr) =>
      arr.map((a) =>
        a.projectId === projectId && a.active ? { ...a, frozen: true } : a,
      ),
    );
  }

  // Marca como frozen las assignments locales de un proyecto. Usado
  // despues de congelar una linea base real via LineaBaseService para
  // que progress/manager-dashboard reflejen hasBaseline=true de inmediato.
  markFrozenLocal(projectId: string): void {
    this.freeze(projectId);
  }

}
