import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";
import type { SelectOption } from "@shared/ui/select";

import { ProjectsMockService } from "@features/projects/services/projects-mock.service";

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

function formatShortDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
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
export class TeamLoadListComponent {
  private readonly projectsService = inject(ProjectsMockService);
  private readonly teamLoadService = inject(TeamLoadService);

  protected readonly breadcrumbItems = [
    { label: "Operación" },
    { label: "Carga del equipo" },
  ];

  protected readonly fromIso = signal<string>("2026-05-01");
  protected readonly toIso = signal<string>("2026-05-31");
  protected readonly projectId = signal<string | null>(null);
  protected readonly queryCounter = signal<number>(0);

  protected readonly projectOptions = computed<SelectOption[]>(() => {
    const opts: SelectOption[] = this.projectsService
      .projects()
      .filter((p) => p.status === "active")
      .map((p) => ({ value: p.id, label: `${p.code} · ${p.name}` }));
    opts.unshift({ value: PROJECT_ALL_VALUE, label: "Todos" });
    return opts;
  });

  protected readonly workloads = computed<ResourceWorkload[]>(() => {
    this.queryCounter();
    return this.teamLoadService.computeWorkloads({
      fromIso: this.fromIso(),
      toIso: this.toIso(),
      projectId: this.projectId(),
    });
  });

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
    () =>
      `${formatShortDate(this.fromIso())} – ${formatShortDate(this.toIso())}`,
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
    this.queryCounter.update((n) => n + 1);
  }
}
