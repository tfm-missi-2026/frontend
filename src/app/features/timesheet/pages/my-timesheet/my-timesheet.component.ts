import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { AuthService } from "@core/auth/auth.service";
import { CatalogService } from "@features/catalog/services/catalog.service";
import { AssignmentsService } from "@features/planning/services/assignments.service";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { IconPlusSimpleComponent } from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import {
  EntryFormModalComponent,
  type EntryFormPayload,
} from "../../components/entry-form-modal/entry-form-modal.component";
import { TimesheetTimelineComponent } from "../../components/timesheet-timeline/timesheet-timeline.component";
import {
  TimesheetToolbarComponent,
  type TimesheetViewMode,
  parseTimesheetIsoDate,
  TIMESHEET_DAY_NAMES,
} from "../../components/timesheet-toolbar/timesheet-toolbar.component";
import type { SelectOption } from "@shared/ui/select";

import type { TimesheetEntry } from "../../models/timesheet-entry";
import { ActividadesService } from "../../services/timesheet-actividades.service";
import { TIMESHEET_INITIAL_DATE, TimesheetService } from "../../services/timesheet.service";

@Component({
  selector: "MyTimesheetPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    EntryFormModalComponent,
    TimesheetTimelineComponent,
    TimesheetToolbarComponent,
    UiAlertComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./my-timesheet.component.html",
})
export class MyTimesheetComponent implements OnInit {
  private readonly timesheetService = inject(TimesheetService);
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly tasksService = inject(TasksService);
  private readonly subprojectsService = inject(SubprojectsService);
  private readonly actividadesService = inject(ActividadesService);
  private readonly catalogService = inject(CatalogService);
  private readonly auth = inject(AuthService);

  protected readonly taskOptions = computed<SelectOption[]>(() => {
    const usuarioId = this.auth.usuario()?.id;
    if (!usuarioId) return [];
    const tasks = this.tasksService.tasks();
    const subs = this.subprojectsService.subs();
    return this.assignmentsService
      .assignments()
      .filter((a) => a.active && a.resourceId === usuarioId)
      .map((a) => {
        const tarea = tasks.find((t) => t.id === a.taskId);
        const sub = tarea
          ? subs.find((x) => x.id === tarea.subprojectId)
          : undefined;
        const nombre = tarea?.name ?? "Tarea sin nombre";
        return {
          value: a.id,
          label: sub ? `${sub.description} · ${nombre}` : nombre,
        };
      });
  });

  protected readonly activityTypeOptions = computed<SelectOption[]>(() =>
    this.catalogService
      .items()
      .filter((c) => c.groupCode === "TACT" && c.status === "Activo")
      .map((c) => ({ value: c.id, label: c.name })),
  );

  ngOnInit(): void {
    void this.timesheetService.cargar();
    void this.actividadesService.cargar();
    void this.catalogService.cargar();
    void this.subprojectsService.cargar();
    void this.tasksService.cargar();
    void this.assignmentsService.cargar();
  }

  protected readonly IconPlusSimpleComponent = IconPlusSimpleComponent;

  protected readonly breadcrumbItems = [
    { label: "Seguimiento" },
    { label: "Mi bitácora" },
  ];

  protected readonly mode = signal<TimesheetViewMode>("day");
  protected readonly date = signal<string>(TIMESHEET_INITIAL_DATE);
  protected readonly range = signal<string[]>([]);

  protected readonly entries = this.timesheetService.entries;

  protected readonly visibleEntries = computed<TimesheetEntry[]>(() => {
    const all = this.entries();
    if (this.mode() === "day") {
      const d = this.date();
      return all.filter((e) => e.date === d);
    }
    const r = this.range();
    if (r.length < 2) return all;
    const [from, to] = [r[0], r[r.length - 1]];
    return all.filter((e) => e.date >= from && e.date <= to);
  });

  protected readonly timelineHeading = computed<string>(() => {
    if (this.mode() === "day") {
      const d = parseTimesheetIsoDate(this.date());
      const day = d ? TIMESHEET_DAY_NAMES[d.getDay()] : "";
      const iso = this.date();
      const [y, m, dd] = iso.split("-");
      const pretty = dd && m && y ? `${dd}/${m}/${y}` : iso;
      return day
        ? `Bloques del día · ${pretty} · ${day}`
        : `Bloques del día · ${pretty}`;
    }
    const r = this.range();
    if (!r || r.length === 0) return "Bloques del rango";
    const [from, to] = [r[0], r[r.length - 1]];
    const pretty = (iso: string): string => {
      const [y, m, dd] = iso.split("-");
      return dd && m && y ? `${dd}/${m}/${y}` : iso;
    };
    return `Bloques del rango · ${pretty(from)} – ${pretty(to)}`;
  });

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedEntry = signal<TimesheetEntry | null>(null);

  protected readonly showAlert = signal<string | null>(null);

  protected onModeChange(m: TimesheetViewMode): void {
    if (m === "range" && this.range().length === 0) {
      const d = this.date();
      this.range.set([d, d]);
    }
    this.mode.set(m);
  }

  protected onDateChange(iso: string): void {
    if (iso) this.date.set(iso);
  }

  protected onRangeChange(r: string[]): void {
    this.range.set(r);
  }

  protected openCreate(): void {
    this.formMode.set("create");
    this.selectedEntry.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(entry: TimesheetEntry): void {
    this.formMode.set("edit");
    this.selectedEntry.set(entry);
    this.formOpen.set(true);
  }

  protected readonly formSaving = signal<boolean>(false);

  protected async onSaveEntry(payload: EntryFormPayload): Promise<void> {
    if (this.formSaving()) return;
    this.formSaving.set(true);
    try {
      await this.guardarEntrada(payload);
    } finally {
      this.formSaving.set(false);
    }
  }

  private async guardarEntrada(payload: EntryFormPayload): Promise<void> {
    const data = await this.resolverActividad(payload.data);
    if (!data) return;
    if (payload.mode === "create") {
      const created = await this.timesheetService.create(data);
      if (created) this.flashAlert("Bloque registrado correctamente.");
    } else if (payload.id) {
      const updated = await this.timesheetService.update(payload.id, data);
      if (updated) this.flashAlert("Bloque actualizado correctamente.");
    }
    this.formOpen.set(false);
  }

  private async resolverActividad(
    data: EntryFormPayload["data"],
  ): Promise<EntryFormPayload["data"] | null> {
    if (data.kind !== "activity") return data;

    const tipo = this.catalogService
      .items()
      .find((c) => c.id === data.activityTypeId);
    const organizadorId = this.auth.usuario()?.id;
    const modalidad = this.catalogService
      .items()
      .find((c) => c.groupCode === "MOD" && c.status === "Activo");
    if (!tipo || !organizadorId || !modalidad) return null;

    const titulo = data.description.trim() || tipo.name;
    const creada = await this.actividadesService.crear({
      tipoActividadId: tipo.id,
      modalidadId: modalidad.id,
      titulo: titulo.slice(0, 200),
      descripcion: data.description.trim() || null,
      fecha: data.date,
      horaInicio: data.startTime,
      horaFin: data.endTime,
      organizadorId,
    });
    if (!creada) return null;
    return { ...data, activity: creada.id };
  }

  protected async onDeleteEntry(entry: TimesheetEntry): Promise<void> {
    const ok = await this.timesheetService.remove(entry.id);
    if (ok) this.flashAlert("Bloque eliminado.");
  }

  private flashAlert(message: string): void {
    this.showAlert.set(message);
    setTimeout(() => this.showAlert.set(null), 3000);
  }
}