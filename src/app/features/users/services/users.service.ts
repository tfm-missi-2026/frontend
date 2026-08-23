import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { LookupsService } from "@core/lookups/lookups.service";

import type { User } from "../models/user";
import { USER_STATUS_OPTIONS } from "../models/user";
import type { UserFormData } from "../models/user-form";
import { UsersApiService } from "./users-api.service";
import { buildRolLookup, resolveRolId, usuarioApiToUser } from "./users.mapper";
import { extractProblemMessage } from "@utils/problem-detail";

export interface CreateUserInput {
  data: UserFormData;
  initialPassword: string;
}

export interface UpdateUserInput {
  data: Omit<UserFormData, "initialPassword">;
}

@Injectable({ providedIn: "root" })
export class UsersService {
  private readonly api = inject(UsersApiService);
  private readonly lookups = inject(LookupsService);

  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly statusOptions = USER_STATUS_OPTIONS;
  readonly count = computed(() => this._users().length);

  async cargar(): Promise<void> {
    if (this._loading()) return;
    if (this._users().length > 0) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      await this.lookups.loadRoles();
      const usuarios = await firstValueFrom(this.api.listar());
      this._users.set(usuarios.map(usuarioApiToUser));
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  async crear(input: CreateUserInput): Promise<User | null> {
    const lookup = buildRolLookup(this.lookups.roles());
    const rolId = resolveRolId(lookup, input.data.role);
    if (!rolId) {
      this._error.set(`No se encontro el rol ${input.data.role} en el catalogo.`);
      return null;
    }

    try {
      const creado = await firstValueFrom(
        this.api.crear({
          email: input.data.email.trim(),
          contrasenia: input.initialPassword,
          nombres: input.data.firstName.trim(),
          apellidoPaterno: input.data.lastNamePaternal.trim(),
          apellidoMaterno: input.data.lastNameMaternal.trim(),
          rolId,
        }),
      );
      const user = usuarioApiToUser(creado);
      this._users.update((arr) => [user, ...arr]);
      return user;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async actualizar(id: string, input: UpdateUserInput): Promise<User | null> {
    const lookup = buildRolLookup(this.lookups.roles());
    const rolId = resolveRolId(lookup, input.data.role);
    if (!rolId) {
      this._error.set(`No se encontro el rol ${input.data.role} en el catalogo.`);
      return null;
    }

    try {
      const actualizado = await firstValueFrom(
        this.api.actualizar(id, {
          email: input.data.email.trim(),
          nombres: input.data.firstName.trim(),
          apellidoPaterno: input.data.lastNamePaternal.trim(),
          apellidoMaterno: input.data.lastNameMaternal.trim(),
          rolId,
        }),
      );
      const user = usuarioApiToUser(actualizado);
      this._users.update((arr) => arr.map((u) => (u.id === id ? user : u)));
      return user;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async desactivar(
    id: string,
    motivo = "Baja desde panel de administracion",
  ): Promise<boolean> {
    try {
      await firstValueFrom(this.api.eliminar(id, { motivoEliminacion: motivo }));
      this._users.update((arr) => arr.filter((u) => u.id !== id));
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

  async resetPassword(id: string, contraseniaPlano: string): Promise<boolean> {
    try {
      await firstValueFrom(this.api.resetPassword(id, { contrasenia: contraseniaPlano }));
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }
}
