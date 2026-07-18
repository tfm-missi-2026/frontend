import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import {
  CommonKpiCardComponent,
  CommonPeriodSelectorComponent,
  DEFAULT_PERIODS,
  DEFAULT_PERIOD_ID,
  type ManagerPeriod,
} from "@shared/common";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import { AreaAlertsComponent } from "../../components/area-alerts/area-alerts.component";
import { AreaLoadChartComponent } from "../../components/area-load-chart/area-load-chart.component";
import { AreaDashboardService } from "../../services/area-dashboard.service";

@Component({
  selector: "AreaDashboardPage",
  standalone: true,
  imports: [
    AreaAlertsComponent,
    AreaLoadChartComponent,
    CommonBreadcrumbComponent,
    CommonKpiCardComponent,
    CommonPeriodSelectorComponent,
    UiBadgeComponent,
    UiFlexComponent,
    UiGridComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./area-dashboard-page.component.html",
})
export class AreaDashboardPageComponent {
  private readonly dashboardService = inject(AreaDashboardService);
  private readonly router = inject(Router);

  protected readonly periods = DEFAULT_PERIODS;
  protected readonly periodId = signal<string>(DEFAULT_PERIOD_ID);

  protected readonly currentPeriod = computed<ManagerPeriod>(
    () => this.periods.find((p) => p.id === this.periodId()) ?? this.periods[0],
  );

  protected readonly dashboard = computed(() =>
    this.dashboardService.computeDashboard(this.currentPeriod()),
  );

  protected onPeriodChange(periodId: string): void {
    if (periodId) this.periodId.set(periodId);
  }

  protected overloadsList = computed(() =>
    this.dashboard().teamWorkloads.filter((w) => w.utilizationPct > 100),
  );

  protected onKpiClick(path: string): void {
    void this.router.navigate([path]);
  }
}
