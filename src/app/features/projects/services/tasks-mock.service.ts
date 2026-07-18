import { Injectable, computed, signal } from "@angular/core";

import type { Task } from "../models/task";
import type { TaskFormData } from "../models/task-form";

const SEED: Task[] = [
  {
    id: "t-spsrt-001",
    subprojectId: "sp-req204",
    name: "Analizar formato de RUC (SUNAT)",
    description: "",
    startDate: "2026-05-19",
    endDate: "2026-05-20",
    estimatedHours: 8,
    situation: "Culminado",
    origin: "base",
    originLabel: "Línea base",
    dependsOnIds: [],
    active: true,
  },
  {
    id: "t-spsrt-002",
    subprojectId: "sp-req204",
    name: "Diseñar regla de validación",
    description: "",
    startDate: "2026-05-21",
    endDate: "2026-05-23",
    estimatedHours: 12,
    situation: "Culminado",
    origin: "base",
    originLabel: "Línea base",
    dependsOnIds: ["t-spsrt-001"],
    active: true,
  },
  {
    id: "t-spsrt-003",
    subprojectId: "sp-req204",
    name: "Implementar en formulario de expediente",
    description: "",
    startDate: "2026-05-26",
    endDate: "2026-05-29",
    estimatedHours: 16,
    situation: "En atención",
    origin: "base",
    originLabel: "Línea base",
    dependsOnIds: ["t-spsrt-002"],
    active: true,
  },
  {
    id: "t-spsrt-004",
    subprojectId: "sp-req204",
    name: "Pruebas con casos reales",
    description: "",
    startDate: "2026-06-01",
    endDate: "2026-06-03",
    estimatedHours: 10,
    situation: "Pendiente",
    origin: "base",
    originLabel: "Línea base",
    dependsOnIds: ["t-spsrt-003"],
    active: true,
  },
  {
    id: "t-spsrt-005",
    subprojectId: "sp-req204",
    name: "Ajuste por nuevo dígito verificador",
    description: "",
    startDate: "2026-06-04",
    endDate: "2026-06-05",
    estimatedHours: 12,
    situation: "Pendiente",
    origin: "var",
    originLabel: "Variación #V-007",
    dependsOnIds: ["t-spsrt-004"],
    active: true,
  },
  {
    id: "t-spsrt-006",
    subprojectId: "sp-req204",
    name: "Validación con dato extranjero (descartada)",
    description: "",
    startDate: null,
    endDate: null,
    estimatedHours: 0,
    situation: "Rechazado",
    origin: "var",
    originLabel: "Variación #V-007",
    dependsOnIds: [],
    active: true,
  },
  {
    id: "t-dm018-001",
    subprojectId: "sp-dm018",
    name: "Módulo de notificaciones por correo",
    description: "",
    startDate: "2026-05-19",
    endDate: "2026-06-13",
    estimatedHours: 64,
    situation: "En atención",
    origin: "base",
    originLabel: "Línea base",
    dependsOnIds: [],
    active: true,
  },
  {
    id: "t-sd4821-001",
    subprojectId: "sp-sd4821",
    name: "Corregir error 500 al adjuntar PDF",
    description: "",
    startDate: "2026-06-02",
    endDate: "2026-06-09",
    estimatedHours: 32,
    situation: "En atención",
    origin: "base",
    originLabel: "Línea base",
    dependsOnIds: [],
    active: true,
  },
  {
    id: "t-sd4790-001",
    subprojectId: "sp-sd4790",
    name: "Optimizar listado de trámites",
    description: "",
    startDate: "2026-05-12",
    endDate: "2026-05-23",
    estimatedHours: 44,
    situation: "Pendiente",
    origin: "base",
    originLabel: "Línea base",
    dependsOnIds: [],
    active: true,
  },
];

@Injectable({ providedIn: "root" })
export class TasksMockService {
  private readonly _tasks = signal<Task[]>(SEED);
  readonly tasks = this._tasks.asReadonly();
  readonly count = computed(() => this._tasks().length);

  getBySubproject(subprojectId: string): Task[] {
    return this._tasks().filter(
      (t) => t.subprojectId === subprojectId && t.active,
    );
  }

  getById(id: string): Task | undefined {
    return this._tasks().find((t) => t.id === id);
  }

  create(subprojectId: string, data: TaskFormData): Task {
    const next: Task = {
      id: `t-${Date.now()}`,
      subprojectId,
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      estimatedHours: data.estimatedHours ?? 0,
      situation: "Pendiente",
      origin: "base",
      originLabel: "Línea base",
      dependsOnIds: [],
      active: true,
    };
    this._tasks.update((arr) => [next, ...arr]);
    return next;
  }

  update(
    subprojectId: string,
    id: string,
    data: TaskFormData,
  ): void {
    this._tasks.update((arr) =>
      arr.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
              estimatedHours: data.estimatedHours ?? 0,
              subprojectId,
              id,
              situation: t.situation,
              origin: t.origin,
              originLabel: t.originLabel,
              dependsOnIds: t.dependsOnIds,
            }
          : t,
      ),
    );
  }

  deactivate(subprojectId: string, id: string): void {
    this._tasks.update((arr) =>
      arr.map((t) => (t.id === id ? { ...t, active: false } : t)),
    );
  }
}