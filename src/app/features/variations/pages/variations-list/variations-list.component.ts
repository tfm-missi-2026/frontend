import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { IconPlusSimpleComponent } from "@shared/icons";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import { ProjectsMockService } from "@features/projects/services/projects-mock.service";
import { SubprojectsMockService } from "@features/projects/services/subprojects-mock.service";
import { TasksMockService } from "@features/projects/services/tasks-mock.service";

import {
  VariationsToolbarComponent,
} from "../../components/variations-toolbar/variations-toolbar.component";
import {
  VariationsTableComponent,
  type VariationRowViewModel,
} from "../../components/variations-table/variations-table.component";
import {
  ReportVariationModalComponent,
  type TargetOption,
} from "../../components/report-variation-modal/report-variation-modal.component";
import {
  ResolveVariationModalComponent,
  type ResolveMode,
} from "../../components/resolve-variation-modal/resolve-variation-modal.component";
import type {
  ReportVariationPayload,
  ResolveVariationPayload,
} from "../../models/variation-form";
import {
  VARIATION_STATUS_FILTER_OPTIONS,
  VARIATION_TYPE_FILTER_OPTIONS,
  type Variation,
  type VariationStatus,
  type VariationType,
} from "../../models/variation";
import { VariationsMockService } from "../../services/variations-mock.service";

const CURRENT_REPORTER = "Lucía Fernández Torres";
const CURRENT_RESOLVER = "Ricardo Salazar Núñez";

@Component({
  selector: "VariationsListPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    ReportVariationModalComponent,
    ResolveVariationModalComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
    VariationsTableComponent,
    VariationsToolbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./variations-list.component.html",
})
export class VariationsListComponent {
  private readonly projectsService = inject(ProjectsMockService);
  private readonly subprojectsService = inject(SubprojectsMockService);
  private readonly tasksService = inject(TasksMockService);
  private readonly variationsService = inject(VariationsMockService);

  protected readonly IconPlusSimpleComponent = IconPlusSimpleComponent;

  protected readonly VARIATION_TYPE_FILTER_OPTIONS =
    VARIATION_TYPE_FILTER_OPTIONS;
  protected readonly VARIATION_STATUS_FILTER_OPTIONS =
    VARIATION_STATUS_FILTER_OPTIONS;

  protected readonly breadcrumbItems = [
    { label: "Operación" },
    { label: "Variaciones" },
  ];

  protected readonly searchTerm = signal<string>("");
  protected readonly filterType = signal<VariationType | null>(null);
  protected readonly filterStatus = signal<VariationStatus | null>(null);

  protected readonly reportOpen = signal<boolean>(false);
  protected readonly resolveOpen = signal<boolean>(false);
  protected readonly resolveMode = signal<ResolveMode>("resolve");
  protected readonly selectedVariation = signal<Variation | null>(null);

  protected readonly targetOptions = computed<TargetOption[]>(() => {
    const activeProjects = this.projectsService
      .projects()
      .filter((p) => p.status === "active");
    const projectIds = activeProjects.map((p) => p.id);
    const subprojects = this.subprojectsService
      .subs()
      .filter((s) => s.active && projectIds.includes(s.projectId));
    const tasks = this.tasksService
      .tasks()
      .filter((t) => t.active && subprojects.some((s) => s.id === t.subprojectId));

    const subOpts: TargetOption[] = subprojects.map((s) => ({
      raw: {
        kind: "subproject" as const,
        subprojectId: s.id,
        label: `${s.type} ${s.ticket ?? s.id}`,
        ref: s.ticket ? `#${s.ticket}` : null,
      },
      label: `(Subproyecto) ${s.type} · #${s.ticket ?? s.id}`,
    }));

    const taskOpts: TargetOption[] = tasks.map((t) => {
      const sub = subprojects.find((s) => s.id === t.subprojectId);
      const ref = sub?.ticket ? `#${sub.ticket}` : null;
      return {
        raw: {
          kind: "task" as const,
          taskId: t.id,
          label: t.name,
          ref,
        },
        label: `${t.name}${ref ? " · " + ref : ""}`,
      };
    });

    return [...taskOpts, ...subOpts];
  });

  protected readonly rows = computed<VariationRowViewModel[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const type = this.filterType();
    const status = this.filterStatus();

    return this.variationsService
      .items()
      .filter((v) => {
        if (type && v.type !== type) return false;
        if (status && v.status !== status) return false;
        if (!term) return true;
        const haystack = [
          v.target?.label ?? "",
          v.target?.ref ?? "",
          v.description,
          v.justification,
          v.reportedBy,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .map((v) => ({
        ...v,
        targetLabel: v.target?.label ?? "(sin tarea específica)",
        targetRef: v.target?.ref ?? null,
      }));
  });

  protected readonly pendingCount = computed<number>(
    () => this.variationsService.countByStatus().Pendiente,
  );

  protected readonly approvedCount = computed<number>(
    () => this.variationsService.countByStatus().Aprobada,
  );

  protected readonly rejectedCount = computed<number>(
    () => this.variationsService.countByStatus().Rechazada,
  );

  protected openReport(): void {
    this.reportOpen.set(true);
  }

  protected onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  protected onTypeFilterChange(value: string | null): void {
    this.filterType.set(value as VariationType | null);
  }

  protected onStatusFilterChange(value: string | null): void {
    this.filterStatus.set(value as VariationStatus | null);
  }

  protected onView(v: Variation): void {
    this.selectedVariation.set(v);
    this.resolveMode.set("view");
    this.resolveOpen.set(true);
  }

  protected onResolve(v: Variation): void {
    if (v.status !== "Pendiente") return;
    this.selectedVariation.set(v);
    this.resolveMode.set("resolve");
    this.resolveOpen.set(true);
  }

  protected onReportSubmit(payload: ReportVariationPayload): void {
    this.variationsService.create(payload.reportedBy || CURRENT_REPORTER, payload.data);
    this.reportOpen.set(false);
  }

  protected onResolveSubmit(payload: ResolveVariationPayload): void {
    this.variationsService.resolve(payload.id, payload);
    this.resolveOpen.set(false);
    this.selectedVariation.set(null);
  }

  protected closeReport(): void {
    this.reportOpen.set(false);
  }

  protected closeResolve(): void {
    this.resolveOpen.set(false);
    this.selectedVariation.set(null);
  }

  protected readonly currentReporter = CURRENT_REPORTER;
  protected readonly currentResolver = CURRENT_RESOLVER;
}
