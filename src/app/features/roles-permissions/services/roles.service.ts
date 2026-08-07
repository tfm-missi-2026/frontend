import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import { LookupsService } from "@core/lookups/lookups.service";

import type { Role } from "../models/role";
import { SYSTEM_MODULES } from "../models/role";
import { RolesApiService } from "./roles-api.service";
import { extractProblemMessage } from "@utils/problem-detail";

// Mapea codigos de modulos del backend (PROYECTOS, BITACORA, etc.) a
// slugs del frontend (proyectos, seguimiento, etc.) que usa el resto
// del feature. Los codigos que no matchean quedan fuera del set.
const FRONTEND_BY_CODIGO: Record<string, string> = {
  INICIO: "dashboard",
  PROYECTOS: "proyectos",
  ASIGNACIONES: "planificacion",
  BITACORA: "seguimiento",
  VARIACIONES: "variaciones",
  LINEA_BASE: "linea-base",
  ADMINISTRACION: "administracion",
};

const CODIGO_BY_FRONTEND: Record<string, string> = Object.fromEntries(
  Object.entries(FRONTEND_BY_CODIGO).map(([k, v]) => [v, k]),
);

@Injectable({ providedIn: "root" })
export class RolesService {
  private readonly api = inject(RolesApiService);
  private readonly lookups = inject(LookupsService);

  private readonly _roles = signal<Role[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly roles = this._roles.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._roles().length);

  async cargar(): Promise<void> {
    if (this._loading()) return;
    if (this._roles().length > 0) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      // Roles y modulos compartidos con UsersService y ModulosService.
      await Promise.all([
        this.lookups.cargarRoles(),
        this.lookups.cargarModulos(),
      ]);
      const roles = this.lookups.roles();
      this._roles.set(
        roles.map((r) => ({
          id: r.id,
          code: r.codigo,
          name: r.nombre,
          description: r.descripcion ?? "",
          kind: this.inferKind(r.codigo),
          users: 0, // derivado; requiere lookup a /api/usuarios
          permissions: [],
        })),
      );
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  async loadPermissionsForRole(rolId: string): Promise<string[]> {
    // Si ya hay cache para este rol, no ir a la red.
    if (this.lookups.getModulosPorRol(rolId).length > 0) {
      return this.getPermissionsForRole(rolId);
    }
    try {
      const modulos = await this.lookups.cargarModulosPorRol(rolId);
      return modulos.map((m) => FRONTEND_BY_CODIGO[m.codigo] ?? m.codigo);
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return [];
    }
  }

  async create(data: {
    code: string;
    name: string;
    description: string;
    permissions: string[];
  }): Promise<Role | null> {
    try {
      const creado = await firstValueFrom(
        this.api.crear({
          codigo: data.code,
          nombre: data.name,
          descripcion: data.description,
        }),
      );
      const role: Role = {
        id: creado.id,
        code: creado.codigo,
        name: creado.nombre,
        description: creado.descripcion ?? "",
        kind: this.inferKind(creado.codigo),
        users: 0,
        permissions: [],
      };
      this._roles.update((arr) => [role, ...arr]);
      if (data.permissions.length > 0) {
        await this.updatePermissions(role.id, data.permissions);
      }
      return role;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async updatePermissions(
    rolId: string,
    frontendIds: string[],
  ): Promise<boolean> {
    const modulos = this.lookups.modulos();
    const moduloIds = frontendIds
      .map((id) => CODIGO_BY_FRONTEND[id] ?? id)
      .map((codigo) => modulos.find((m) => m.codigo === codigo)?.id)
      .filter((x): x is string => Boolean(x));
    try {
      // PUT /api/roles/{id}/modulos devuelve la lista ya persistida;
      // la cacheamos para evitar el GET extra en la proxima lectura.
      const respuesta = await firstValueFrom(
        this.api.asignarModulos(rolId, moduloIds),
      );
      this.lookups.setModulosPorRol(rolId, respuesta ?? []);
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

  getPermissionsForRole(rolId: string): string[] {
    return this.lookups
      .getModulosPorRol(rolId)
      .map((m) => FRONTEND_BY_CODIGO[m.codigo] ?? m.codigo);
  }

  private inferKind(codigo: string): Role["kind"] {
    return SYSTEM_MODULES.some((m) => m.id === codigo.toLowerCase())
      ? "system"
      : "custom";
  }

}
