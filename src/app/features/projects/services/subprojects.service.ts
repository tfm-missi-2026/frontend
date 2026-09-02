import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import { CatalogService } from "@features/catalog/services/catalog.service";
import { UsersService } from "@features/users/services/users.service";
import { userFullName } from "@features/users/models/user";

import type {
  SubproyectoApi,
  SubproyectoCrearApi,
} from "../models/project-api";
import type { Subproject } from "../models/subproject";
import type { SubprojectFormData } from "../models/subproject-form";
import {
  buildCatalogLookup,
  buildUserLookup,
  subproyectoApiToSubproject,
} from "./project.mapper";
import { SubproyectosApiService } from "./subprojects-api.service";
import { extractProblemMessage } from "@utils/problem-detail";

// Lookup de "Pendiente" (situacion inicial al crear subproyectos).
// Carga el catalogo si hace falta y devuelve el id del item "Pendiente"
// en el grupo SITUACION. Si el catalogo no esta cargado, devuelve "".
const PENDIENTE_BACKEND = "Pendiente";

@Injectable({ providedIn: "root" })
export class SubprojectsService {
  private readonly api = inject(SubproyectosApiService);
  private readonly catalogService = inject(CatalogService);
  private readonly usersService = inject(UsersService);

  private readonly _subs = signal<Subproject[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly subs = this._subs.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
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

  private readonly catalogLookup = computed(() =>
    buildCatalogLookup(this.catalogService.items()),
  );

  private readonly userLookup = computed(() =>
    buildUserLookup(
      this.usersService.users().map((u) => ({ id: u.id, fullName: userFullName(u) })),
    ),
  );

  private async ensureCatalog(): Promise<void> {
    if (this.catalogService.count() === 0) {
      await this.catalogService.cargar();
    }
  }

  private async ensureUsers(): Promise<void> {
    await this.usersService.cargar();
  }

  private findCatalogIdByOpcion(
    grupoBackend: string,
    opcion: string,
  ): string | null {
    const items = this.catalogService.items();
    // items() tiene groupCode UI; mapear a grupo backend para encontrar
    const GRUPO_UI_TO_BACKEND: Record<string, string> = {
      TACT: "TIPO_ACTIVIDAD",
      MOD: "MODALIDAD",
      TVAR: "TIPO_VARIACION",
      SVAR: "SITUACION_VARIACION",
      TSUB: "TIPO_SUBPROYECTO",
      PRIO: "PRIORIDAD",
      SIT: "SITUACION",
    };
    for (const code of Object.keys(GRUPO_UI_TO_BACKEND)) {
      if (GRUPO_UI_TO_BACKEND[code] !== grupoBackend) continue;
      // Encontrar el item UI con name == opcion dentro de este grupo
      const match = items.find(
        (i) => i.groupCode === code && i.name === opcion,
      );
      if (match) {
        // Necesitamos el id backend; pero el mapper descarta id. Volver a
        // pedirlo via catalog API seria costoso. Workaround: el id del item
        // UI es el id backend (ya que viene del CatalogoResponse.id).
        return match.id;
      }
    }
    return null;
  }

  async cargar(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await Promise.all([this.ensureCatalog(), this.ensureUsers()]);
      const data = await firstValueFrom(this.api.listar());
      const lookup = this.catalogLookup();
      const users = this.userLookup();
      const mapped = data.map((api) =>
        subproyectoApiToSubproject(api, lookup, users),
      );
      this._subs.set(mapped);
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  async cargarPorProyecto(proyectoId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await Promise.all([this.ensureCatalog(), this.ensureUsers()]);
      const data = await firstValueFrom(
        this.api.listarPorProyecto(proyectoId),
      );
      const lookup = this.catalogLookup();
      const users = this.userLookup();
      const mapped = data.map((api) =>
        subproyectoApiToSubproject(api, lookup, users),
      );
      this._subs.update((arr) => {
        const others = arr.filter((s) => s.projectId !== proyectoId);
        return [...mapped, ...others];
      });
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  getByProject(projectId: string): Subproject[] {
    return this._subs().filter((s) => s.projectId === projectId);
  }

  getById(id: string): Subproject | undefined {
    return this._subs().find((s) => s.id === id);
  }

  async create(
    projectId: string,
    data: SubprojectFormData,
  ): Promise<Subproject | null> {
    try {
      await Promise.all([this.ensureCatalog(), this.ensureUsers()]);
      const tipoId =
        this.findCatalogIdByOpcion("TIPO_SUBPROYECTO", data.type) ?? "";
      const prioridadId =
        this.findCatalogIdByOpcion("PRIORIDAD", data.priority) ?? "";
      const situacionId =
        this.findCatalogIdByOpcion("SITUACION", PENDIENTE_BACKEND) ?? "";
      const solicitanteId = data.requesterId.trim();
      const body: SubproyectoCrearApi = {
        proyectoId: projectId,
        tipoSubproyectoId: tipoId,
        codigoTicket: data.ticket,
        prioridadId,
        descripcion: data.description,
        solicitanteId,
        fechaSolicitud: data.requestDate,
        situacionId,
      };
      if (
        !tipoId ||
        !prioridadId ||
        !situacionId ||
        !solicitanteId ||
        !data.requestDate
      ) {
        this._error.set(
          "Faltan datos requeridos (tipo, prioridad, situacion, solicitante o fecha).",
        );
        return null;
      }
      const creado = await firstValueFrom(this.api.crear(body));
      const lookup = this.catalogLookup();
      const sub = subproyectoApiToSubproject(creado, lookup, this.userLookup());
      if (sub) {
        this._subs.update((arr) => [sub, ...arr]);
      }
      return sub;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async update(
    projectId: string,
    id: string,
    data: SubprojectFormData,
  ): Promise<Subproject | null> {
    try {
      await Promise.all([this.ensureCatalog(), this.ensureUsers()]);
      const current = this.getById(id);
      const situacionId = data.situationId || current?.situationId || "";
      const tipoId =
        this.findCatalogIdByOpcion("TIPO_SUBPROYECTO", data.type) ?? "";
      const prioridadId =
        this.findCatalogIdByOpcion("PRIORIDAD", data.priority) ?? "";
      if (!tipoId || !prioridadId || !situacionId) {
        this._error.set("Faltan datos requeridos para actualizar.");
        return null;
      }
      const actualizado = await firstValueFrom(
        this.api.actualizar(id, {
          tipoSubproyectoId: tipoId,
          codigoTicket: data.ticket,
          prioridadId,
          descripcion: data.description,
          situacionId,
          justificacionRechazo: data.rejectionReason,
        }),
      );
      const sub = subproyectoApiToSubproject(
        actualizado,
        this.catalogLookup(),
        this.userLookup(),
      );
      if (sub) {
        this._subs.update((arr) =>
          arr.map((s) => (s.id === id ? sub : s)),
        );
      }
      return sub;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async deactivate(
    projectId: string,
    id: string,
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.api.eliminar(id, "Baja desde panel de proyectos"),
      );
      this._subs.update((arr) =>
        arr.map((s) => (s.id === id ? { ...s, active: false } : s)),
      );
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

}
