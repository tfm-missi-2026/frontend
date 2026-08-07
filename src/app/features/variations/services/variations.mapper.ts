import type {
  VariacionApi,
  VariacionCrearApi,
  VariacionResolverApi,
} from "../models/variation-api";
import type {
  Variation,
  VariationResolution,
  VariationStatus,
  VariationTarget,
  VariationType,
} from "../models/variation";
import type { VariationFormData } from "../models/variation-form";
import type { CatalogLookup } from "@features/projects/services/project.mapper";
import { isoDateOnly } from "@utils/date";

// Mapeos puros sin DI. Reciben lookups para resolver IDs a strings de UI.
// Si no resuelve, devuelve defaults seguros (no rompe la pantalla).
//
// reportedBy y resolution.resolvedBy: backend guarda UUID, se resuelve
// a nombre completo via usersById. Si no resuelve, queda el UUID
// como fallback (para debug).

const TYPE_FALLBACK: VariationType = "Plazo";
const STATUS_FALLBACK: VariationStatus = "Pendiente";
const STATUS_RESUELTA: VariationStatus[] = ["Aprobada", "Rechazada"];

export interface VariationContext {
  catalog: CatalogLookup;
  taskLabelByTaskId: ReadonlyMap<string, string>;
  taskRefByTaskId: ReadonlyMap<string, string>;
  subprojectIdByTaskId: ReadonlyMap<string, string>;
  projectIdBySubprojectId: ReadonlyMap<string, string>;
  userNameById: ReadonlyMap<string, string>;
}

function lookupOr<T extends string>(
  map: CatalogLookup,
  id: string,
  fallback: T,
): T {
  return (map.byId.get(id) as T) ?? fallback;
}

export function variacionApiToVariation(
  api: VariacionApi,
  ctx: VariationContext,
): Variation {
  const subprojectId = api.tareaId
    ? ctx.subprojectIdByTaskId.get(api.tareaId) ?? ""
    : "";
  const projectId = subprojectId
    ? ctx.projectIdBySubprojectId.get(subprojectId) ?? ""
    : "";
  const label = api.tareaId ? ctx.taskLabelByTaskId.get(api.tareaId) ?? "" : "";
  const ref = api.tareaId ? ctx.taskRefByTaskId.get(api.tareaId) ?? null : null;
  const target: VariationTarget | null = api.tareaId
    ? { kind: "task", taskId: api.tareaId, label, ref }
    : null;
  const status = lookupOr(ctx.catalog, api.situacionId, STATUS_FALLBACK);
  const type = lookupOr(ctx.catalog, api.tipoVariacionId, TYPE_FALLBACK);
  const reportedByNombre = ctx.userNameById.get(api.reportadaPor) ?? api.reportadaPor;
  const resolution: VariationResolution | null =
    api.resueltoPor && api.fechaResolucion
      ? {
          decision: STATUS_RESUELTA.includes(status)
            ? (status as Exclude<VariationStatus, "Pendiente">)
            : "Aprobada",
          observation: api.observacionResolucion ?? "",
          resolvedBy:
            ctx.userNameById.get(api.resueltoPor) ?? api.resueltoPor,
          resolvedAt: isoDateOnly(api.fechaResolucion),
        }
      : null;
  return {
    id: api.id,
    projectId: projectId || null,
    target,
    type,
    description: api.descripcion,
    justification: api.justificacion,
    previousValue: api.valorAnterior ?? "",
    newValue: api.valorNuevo ?? "",
    detectionDate: api.fechaDeteccion,
    reportedBy: reportedByNombre,
    status,
    resolution,
  };
}

export function formDataToCrearApi(
  data: VariationFormData,
  tipoVariacionId: string,
  situacionId: string,
  reportadaPorId: string,
): VariacionCrearApi {
  return {
    tareaId: data.target?.kind === "task" ? data.target.taskId : null,
    tipoVariacionId,
    descripcion: data.description.trim(),
    justificacion: data.justification.trim(),
    valorAnterior: data.previousValue.trim() || null,
    valorNuevo: data.newValue.trim() || null,
    fechaDeteccion: data.detectionDate,
    reportadaPor: reportadaPorId,
    situacionId,
  };
}

export function resolverPayloadToApi(
  situacionId: string,
  observation: string,
): VariacionResolverApi {
  return {
    situacionId,
    observacionResolucion: observation.trim() || null,
  };
}
