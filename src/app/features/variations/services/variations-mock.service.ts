import { Injectable, computed, signal } from "@angular/core";

import type {
  ResolveVariationPayload,
  VariationFormData,
} from "../models/variation-form";
import type { Variation, VariationStatus } from "../models/variation";

const SEED: Variation[] = [
  {
    id: "v-001",
    projectId: "p-sigtramites",
    target: {
      kind: "task",
      taskId: "t-spsrt-005",
      label: "Ajuste por nuevo dígito verificador",
      ref: "#REQ-204",
    },
    type: "Plazo",
    description:
      "El nuevo dígito verificador del RUC obliga a re-codificar la regla de validación.",
    justification:
      "SUNAT publicó el dígito 0 como válido a partir del 1 de junio; la regla actual lo rechaza. Es imprescindible ajustar antes del 04/06.",
    previousValue: "fin 04/06/2026",
    newValue: "fin 09/06/2026",
    detectionDate: "2026-05-28",
    reportedBy: "Ana Quispe Rojas",
    status: "Pendiente",
    resolution: null,
  },
  {
    id: "v-002",
    projectId: "p-sigtramites",
    target: {
      kind: "subproject",
      subprojectId: "sp-dm018",
      label: "Módulo de notificaciones",
      ref: "#DM-018",
    },
    type: "Alcance",
    description:
      "Se añade canal SMS además del correo, no contemplado en la línea base.",
    justification:
      "El ciudadano no siempre revisa el correo institucional; el SMS garantiza notificación en menos de 1 minuto.",
    previousValue: "solo correo electrónico",
    newValue: "correo electrónico + SMS",
    detectionDate: "2026-05-20",
    reportedBy: "Lucía Fernández Torres",
    status: "Pendiente",
    resolution: null,
  },
  {
    id: "v-003",
    projectId: "p-sigtramites",
    target: {
      kind: "subproject",
      subprojectId: "sp-sd4821",
      label: "Corregir error 500 al adjuntar",
      ref: "#SD-4821",
    },
    type: "Recursos",
    description: "Se suma un recurso para acelerar la corrección.",
    justification:
      "La causa raíz está aislada en el parser de PDF; el equipo actual no tiene ancho para corregir y entregar el módulo de notificaciones en junio.",
    previousValue: "1 recurso asignado",
    newValue: "2 recursos asignados",
    detectionDate: "2026-05-30",
    reportedBy: "Lucía Fernández Torres",
    status: "Aprobada",
    resolution: {
      decision: "Aprobada",
      observation:
        "Aprobado. Ana Quispe se suma al fix durante la semana del 1 al 5 de junio.",
      resolvedBy: "Ricardo Salazar Núñez",
      resolvedAt: "2026-05-31",
    },
  },
  {
    id: "v-004",
    projectId: "p-sigtramites",
    target: {
      kind: "subproject",
      subprojectId: "sp-sd4790",
      label: "Optimizar listado de trámites",
      ref: "#SD-4790",
    },
    type: "Plazo",
    description:
      "El volumen real de registros exige más tiempo de optimización del previsto.",
    justification:
      "Pruebas con 1000+ registros muestran que la consulta supera el umbral aceptable; se requieren 2 días adicionales.",
    previousValue: "fin 23/05/2026",
    newValue: "fin 27/05/2026",
    detectionDate: "2026-05-12",
    reportedBy: "Marco Ríos Peña",
    status: "Aprobada",
    resolution: {
      decision: "Aprobada",
      observation:
        "Aprobado. El Gestor libera al recurso para terminar la optimización.",
      resolvedBy: "Ricardo Salazar Núñez",
      resolvedAt: "2026-05-13",
    },
  },
  {
    id: "v-005",
    projectId: "p-sigtramites",
    target: {
      kind: "subproject",
      subprojectId: "sp-req198",
      label: "Integración con firma digital",
      ref: "#REQ-198",
    },
    type: "Recursos",
    description: "Solicitud de recurso externo; sin alcance aprobado.",
    justification:
      "La integración depende de un proveedor externo cuyo contrato está en evaluación; hasta que no se apruebe el alcance, no se asigna recurso.",
    previousValue: "recurso interno",
    newValue: "recurso externo (por confirmar)",
    detectionDate: "2026-04-18",
    reportedBy: "Marco Ríos Peña",
    status: "Rechazada",
    resolution: {
      decision: "Rechazada",
      observation:
        "Rechazado. Mantener en línea base hasta que se cierre el contrato con el proveedor.",
      resolvedBy: "Ricardo Salazar Núñez",
      resolvedAt: "2026-04-22",
    },
  },
];

@Injectable({ providedIn: "root" })
export class VariationsMockService {
  private readonly _items = signal<Variation[]>(SEED);
  readonly items = this._items.asReadonly();
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

  create(reportedBy: string, data: VariationFormData): Variation {
    const next: Variation = {
      id: `v-${Date.now()}`,
      projectId: null,
      target: data.target,
      type: data.type,
      description: data.description.trim(),
      justification: data.justification.trim(),
      previousValue: data.previousValue.trim(),
      newValue: data.newValue.trim(),
      detectionDate: data.detectionDate,
      reportedBy,
      status: "Pendiente",
      resolution: null,
    };
    this._items.update((arr) => [next, ...arr]);
    return next;
  }

  resolve(id: string, payload: ResolveVariationPayload): void {
    this._items.update((arr) =>
      arr.map((v) =>
        v.id === id
          ? {
              ...v,
              status: payload.decision,
              resolution: {
                decision: payload.decision,
                observation: payload.observation.trim(),
                resolvedBy: payload.resolvedBy,
                resolvedAt: new Date().toISOString().slice(0, 10),
              },
            }
          : v,
      ),
    );
  }
}
