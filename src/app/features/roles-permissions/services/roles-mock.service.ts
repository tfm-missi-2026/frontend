import { Injectable, computed, signal } from "@angular/core";

import type { Role } from "../models/role";

const INITIAL: Role[] = [
  {
    id: "r1",
    code: "ADM",
    name: "Administrador",
    description:
      "Acceso total. Gestiona usuarios, roles y catálogos del sistema. Es el único rol que restablece contraseñas.",
    kind: "system",
    users: 6,
    permissions: ["dashboard", "administracion"],
  },
  {
    id: "r2",
    code: "JA",
    name: "Jefe de Área",
    description:
      "Supervisa el área: ve todos los proyectos y el avance global. No administra el sistema.",
    kind: "system",
    users: 3,
    permissions: [
      "dashboard",
      "proyectos",
      "planificacion",
      "seguimiento",
      "carga-equipo",
      "avance",
      "variaciones",
    ],
  },
  {
    id: "r3",
    code: "GP",
    name: "Gestor de Proyecto",
    description:
      "Gestiona uno o más proyectos: planifica tareas, asigna recursos técnicos y da seguimiento al avance y a las variaciones.",
    kind: "system",
    users: 8,
    permissions: [
      "dashboard",
      "proyectos",
      "planificacion",
      "seguimiento",
      "avance",
      "variaciones",
    ],
  },
  {
    id: "r4",
    code: "RT",
    name: "Recurso Técnico",
    description:
      "Ejecuta tareas asignadas y registra su avance y carga de trabajo. Vista acotada a lo suyo.",
    kind: "system",
    users: 21,
    permissions: ["dashboard", "seguimiento", "avance"],
  },
  {
    id: "r5",
    code: "AUD",
    name: "Auditor",
    description:
      "Acceso de solo lectura para auditoría interna sobre proyectos, planificación y variaciones.",
    kind: "custom",
    users: 2,
    permissions: ["dashboard", "proyectos", "seguimiento", "variaciones"],
  },
];

@Injectable({ providedIn: "root" })
export class RolesMockService {
  private readonly _roles = signal<Role[]>(INITIAL);
  readonly roles = this._roles.asReadonly();
  readonly count = computed(() => this._roles().length);

  create(data: Omit<Role, "id" | "users" | "kind">): Role {
    const next: Role = {
      ...data,
      id: `r${Date.now()}`,
      kind: "custom",
      users: 0,
    };
    this._roles.update((arr) => [...arr, next]);
    return next;
  }

  updatePermissions(id: string, permissions: string[]): void {
    this._roles.update((arr) =>
      arr.map((r) => (r.id === id ? { ...r, permissions } : r)),
    );
  }

  updateMeta(
    id: string,
    patch: Partial<Pick<Role, "code" | "name" | "description">>,
  ): void {
    this._roles.update((arr) =>
      arr.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }
}
