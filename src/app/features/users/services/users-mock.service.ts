import { Injectable, computed, signal } from "@angular/core";

import type { User } from "../models/user";

const INITIAL: User[] = [
  {
    id: "u1",
    firstName: "Ricardo",
    lastNamePaternal: "Salazar",
    lastNameMaternal: "Núñez",
    email: "r.salazar@institucion.gob.pe",
    role: "administrador",
    status: "active",
  },
  {
    id: "u2",
    firstName: "Carlos",
    lastNamePaternal: "Vega",
    lastNameMaternal: "Ramos",
    email: "c.vega@institucion.gob.pe",
    role: "jefe_area",
    status: "active",
  },
  {
    id: "u3",
    firstName: "Lucía",
    lastNamePaternal: "Fernández",
    lastNameMaternal: "Torres",
    email: "l.fernandez@institucion.gob.pe",
    role: "gestor_proyecto",
    status: "active",
  },
  {
    id: "u4",
    firstName: "Jorge",
    lastNamePaternal: "Medina",
    lastNameMaternal: "Castro",
    email: "j.medina@institucion.gob.pe",
    role: "gestor_proyecto",
    status: "active",
  },
  {
    id: "u5",
    firstName: "Ana",
    lastNamePaternal: "Quispe",
    lastNameMaternal: "Rojas",
    email: "a.quispe@institucion.gob.pe",
    role: "recurso_tecnico",
    status: "active",
  },
  {
    id: "u6",
    firstName: "Diego",
    lastNamePaternal: "Salas",
    lastNameMaternal: "Romero",
    email: "d.salas@institucion.gob.pe",
    role: "recurso_tecnico",
    status: "inactive",
  },
];

@Injectable({ providedIn: "root" })
export class UsersMockService {
  private readonly _users = signal<User[]>(INITIAL);
  readonly users = this._users.asReadonly();
  readonly count = computed(() => this._users().length);

  create(data: Omit<User, "id">): User {
    const next: User = { ...data, id: `u${Date.now()}` };
    this._users.update((arr) => [next, ...arr]);
    return next;
  }

  update(id: string, patch: Partial<Omit<User, "id">>): void {
    this._users.update((arr) =>
      arr.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    );
  }

  deactivate(id: string): void {
    this.update(id, { status: "inactive" });
  }

  generateTempPassword(length = 8): string {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let raw = "";
    for (let i = 0; i < length; i++) {
      raw += chars[Math.floor(Math.random() * chars.length)];
    }
    const mid = Math.ceil(raw.length / 2);
    return `${raw.slice(0, mid)}-${raw.slice(mid)}`;
  }
}