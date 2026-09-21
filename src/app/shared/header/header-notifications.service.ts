import { Injectable, computed, inject, signal } from "@angular/core";

import { AuthService } from "@core/auth/auth.service";
import { AreaDashboardService } from "@features/area-dashboard/services/area-dashboard.service";
import { ManagerDashboardService } from "@features/manager-dashboard/services/manager-dashboard.service";
import { ResourceDashboardService } from "@features/resource-dashboard/services/resource-dashboard.service";
import { DEFAULT_PERIOD_ID, DEFAULT_PERIODS } from "@shared/common";
import { formatShortDate } from "@utils/date";

import type {
  HeaderNotificationItem,
  HeaderNotificationStatus,
  HeaderNotificationViewAll,
} from "./header.types";

/**
 * `HeaderNotificationsService`
 * -----------------------------
 * Fuente de notificaciones del header. Deriva items accionables del
 * rol autenticado reutilizando los servicios de dashboard (misma
 * data, mismo cache con guards `count() === 0`): no duplica peticiones
 * si el usuario ya visito el dashboard de su rol.
 *
 * Por rol:
 *  - GESTOR_PROYECTO: variaciones por resolver, proyectos sin linea
 *    base y tareas proximas a vencer (dashboard del gestor).
 *  - JEFE_AREA: variaciones pendientes, recursos en sobrecarga y
 *    proyectos retrasados (dashboard del area).
 *  - ADMIN: vista global del area (mismas senales que el jefe).
 *  - RECURSO_TECNICO: horas de hoy sin registrar, sobrecarga propia
 *    y variaciones propias (dashboard del recurso).
 */
@Injectable({ providedIn: "root" })
export class HeaderNotificationsService {
  private readonly auth = inject(AuthService);
  private readonly managerDashboard = inject(ManagerDashboardService);
  private readonly areaDashboard = inject(AreaDashboardService);
  private readonly resourceDashboard = inject(ResourceDashboardService);

  private readonly _loading = signal(false);
  private readonly _loadedForUserId = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();

  private readonly period = computed(
    () =>
      DEFAULT_PERIODS.find((p) => p.id === DEFAULT_PERIOD_ID) ??
      DEFAULT_PERIODS[DEFAULT_PERIODS.length - 1],
  );

  /** Items de notificacion derivados del rol actual (max. 6). */
  readonly items = computed<HeaderNotificationItem[]>(() => {
    const usuario = this.auth.usuario();
    if (!usuario || this._loadedForUserId() !== usuario.id) return [];

    switch (usuario.rol.codigo) {
      case "GESTOR_PROYECTO":
        return this.managerItems(usuario.id);
      case "RECURSO_TECNICO":
        return this.resourceItems(usuario.id);
      case "JEFE_AREA":
      case "ADMIN":
        return this.areaItems();
      default:
        return [];
    }
  });

  /** `true` mientras haya items sin revisar (enciende el badge). */
  readonly notifying = computed<boolean>(() => this.items().length > 0);

  /** Destino del enlace "Ver todas" segun el rol. */
  readonly viewAll = computed<HeaderNotificationViewAll>(() => {
    const codigo = this.auth.usuario()?.rol?.codigo;
    switch (codigo) {
      case "GESTOR_PROYECTO":
        return { to: "/app/operacion/dashboard", label: "Ver mi dashboard" };
      case "JEFE_AREA":
        return {
          to: "/app/operacion/dashboard-jefe",
          label: "Ver mi dashboard",
        };
      case "ADMIN":
        return {
          to: "/app/operacion/dashboard-jefe",
          label: "Ver dashboard del área",
        };
      case "RECURSO_TECNICO":
        return {
          to: "/app/seguimiento/mi-bitacora",
          label: "Ver mi bitácora",
        };
      default:
        return { to: "/app", label: "Ver todas las notificaciones" };
    }
  });

  /**
   * Carga la data del dashboard del rol (una sola vez por usuario).
   * Idempotente: si el dashboard ya se cargo, los guards internos de
   * cada servicio evitan peticiones repetidas.
   */
  async cargar(): Promise<void> {
    const usuario = this.auth.usuario();
    if (!usuario || this._loading()) return;
    if (this._loadedForUserId() === usuario.id) return;
    this._loading.set(true);
    try {
      switch (usuario.rol.codigo) {
        case "GESTOR_PROYECTO":
          await this.managerDashboard.cargar();
          break;
        case "RECURSO_TECNICO":
          await this.resourceDashboard.cargar();
          break;
        case "JEFE_AREA":
        case "ADMIN":
          await this.areaDashboard.cargar();
          break;
      }
      this._loadedForUserId.set(usuario.id);
    } finally {
      this._loading.set(false);
    }
  }

  // ------------------------------------------------------------------
  // GESTOR_PROYECTO
  // ------------------------------------------------------------------
  private managerItems(managerId: string): HeaderNotificationItem[] {
    const firstName = this.auth.usuario()?.nombreCompleto.split(" ")[0] ?? "";
    const data = this.managerDashboard.computeDashboard(
      managerId,
      firstName,
      this.period(),
    );

    const variaciones: HeaderNotificationItem[] = data.pendingVariations.map(
      (v) =>
        this.buildItem({
          action: "tienes una variación por resolver en",
          target: `${v.ref} · ${v.taskName}`,
          category: "Variaciones",
          time: "pendiente",
          status: "busy",
          to: "/app/operacion/variaciones",
        }),
    );

    const sinLineaBase: HeaderNotificationItem[] = data.projects
      .filter((p) => !p.hasBaseline)
      .map((p) =>
        this.buildItem({
          action: "proyecto sin línea base congelada:",
          target: `${p.projectCode} · ${p.projectName}`,
          category: "Planificación",
          time: "revisa",
          status: "busy",
          to: "/app/operacion/planificacion",
        }),
      );

    const tareasProximas: HeaderNotificationItem[] = data.upcomingTasks
      .filter((t) => t.isSoon)
      .map((t) =>
        this.buildItem({
          action: "tarea próxima a vencer:",
          target: `${t.ref} · ${t.taskName}`,
          category: "Tareas",
          time: `vence ${formatShortDate(t.endDate)}`,
          status: "online",
          to: "/app/operacion/proyectos",
        }),
      );

    return [...variaciones, ...sinLineaBase, ...tareasProximas].slice(0, 6);
  }

  // ------------------------------------------------------------------
  // JEFE_AREA / ADMIN (vista global del area)
  // ------------------------------------------------------------------
  private areaItems(): HeaderNotificationItem[] {
    const usuario = this.auth.usuario();
    const firstName = usuario?.nombreCompleto.split(" ")[0] ?? "";
    const data = this.areaDashboard.computeDashboard(
      usuario?.id ?? "",
      firstName,
      this.period(),
    );

    const variaciones: HeaderNotificationItem[] = data.pendingVariations.map(
      (v) =>
        this.buildItem({
          action: "variación pendiente de aprobación en",
          target: `${v.ref} · ${v.taskName}`,
          category: "Variaciones",
          time: "pendiente",
          status: "busy",
          to: "/app/operacion/variaciones",
        }),
    );

    const sobrecargas: HeaderNotificationItem[] = data.teamWorkloads
      .filter((w) => w.utilizationPct > 100)
      .map((w) =>
        this.buildItem({
          action: "recurso en sobrecarga:",
          target: `${w.resourceName} (${w.utilizationPct}%)`,
          category: "Carga del equipo",
          time: "revisa",
          status: "busy",
          to: "/app/operacion/carga-equipo",
        }),
      );

    const retrasados: HeaderNotificationItem[] = data.projectsBreakdown
      .filter((p) => p.statusTag === "Retrasado")
      .map((p) =>
        this.buildItem({
          action: "proyecto retrasado:",
          target: `${p.code} · ${p.name}`,
          category: "Avance",
          time: "revisa",
          status: "busy",
          to: "/app/operacion/avance",
        }),
      );

    return [...variaciones, ...sobrecargas, ...retrasados].slice(0, 6);
  }

  // ------------------------------------------------------------------
  // RECURSO_TECNICO
  // ------------------------------------------------------------------
  private resourceItems(resourceId: string): HeaderNotificationItem[] {
    const data = this.resourceDashboard.computeDashboard(
      resourceId,
      this.period(),
    );

    const items: HeaderNotificationItem[] = [];

    if (data.todayTotalHours === 0) {
      items.push(
        this.buildItem({
          action: "aún no registras horas de hoy en",
          target: "tu bitácora",
          category: "Bitácora",
          time: "hoy",
          status: "busy",
          to: "/app/seguimiento/mi-bitacora",
        }),
      );
    }

    if (data.isOverload) {
      items.push(
        this.buildItem({
          action: "estás en sobrecarga:",
          target: `${data.utilizationPct}% de utilización`,
          category: "Mi carga",
          time: "revisa",
          status: "busy",
          to: "/app/seguimiento/mi-bitacora",
        }),
      );
    }

    for (const v of data.myVariations.slice(0, 3)) {
      items.push(
        this.buildItem({
          action: "tu variación reportada en",
          target: `${v.ref} · ${v.taskName}`,
          category: "Mis variaciones",
          time: "en revisión",
          status: "online",
          to: "/app/operacion/variaciones",
        }),
      );
    }

    return items.slice(0, 6);
  }

  private buildItem(fields: {
    action: string;
    target: string;
    category: string;
    time: string;
    status: HeaderNotificationStatus;
    to: string;
  }): HeaderNotificationItem {
    return {
      actor: { name: fields.category, avatar: "/images/user/owner.png" },
      action: fields.action,
      target: fields.target,
      category: fields.category,
      time: fields.time,
      status: fields.status,
      to: fields.to,
    };
  }
}
