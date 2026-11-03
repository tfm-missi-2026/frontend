import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import {
  CommonKpiCardComponent,
  CommonPeriodSelectorComponent,
  DEFAULT_PERIODS,
  DEFAULT_PERIOD_ID,
  type ManagerPeriod,
} from "@shared/common";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import { MyBitacoraComponent } from "../../components/my-bitacora/my-bitacora.component";
import { MyTasksListComponent } from "../../components/my-tasks-list/my-tasks-list.component";
import {
  ResourceDashboardService,
  type ResourceMyTask,
  type ResourceTaskNextSituation,
} from "../../services/resource-dashboard.service";
import { AuthService } from "@core/auth/auth.service";
import { ToastService } from "@core/http/toast.service";

@Component({
  selector: "ResourceDashboardPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    CommonKpiCardComponent,
    CommonPeriodSelectorComponent,
    MyBitacoraComponent,
    MyTasksListComponent,
    UiFlexComponent,
    UiGridComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./resource-dashboard-page.component.html",
})
export class ResourceDashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(ResourceDashboardService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    void this.dashboardService.cargar();
  }

  protected readonly periods = DEFAULT_PERIODS;
  protected readonly periodId = signal<string>(DEFAULT_PERIOD_ID);

  protected readonly currentPeriod = computed<ManagerPeriod>(
    () => this.periods.find((p) => p.id === this.periodId()) ?? this.periods[0],
  );

  protected readonly dashboard = computed(() =>
    this.dashboardService.computeDashboard(
      this.auth.usuario()?.id ?? "",
      this.currentPeriod(),
    ),
  );

  protected onPeriodChange(periodId: string): void {
    if (periodId) this.periodId.set(periodId);
  }

  protected readonly situationSaving = signal<boolean>(false);

  protected async onAdvanceTask(
    task: ResourceMyTask,
    situation: ResourceTaskNextSituation,
  ): Promise<void> {
    if (this.situationSaving()) return;
    this.situationSaving.set(true);
    try {
      const ok = await this.dashboardService.cambiarSituacion(
        task.assignmentId,
        situation,
      );
      if (ok) {
        this.toastService.success(
          `La tarea "${task.taskName}" se actualizó correctamente.`,
          "Situación actualizada",
        );
      } else {
        this.toastService.error(
          this.dashboardService.error() ?? "No se pudo actualizar la situación.",
          "Situación sin cambios",
        );
      }
    } finally {
      this.situationSaving.set(false);
    }
  }

  protected onRegisterBlock(): void {
    void this.router.navigate(["/app/seguimiento/mi-bitacora"]);
  }
}