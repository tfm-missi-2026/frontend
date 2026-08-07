import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "@core/auth/auth.service";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import {
  CommonKpiCardComponent,
  CommonPeriodSelectorComponent,
  DEFAULT_PERIODS,
  DEFAULT_PERIOD_ID,
  type ManagerPeriod,
} from "@shared/common";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import {
  ManagerProjectsListComponent,
} from "../../components/manager-projects-list/manager-projects-list.component";
import {
  ManagerTodoComponent,
} from "../../components/manager-todo/manager-todo.component";
import { ManagerDashboardService } from "../../services/manager-dashboard.service";

@Component({
  selector: "ManagerDashboardPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    CommonKpiCardComponent,
    CommonPeriodSelectorComponent,
    ManagerProjectsListComponent,
    ManagerTodoComponent,
    UiFlexComponent,
    UiGridComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./manager-dashboard-page.component.html",
})
export class ManagerDashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(ManagerDashboardService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    void this.dashboardService.cargar();
  }

  protected readonly periods = DEFAULT_PERIODS;
  protected readonly periodId = signal<string>(DEFAULT_PERIOD_ID);

  protected readonly currentPeriod = computed<ManagerPeriod>(
    () => this.periods.find((p) => p.id === this.periodId()) ?? this.periods[0],
  );

  protected readonly dashboard = computed(() => {
    const u = this.auth.usuario();
    const firstName = u?.nombreCompleto?.split(" ")[0] ?? "";
    return this.dashboardService.computeDashboard(
      u?.id ?? "",
      firstName,
      this.currentPeriod(),
    );
  });

  protected onPeriodChange(periodId: string): void {
    if (periodId) this.periodId.set(periodId);
  }

  protected onKpiClick(path: string): void {
    void this.router.navigate([path]);
  }
}
