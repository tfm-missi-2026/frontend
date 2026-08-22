import type {
  AsignacionApi,
  AsignacionCrearApi,
} from "../models/assignment-api";
import type { Assignment } from "../models/assignment";
import type { AssignmentFormData } from "../models/assignment-form";

// Mapeos puros sin DI. Reciben lookups para derivar projectId
// (tarea -> subproyecto -> proyecto). Si no resuelve, devuelve "".

export interface AssignmentContext {
  subprojectIdByTaskId: ReadonlyMap<string, string>;
  projectIdBySubprojectId: ReadonlyMap<string, string>;
}

export function buildAssignmentContext(
  tasks: ReadonlyArray<{ id: string; subprojectId: string }>,
  subproyectos: ReadonlyArray<{ id: string; projectId: string }>,
): AssignmentContext {
  return {
    subprojectIdByTaskId: new Map(
      tasks.map((t) => [t.id, t.subprojectId]),
    ),
    projectIdBySubprojectId: new Map(
      subproyectos.map((s) => [s.id, s.projectId]),
    ),
  };
}

export function asignacionApiToAssignment(
  api: AsignacionApi,
  ctx: AssignmentContext,
): Assignment {
  const subprojectId = ctx.subprojectIdByTaskId.get(api.tareaId) ?? "";
  const projectId = ctx.projectIdBySubprojectId.get(subprojectId) ?? "";
  return {
    id: api.id,
    projectId,
    taskId: api.tareaId,
    resourceId: api.usuarioId,
    plannedHours: api.horasPlanificadas ?? 0,
    startDate: api.fechaInicioPlanificada ?? "",
    endDate: api.fechaFinPlanificada ?? "",
    // Backend no tiene flag "frozen" por asignacion; se delega a linea-base.
    frozen: false,
    active: api.estado === 1,
  };
}

export function formDataToCrearApi(
  data: AssignmentFormData,
  confirmarSobrecarga = false,
): AsignacionCrearApi {
  return {
    tareaId: data.taskId,
    usuarioId: data.resourceId,
    horasPlanificadas: data.plannedHours || null,
    fechaInicioPlanificada: data.startDate || null,
    fechaFinPlanificada: data.endDate || null,
    confirmarSobrecarga,
  };
}
