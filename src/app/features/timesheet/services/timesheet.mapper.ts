import type {
  BitacoraApi,
  BitacoraCrearApi,
} from "../models/timesheet-api";
import type { ActividadApi } from "../models/timesheet-actividad-api";
import type { TimesheetEntry } from "../models/timesheet-entry";

// Conversiones puras sin DI. Backend BitacoraResponse -> UI TimesheetEntry.
//
// Para resolver el titulo de una actividad (campo `activity` del UI),
// el caller pasa un map<actividadId, ActividadApi>. Si no resuelve, queda
// el UUID como fallback (modo anterior).
//
// Regla XOR: el backend garantiza exactamente uno de asignacionId/actividadId.
// Si ambos o ninguno vienen, devolvemos kind="task" por defecto.
function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function bitacoraApiToEntry(
  api: BitacoraApi,
  actividadesById?: ReadonlyMap<string, ActividadApi>,
): TimesheetEntry {
  const minutos = timeToMinutes(api.horaFin) - timeToMinutes(api.horaInicio);
  const hours = Math.max(0, minutos / 60);
  const isTask = api.asignacionId !== null;
  const actividadTitulo =
    api.actividadId && actividadesById
      ? actividadesById.get(api.actividadId)?.titulo
      : undefined;
  return {
    id: api.id,
    resourceId: api.usuarioId,
    date: api.fecha,
    startTime: api.horaInicio.slice(0, 5),
    endTime: api.horaFin.slice(0, 5),
    hours,
    kind: isTask ? "task" : "activity",
    project: "",
    task: api.asignacionId ?? "",
    taskCode: undefined,
    activity: actividadTitulo ?? api.actividadId ?? "",
    description: api.descripcion ?? "",
    status: api.estado === 1 ? "approved" : "draft",
  };
}

export function entryToBitacoraCrearApi(
  entry: Omit<TimesheetEntry, "id">,
): BitacoraCrearApi {
  return {
    fecha: entry.date,
    horaInicio: `${entry.startTime}:00`,
    horaFin: `${entry.endTime}:00`,
    descripcion: entry.description || null,
    asignacionId: entry.kind === "task" ? entry.task || null : null,
    // Para kind="activity", el FE guarda el titulo en `activity`. El backend
    // requiere el UUID; el caller debe resolver titulo->actividadId antes
    // de llamar a TimesheetService.create (workaround documentado).
    actividadId: entry.kind === "activity" ? entry.activity || null : null,
  };
}
