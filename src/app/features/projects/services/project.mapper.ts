import type {
  ProyectoApi,
  ProyectoCrearApi,
  SubproyectoApi,
  SubproyectoCrearApi,
  TareaActualizarApi,
  TareaApi,
  TareaCrearApi,
} from "../models/project-api";
import type {
  SubprojectPriority,
  SubprojectSituation,
  SubprojectType,
} from "../models/subproject";
import type { SubprojectFormData } from "../models/subproject-form";
import type { ProjectStatus } from "../models/project";
import type { ProjectFormData } from "../models/project-form";
import type { TaskSituation } from "../models/task";
import type { TaskFormData } from "../models/task-form";

// Mapeos puros sin DI. Reciben maps de lookup para resolver IDs
// del backend (catalog, users) a strings de UI. Si no resuelve,
// devuelve defaults seguros (no rompe la pantalla).

export type EstadoActivo = 0 | 1;
export function estadoToProjectStatus(estado: number | null): ProjectStatus {
  return estado === 1 ? "active" : "inactive";
}
export function projectStatusToEstado(status: ProjectStatus): EstadoActivo {
  return status === "active" ? 1 : 0;
}

// Mapea nombre del backend (TIPO_SUBPROYECTO/PRIORIDAD/SITUACION) -> UI string.
// Usa el `name` del item de catalogo cuando el id esta disponible.
export interface CatalogLookup {
  byId: ReadonlyMap<string, string>;
}
export function buildCatalogLookup(
  items: ReadonlyArray<{ id: string; name: string }>,
): CatalogLookup {
  return { byId: new Map(items.map((i) => [i.id, i.name])) };
}

// Mismo shape que CatalogLookup (id -> nombre a mostrar), pero construido
// desde msa_usuario para resolver gestores/solicitantes en la UI.
export type UserLookup = CatalogLookup;
export function buildUserLookup(
  users: ReadonlyArray<{ id: string; fullName: string }>,
): UserLookup {
  return { byId: new Map(users.map((u) => [u.id, u.fullName])) };
}

export const SUBPROJECT_TYPE_FALLBACK: SubprojectType = "Incidencia";
export const SUBPROJECT_PRIORITY_FALLBACK: SubprojectPriority = "Media";
export const SUBPROJECT_SITUATION_FALLBACK: SubprojectSituation = "Pendiente";
export const TASK_SITUATION_FALLBACK: TaskSituation = "Pendiente";

function lookupOr(
  map: CatalogLookup,
  id: string,
  fallback: string,
): string {
  return map.byId.get(id) ?? fallback;
}

// --- Proyectos ---

export function proyectoApiToProject(
  api: ProyectoApi,
): import("../models/project").Project {
  return {
    id: api.id,
    code: api.nombreCorto ?? "",
    name: api.nombre,
    description: api.descripcion ?? "",
    managerId: api.gestorId,
    subCount: 0, // derivado, populated por facade
    status: estadoToProjectStatus(api.estado),
    startDate: "", // no persistido en backend
  };
}

export function projectFormDataToCrearApi(
  data: ProjectFormData,
): ProyectoCrearApi {
  return {
    nombreCorto: data.code.trim() || null,
    nombre: data.name,
    descripcion: data.description || null,
    gestorId: data.managerId,
  };
}

// --- Subproyectos ---

export function subproyectoApiToSubproject(
  api: SubproyectoApi,
  catalog: CatalogLookup,
  users: UserLookup,
): import("../models/subproject").Subproject {
  return {
    id: api.id,
    projectId: api.proyectoId,
    ticket: api.codigoTicket,
    type: (lookupOr(
      catalog,
      api.tipoSubproyectoId,
      SUBPROJECT_TYPE_FALLBACK,
    ) as SubprojectType) ?? SUBPROJECT_TYPE_FALLBACK,
    description: api.descripcion,
    priority: (lookupOr(
      catalog,
      api.prioridadId,
      SUBPROJECT_PRIORITY_FALLBACK,
    ) as SubprojectPriority) ?? SUBPROJECT_PRIORITY_FALLBACK,
    requesterId: api.solicitanteId,
    requester: users.byId.get(api.solicitanteId) ?? "",
    requestDate: api.fechaSolicitud,
    situationId: api.situacionId,
    situation: (lookupOr(
      catalog,
      api.situacionId,
      SUBPROJECT_SITUATION_FALLBACK,
    ) as SubprojectSituation) ?? SUBPROJECT_SITUATION_FALLBACK,
    rejectionReason: api.justificacionRechazo,
    taskCount: 0, // derivado, populated por facade
    active: api.estado === 1,
  };
}

export function subprojectFormDataToCrearApi(
  projectId: string,
  catalog: CatalogLookup,
  data: SubprojectFormData,
): SubproyectoCrearApi {
  return {
    proyectoId: projectId,
    tipoSubproyectoId: data.type, // el form ya envia el opcion como id proxy; el facade debe resolver
    codigoTicket: data.ticket,
    prioridadId: data.priority,
    descripcion: data.description,
    solicitanteId: data.requesterId,
    fechaSolicitud: data.requestDate,
    situacionId: SUBPROJECT_SITUATION_FALLBACK, // "Pendiente" por defecto al crear
  };
}


// --- Tareas ---

export function tareaApiToTask(
  api: TareaApi,
  catalog: CatalogLookup,
): import("../models/task").Task {
  return {
    id: api.id,
    subprojectId: api.subproyectoId,
    name: api.nombre,
    description: api.descripcion ?? "",
    startDate: api.fechaInicioPlanificada,
    endDate: api.fechaFinPlanificada,
    estimatedHours: api.horasEstimadas,
    situation: (lookupOr(
      catalog,
      api.situacionId,
      TASK_SITUATION_FALLBACK,
    ) as TaskSituation) ?? TASK_SITUATION_FALLBACK,
    origin: api.origenVariacionId ? "var" : "base",
    originLabel: api.origenVariacionId ? "Variación" : "Línea base",
    dependsOnIds: [], // no persistido en backend
    active: api.estado === 1,
  };
}

export function taskFormDataToCrearApi(
  subprojectId: string,
  situationId: string,
  data: TaskFormData,
): TareaCrearApi {
  return {
    subproyectoId: subprojectId,
    nombre: data.name,
    descripcion: data.description || null,
    fechaInicioPlanificada: data.startDate ?? "",
    fechaFinPlanificada: data.endDate ?? "",
    horasEstimadas: data.estimatedHours ?? 0,
    situacionId: situationId,
    origenVariacionId: null,
  };
}

export function taskFormDataToActualizarApi(
  situationId: string,
  origenVariacionId: string | null,
  data: TaskFormData,
): TareaActualizarApi {
  return {
    nombre: data.name,
    descripcion: data.description || null,
    fechaInicioPlanificada: data.startDate ?? "",
    fechaFinPlanificada: data.endDate ?? "",
    horasEstimadas: data.estimatedHours ?? 0,
    situacionId: situationId,
    origenVariacionId,
  };
}
