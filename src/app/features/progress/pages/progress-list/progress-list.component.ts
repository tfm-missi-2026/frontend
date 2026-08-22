import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import type { SelectOption } from "@shared/ui/select";

import { ProjectsService } from "@features/projects/services/projects.service";

import {
  ProgressBaselineComponent,
} from "../../components/progress-baseline/progress-baseline.component";
import {
  ProgressTableComponent,
} from "../../components/progress-table/progress-table.component";
import {
  ProgressToolbarComponent,
} from "../../components/progress-toolbar/progress-toolbar.component";
import { ProgressService } from "../../services/progress.service";

@Component({
  selector: "ProgressListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    ProgressBaselineComponent,
    ProgressTableComponent,
    ProgressToolbarComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./progress-list.component.html",
})
export class ProgressListComponent {
  private readonly projectsService = inject(ProjectsService);
  private readonly progressService = inject(ProgressService);
  private readonly router = inject(Router);

  protected readonly breadcrumbItems = [
    { label: "Operación" },
    { label: "Avance" },
  ];

  protected readonly selectedProjectId = signal<string>("p-sigtramites");

  protected readonly projectOptions = computed<SelectOption[]>(() =>
    this.projectsService
      .projects()
      .filter((p) => p.status === "active")
      .map((p) => ({ value: p.id, label: `${p.code} · ${p.name}` })),
  );

  private readonly _progress = signal<
    import("../../models/project-progress").ProjectProgress
  >({
    projectId: "",
    hasBaseline: false,
    baselineLabel: "",
    baselineDate: "",
    estimatedHours: 0,
    loggedHours: 0,
    progressPct: 0,
    rows: [],
  });
  protected readonly progress = this._progress.asReadonly();

  constructor() {
    void this.projectsService.cargar();
    effect(() => {
      const id = this.selectedProjectId();
      if (!id) return;
      void this.progressService
        .refreshProjectProgress(id)
        .then((p) => this._progress.set(p))
        .catch(() => {
          // El error interceptor ya muestra el toast.
        });
    });
  }

  protected readonly totalDeviationHours = computed<number>(() =>
    this.progress().rows.reduce((acc, r) => acc + r.deviationHours, 0),
  );

  protected readonly totalLabel = computed<string>(() => {
    const p = this.progress();
    const dev = this.totalDeviationHours();
    const sign = dev > 0 ? "+" : "";
    return `${p.loggedHours} / ${p.estimatedHours} h · ${sign}${dev} h`;
  });

  protected onProjectChange(value: string | null): void {
    if (value) this.selectedProjectId.set(value);
  }

  protected onGoToPlanning(): void {
    void this.router.navigate(["/app/operacion/planificacion"]);
  }
}
