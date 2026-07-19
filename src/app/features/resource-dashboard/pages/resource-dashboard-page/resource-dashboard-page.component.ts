import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
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
import { ResourceDashboardService } from "../../services/resource-dashboard.service";

const CURRENT_RESOURCE_ID = "u5";

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
export class ResourceDashboardPageComponent {
  private readonly dashboardService = inject(ResourceDashboardService);
  private readonly router = inject(Router);

  protected readonly periods = DEFAULT_PERIODS;
  protected readonly periodId = signal<string>(DEFAULT_PERIOD_ID);

  protected readonly currentPeriod = computed<ManagerPeriod>(
    () => this.periods.find((p) => p.id === this.periodId()) ?? this.periods[0],
  );

  protected readonly dashboard = computed(() =>
    this.dashboardService.computeDashboard(
      CURRENT_RESOURCE_ID,
      this.currentPeriod(),
    ),
  );

  protected onPeriodChange(periodId: string): void {
    if (periodId) this.periodId.set(periodId);
  }

  protected onKpiClick(path: string): void {
    void this.router.navigate([path]);
  }

  protected onRegisterBlock(): void {
    void this.router.navigate(["/app/seguimiento/mi-bitacora"]);
  }
}