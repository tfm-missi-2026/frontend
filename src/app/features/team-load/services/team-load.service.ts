import { Injectable, computed, inject, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { UsersService } from "@features/users/services/users.service";

import type { ResourceWorkload } from "../models/resource-workload";
import { CargaApiService } from "./carga-api.service";
import { extractProblemMessage } from "@utils/problem-detail";

export interface ComputeWorkloadsOptions {
  fromIso: string;
  toIso: string;
  projectId?: string | null;
}

@Injectable({ providedIn: "root" })
export class TeamLoadService {
  private readonly cargaApi = inject(CargaApiService);
  private readonly usersService = inject(UsersService);

  private readonly _workloads = signal<ResourceWorkload[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly workloads = this._workloads.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._workloads().length);

  async computeWorkloads(
    opts: ComputeWorkloadsOptions,
  ): Promise<ResourceWorkload[]> {
    const { fromIso, toIso } = opts;
    this._loading.set(true);
    this._error.set(null);
    try {
      // Asegurar usuarios cargados para resolver nombres.
      if (this.usersService.count() === 0) {
        await this.usersService.cargar();
      }
      const data = await firstValueFrom(
        this.cargaApi.equipo(fromIso, toIso),
      );
      const users = this.usersService.users();
      const workloads: ResourceWorkload[] = data.map((c) => {
        const u = users.find((x) => x.id === c.usuarioId);
        const name = u
          ? `${u.firstName} ${u.lastNamePaternal} ${u.lastNameMaternal}`.trim()
          : c.usuarioId.slice(0, 8);
        return {
          resourceId: c.usuarioId,
          resourceName: name,
          resourceRole: "Recurso Técnico",
          plannedHours: c.horasPlanificadas,
          loggedHours: c.horasRegistradas,
          activeTaskCount: c.numeroTareasActivas,
          utilizationPct: c.porcentajeUtilizacion,
          hasPlan: c.horasPlanificadas > 0,
          isOverload: c.sobrecarga,
        };
      });
      this._workloads.set(workloads);
      return workloads;
    } catch (err) {
      this._error.set(extractProblemMessage(err));
      return [];
    } finally {
      this._loading.set(false);
    }
  }

}
