import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import type { SelectOption } from "@shared/ui/select";

import { ProjectsService } from "@features/projects/services/projects.service";
import { formatDateRange, todayIso } from "@utils/date";

import {
  TeamLoadSummaryComponent,
} from "../../components/team-load-summary/team-load-summary.component";
import {
  TeamLoadTableComponent,
} from "../../components/team-load-table/team-load-table.component";
import {
  TeamLoadToolbarComponent,
} from "../../components/team-load-toolbar/team-load-toolbar.component";
import type { ResourceWorkload } from "../../models/resource-workload";
import { TeamLoadService } from "../../services/team-load.service";

const PROJECT_ALL_VALUE = "";

function mesActual(): { inicio: string; fin: string } {
  const [y, m] = todayIso().split("-").map(Number);
  const ultimoDia = new Date(y, m, 0).getDate();
  const mm = String(m).padStart(2, "0");
  return {
    inicio: `${y}-${mm}-01`,
    fin: `${y}-${mm}-${String(ultimoDia).padStart(2, "0")}`,
  };
}

@Component({
  selector: "TeamLoadListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    TeamLoadSummaryComponent,
    TeamLoadTableComponent,
    TeamLoadToolbarComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./team-load-list.component.html",
})
export class TeamLoadListComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly teamLoadService = inject(TeamLoadService);

  protected readonly breadcrumbItems = [
    { label: "Operación" },
    { label: "Carga del equipo" },
  ];

  protected readonly fromIso = signal<string>(mesActual().inicio);
  protected readonly toIso = signal<string>(mesActual().fin);
  protected readonly projectId = signal<string | null>(null);

  protected readonly projectOptions = computed<SelectOption[]>(() => {
    const opts: SelectOption[] = this.projectsService
      .projects()
      .filter((p) => p.status === "active")
      .map((p) => ({ value: p.id, label: `${p.code} · ${p.name}` }));
    opts.unshift({ value: PROJECT_ALL_VALUE, label: "Todos" });
    return opts;
  });

  // Carga async disparada por effect cuando cambian los filtros.
  protected readonly workloads = this.teamLoadService.workloads;

  ngOnInit(): void {
    void this.projectsService.cargar();
  }

  constructor() {
    effect(() => {
      // Re-leer filtros (no usamos el valor, solo dispara el effect).
      this.fromIso();
      this.toIso();
      this.projectId();
      void this.teamLoadService.computeWorkloads({
        fromIso: this.fromIso(),
        toIso: this.toIso(),
        projectId: this.projectId(),
      });
    });
  }

  protected readonly totalResources = computed<number>(
    () => this.workloads().length,
  );

  protected readonly overloadCount = computed<number>(() =>
    this.workloads().filter((w) => w.isOverload).length,
  );

  protected readonly averageUtilizationPct = computed<number>(() => {
    const withPlan = this.workloads().filter((w) => w.hasPlan);
    if (withPlan.length === 0) return 0;
    const sum = withPlan.reduce((acc, w) => acc + w.utilizationPct, 0);
    return Math.round(sum / withPlan.length);
  });

  protected readonly rangeLabel = computed<string>(
    () => formatDateRange(this.fromIso(), this.toIso()),
  );

  protected onFromChange(value: string): void {
    this.fromIso.set(value);
  }

  protected onToChange(value: string): void {
    this.toIso.set(value);
  }

  protected onProjectChange(value: string | null): void {
    this.projectId.set(value === PROJECT_ALL_VALUE ? null : value);
  }

  protected onConsult(): void {
    // El effect() detecta cambios via signals y dispara la consulta.
    // Solo necesitamos forzar un bump para re-disparar si el usuario
    // hace click sin haber cambiado ningun filtro.
    void this.teamLoadService.computeWorkloads({
      fromIso: this.fromIso(),
      toIso: this.toIso(),
      projectId: this.projectId(),
    });
  }
}
