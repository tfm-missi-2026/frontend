import { Injectable, computed, signal } from "@angular/core";

import type { Project } from "../models/project";

const INITIAL: Project[] = [
  {
    id: "p-sigtramites",
    code: "SIGTRAMITES",
    name: "Sistema de Gestión de Trámites",
    description:
      "Plataforma interna para la recepción, seguimiento y respuesta de trámites administrativos.",
    managerId: "u3",
    subCount: 7,
    status: "active",
    startDate: "2026-04-15",
  },
  {
    id: "p-sirecauda",
    code: "SIRECAUDA",
    name: "Sistema de Recaudación Tributaria",
    description:
      "Módulo para la liquidación, emisión y seguimiento de recibos tributarios municipales.",
    managerId: "u4",
    subCount: 4,
    status: "active",
    startDate: "2026-05-20",
  },
  {
    id: "p-siplanilla",
    code: "SIPLANILLA",
    name: "Sistema de Planillas y Remuneraciones",
    description:
      "Gestión mensual de planillas, boletas de pago y retenciones del personal.",
    managerId: "u3",
    subCount: 2,
    status: "active",
    startDate: "2026-04-10",
  },
];

@Injectable({ providedIn: "root" })
export class ProjectsMockService {
  private readonly _projects = signal<Project[]>(INITIAL);
  readonly projects = this._projects.asReadonly();
  readonly count = computed(() => this._projects().length);

  create(data: Omit<Project, "id">): Project {
    const next: Project = { ...data, id: `p-${Date.now()}` };
    this._projects.update((arr) => [next, ...arr]);
    return next;
  }

  update(id: string, patch: Partial<Omit<Project, "id">>): void {
    this._projects.update((arr) =>
      arr.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  }

  deactivate(id: string): void {
    this.update(id, { status: "inactive" });
  }

  getById(id: string): Project | undefined {
    return this._projects().find((p) => p.id === id);
  }
}