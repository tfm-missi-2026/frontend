import {
  Injectable,
  computed,
  inject,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";

import { CatalogService } from "@features/catalog/services/catalog.service";

import type { Project, ProjectStatus } from "../models/project";
import type { ProjectFormData } from "../models/project-form";
import type {
  ProyectoApi,
  ProyectoCrearApi,
} from "../models/project-api";
import {
  buildCatalogLookup,
  projectFormDataToCrearApi,
  proyectoApiToProject,
} from "./project.mapper";
import { ProyectosApiService } from "./projects-api.service";
import { extractProblemMessage } from "@utils/problem-detail";

// Los datos vienen del backend via ProyectosApiService. CatalogService se inyecta
// para resolver IDs (subCount, etc.) aunque proyectos no usa catalog directo,
// queda cableado para futuras mejoras.
@Injectable({ providedIn: "root" })
export class ProjectsService {
  private readonly api = inject(ProyectosApiService);
  private readonly catalogService = inject(CatalogService);

  private readonly _projects = signal<Project[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._projects().length);

  // Lookup construido a partir del catalogo cacheado.
  private readonly catalogLookup = computed(() =>
    buildCatalogLookup(this.catalogService.items()),
  );

  async cargar(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      if (this.catalogService.count() === 0) {
        await this.catalogService.cargar();
      }
      const data = await firstValueFrom(this.api.listar());
      const mapped = data.map(proyectoApiToProject);
      this._projects.set(mapped);
    } catch (err) {
      this._error.set(extractProblemMessage(err));
    } finally {
      this._loading.set(false);
    }
  }

  getById(id: string): Project | undefined {
    return this._projects().find((p) => p.id === id);
  }

  async create(data: ProjectFormData): Promise<Project | null> {
    try {
      const creado = await firstValueFrom(
        this.api.crear(projectFormDataToCrearApi(data)),
      );
      const project = proyectoApiToProject(creado);
      this._projects.update((arr) => [project, ...arr]);
      return project;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async update(
    id: string,
    data: ProjectFormData,
  ): Promise<Project | null> {
    try {
      const actualizado = await firstValueFrom(
        this.api.actualizar(id, projectFormDataToCrearApi(data)),
      );
      const project = proyectoApiToProject(actualizado);
      this._projects.update((arr) =>
        arr.map((p) => (p.id === id ? project : p)),
      );
      return project;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return null;
    }
  }

  async deactivate(id: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.api.eliminar(id, "Baja desde panel de proyectos"),
      );
      this._projects.update((arr) =>
        arr.map((p) => (p.id === id ? { ...p, status: "inactive" } : p)),
      );
      return true;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return false;
    }
  }

  // --- helpers ---

  async getByIdFresh(id: string): Promise<Project | null> {
    try {
      const data = await firstValueFrom(this.api.buscarPorId(id));
      return proyectoApiToProject(data);
    } catch {
      return null;
    }
  }

  setStatusLocal(id: string, status: ProjectStatus): void {
    this._projects.update((arr) =>
      arr.map((p) => (p.id === id ? { ...p, status } : p)),
    );
  }

  // --- privados ---

}
