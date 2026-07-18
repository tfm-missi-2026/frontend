import { Injectable, computed, signal } from "@angular/core";

import type { Subproject } from "../models/subproject";
import type { SubprojectFormData } from "../models/subproject-form";

const SEED: Subproject[] = [
  {
    id: "sp-sd4821",
    projectId: "p-sigtramites",
    ticket: "SD-4821",
    type: "Incidencia",
    description:
      "Error 500 al adjuntar PDF en el trámite de licencia.",
    priority: "Alta",
    requester: "Mesa de Ayuda",
    requestDate: "2026-06-02",
    situation: "En atención",
    rejectionReason: null,
    taskCount: 5,
    active: true,
  },
  {
    id: "sp-req204",
    projectId: "p-sigtramites",
    ticket: "REQ-204",
    type: "Requerimiento",
    description:
      "Agregar campo “RUC” al formulario de registro de expediente.",
    priority: "Media",
    requester: "Of. de Trámites",
    requestDate: "2026-05-28",
    situation: "Pendiente",
    rejectionReason: null,
    taskCount: 3,
    active: true,
  },
  {
    id: "sp-dm018",
    projectId: "p-sigtramites",
    ticket: "DM-018",
    type: "Desarrollo modular",
    description:
      "Nuevo módulo de notificaciones por correo al ciudadano.",
    priority: "Alta",
    requester: "Jefatura de Área",
    requestDate: "2026-05-15",
    situation: "En atención",
    rejectionReason: null,
    taskCount: 9,
    active: true,
  },
  {
    id: "sp-sd4790",
    projectId: "p-sigtramites",
    ticket: "SD-4790",
    type: "Incidencia",
    description:
      "Lentitud al listar trámites con más de 1000 registros.",
    priority: "Media",
    requester: "Mesa de Ayuda",
    requestDate: "2026-05-10",
    situation: "Culminado",
    rejectionReason: null,
    taskCount: 4,
    active: true,
  },
  {
    id: "sp-req-export",
    projectId: "p-sigtramites",
    ticket: null,
    type: "Requerimiento",
    description: "Exportar reporte mensual de trámites a Excel.",
    priority: "Baja",
    requester: "Of. de Trámites",
    requestDate: "2026-05-06",
    situation: "Pendiente",
    rejectionReason: null,
    taskCount: 2,
    active: true,
  },
  {
    id: "sp-req198",
    projectId: "p-sigtramites",
    ticket: "REQ-198",
    type: "Requerimiento",
    description:
      "Integración con firma digital (rechazada por falta de alcance).",
    priority: "Baja",
    requester: "Jefatura de Área",
    requestDate: "2026-04-21",
    situation: "Rechazado",
    rejectionReason:
      "Fuera del alcance firmado para esta fase.",
    taskCount: 1,
    active: true,
  },
  {
    id: "sp-sirecauda-1",
    projectId: "p-sirecauda",
    ticket: null,
    type: "Requerimiento",
    description: "Requerimiento inicial del proyecto SIRECAUDA.",
    priority: "Media",
    requester: "Of. de Trámites",
    requestDate: "2026-05-20",
    situation: "Pendiente",
    rejectionReason: null,
    taskCount: 1,
    active: true,
  },
  {
    id: "sp-sirecauda-2",
    projectId: "p-sirecauda",
    ticket: null,
    type: "Incidencia",
    description: "Requerimiento inicial del proyecto SIRECAUDA.",
    priority: "Media",
    requester: "Mesa de Ayuda",
    requestDate: "2026-05-22",
    situation: "Pendiente",
    rejectionReason: null,
    taskCount: 1,
    active: true,
  },
  {
    id: "sp-sirecauda-3",
    projectId: "p-sirecauda",
    ticket: null,
    type: "Desarrollo modular",
    description: "Requerimiento inicial del proyecto SIRECAUDA.",
    priority: "Media",
    requester: "Jefatura de Área",
    requestDate: "2026-05-25",
    situation: "Pendiente",
    rejectionReason: null,
    taskCount: 1,
    active: true,
  },
  {
    id: "sp-sirecauda-4",
    projectId: "p-sirecauda",
    ticket: null,
    type: "Requerimiento",
    description: "Requerimiento inicial del proyecto SIRECAUDA.",
    priority: "Media",
    requester: "Of. de Trámites",
    requestDate: "2026-05-27",
    situation: "Pendiente",
    rejectionReason: null,
    taskCount: 1,
    active: true,
  },
  {
    id: "sp-siplanilla-1",
    projectId: "p-siplanilla",
    ticket: null,
    type: "Requerimiento",
    description: "Requerimiento inicial del proyecto SIPLANILLA.",
    priority: "Media",
    requester: "Of. de Trámites",
    requestDate: "2026-04-15",
    situation: "Pendiente",
    rejectionReason: null,
    taskCount: 0,
    active: true,
  },
  {
    id: "sp-siplanilla-2",
    projectId: "p-siplanilla",
    ticket: null,
    type: "Incidencia",
    description: "Requerimiento inicial del proyecto SIPLANILLA.",
    priority: "Media",
    requester: "Mesa de Ayuda",
    requestDate: "2026-04-18",
    situation: "Pendiente",
    rejectionReason: null,
    taskCount: 0,
    active: true,
  },
];

@Injectable({ providedIn: "root" })
export class SubprojectsMockService {
  private readonly _subs = signal<Subproject[]>(SEED);
  readonly subs = this._subs.asReadonly();
  readonly count = computed(() => this._subs().length);

  readonly countByProject = computed<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const s of this._subs()) {
      if (s.active) {
        map[s.projectId] = (map[s.projectId] ?? 0) + 1;
      }
    }
    return map;
  });

  getByProject(projectId: string): Subproject[] {
    return this._subs().filter((s) => s.projectId === projectId);
  }

  getById(id: string): Subproject | undefined {
    return this._subs().find((s) => s.id === id);
  }

  create(projectId: string, data: SubprojectFormData): Subproject {
    const next: Subproject = {
      id: `s-${Date.now()}`,
      projectId,
      ticket: data.ticket,
      type: data.type,
      description: data.description,
      priority: data.priority,
      requester: data.requester,
      requestDate: data.requestDate,
      situation: "Pendiente",
      rejectionReason: data.rejectionReason,
      taskCount: 0,
      active: true,
    };
    this._subs.update((arr) => [next, ...arr]);
    return next;
  }

  update(
    projectId: string,
    id: string,
    data: SubprojectFormData,
  ): void {
    this._subs.update((arr) =>
      arr.map((s) =>
        s.id === id
          ? {
              ...s,
              ...data,
              projectId,
              id,
              situation: s.situation,
            }
          : s,
      ),
    );
  }

  deactivate(projectId: string, id: string): void {
    this._subs.update((arr) =>
      arr.map((s) => (s.id === id ? { ...s, active: false } : s)),
    );
  }
}