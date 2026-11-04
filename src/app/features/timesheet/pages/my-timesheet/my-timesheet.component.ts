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
import type { TaskSituation } from "@features/projects/models/task";
import { SubprojectsService } from "@features/projects/services/subprojects.service";
import { TasksService } from "@features/projects/services/tasks.service";
import { ResourceDashboardService } from "@features/resource-dashboard/services/resource-dashboard.service";
import { IconPlusSimpleComponent } from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";

import {
  EntryFormModalComponent,
  type EntryFormPayload,
} from "../../components/entry-form-modal/entry-form-modal.component";
import { TimesheetTimelineComponent } from "../../components/timesheet-timeline/timesheet-timeline.component";
import {
  TimesheetMonthCalendarComponent,
  type TimesheetPlannedTask,
} from "../../components/timesheet-month-calendar/timesheet-month-calendar.component";
import {
  TimesheetToolbarComponent,
  type TimesheetLoggedDay,
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
    TimesheetMonthCalendarComponent,
    TimesheetTimelineComponent,
    TimesheetToolbarComponent,
    UiAlertComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiModalComponent,
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
  private readonly resourceDashboardService = inject(ResourceDashboardService);

  protected readonly taskSituations = computed(() => {
    const usuarioId = this.auth.usuario()?.id;
    const tasks = this.tasksService.tasks();
    const situations = new Map<string, TaskSituation>();
    for (const a of this.assignmentsService.assignments()) {
      if (!a.active || a.resourceId !== usuarioId) continue;
      const tarea = tasks.find((t) => t.id === a.taskId);
      if (tarea) situations.set(a.id, tarea.situation);
    }
    return situations;
  });

  protected readonly taskOptions = computed<SelectOption[]>(() => {
    const usuarioId = this.auth.usuario()?.id;
    if (!usuarioId) return [];
    const tasks = this.tasksService.tasks();
    const subs = this.subprojectsService.subs();
    const situations = this.taskSituations();
    return this.assignmentsService
      .assignments()
      .filter((a) => a.active && a.resourceId === usuarioId)
      .map((a) => {
        const tarea = tasks.find((t) => t.id === a.taskId);
        const sub = tarea
          ? subs.find((x) => x.id === tarea.subprojectId)
          : undefined;
        const nombre = tarea?.name ?? "Tarea sin nombre";
        const label = sub ? `${sub.description} · ${nombre}` : nombre;
        return {
          value: a.id,
          label:
            situations.get(a.id) === "Culminado"
              ? `${label} (Culminada)`
              : label,
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

  protected readonly entries = this.timesheetService.entries;

  protected readonly plannedTasks = computed<TimesheetPlannedTask[]>(() => {
    const usuarioId = this.auth.usuario()?.id;
    const tasks = this.tasksService.tasks();
    const situations = this.taskSituations();
    return this.assignmentsService
      .assignments()
      .filter((a) => a.active && a.resourceId === usuarioId)
      .map((a) => ({
        id: a.id,
        name: tasks.find((t) => t.id === a.taskId)?.name ?? "Tarea",
        startDate: a.startDate,
        endDate: a.endDate,
        plannedHours: a.plannedHours,
        culminated: situations.get(a.id) === "Culminado",
      }));
  });

  protected readonly loggedDays = computed(() => {
    const days = new Map<string, TimesheetLoggedDay>();
    for (const e of this.entries()) {
      const day = days.get(e.date) ?? { blocks: 0, hours: 0 };
      days.set(e.date, {
        blocks: day.blocks + 1,
        hours: Math.round((day.hours + e.hours) * 100) / 100,
      });
    }
    return days;
  });

  protected readonly visibleEntries = computed<TimesheetEntry[]>(() => {
    const d = this.date();
    return this.entries().filter((e) => e.date === d);
  });

  protected readonly timelineHeading = computed<string>(() => {
    const d = parseTimesheetIsoDate(this.date());
    const day = d ? TIMESHEET_DAY_NAMES[d.getDay()] : "";
    const iso = this.date();
    const [y, m, dd] = iso.split("-");
    const pretty = dd && m && y ? `${dd}/${m}/${y}` : iso;
    return day
      ? `Bloques del día · ${pretty} · ${day}`
      : `Bloques del día · ${pretty}`;
  });

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedEntry = signal<TimesheetEntry | null>(null);

  protected readonly showAlert = signal<string | null>(null);

  protected onModeChange(m: TimesheetViewMode): void {
    this.mode.set(m);
  }

  protected onDateChange(iso: string): void {
    if (iso) this.date.set(iso);
  }

  protected onCalendarDayClick(iso: string): void {
    this.mode.set("day");
    this.date.set(iso);
    this.openCreate();
  }

  protected onCalendarEntryClick(entry: TimesheetEntry): void {
    this.mode.set("day");
    this.date.set(entry.date);
    this.openEdit(entry);
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
    const previousActivityId = payload.id
      ? this.entries().find((e) => e.id === payload.id)?.activityId
      : undefined;
    const data = await this.resolverActividad(payload.data, previousActivityId);
    if (!data) return;
    if (payload.mode === "create") {
      const created = await this.timesheetService.create(data);
      if (created) {
        const finished = await this.actualizarSituacion(data, payload.finishTask);
        this.flashAlert(
          finished
            ? "Bloque registrado y tarea culminada."
            : "Bloque registrado correctamente.",
        );
      }
    } else if (payload.id) {
      const updated = await this.timesheetService.update(payload.id, data);
      if (updated) {
        if (previousActivityId && data.kind === "task") {
          await this.actividadesService.eliminar(
            previousActivityId,
            "El bloque de bitacora paso a ser de tarea",
          );
        }
        const finished = await this.actualizarSituacion(data, payload.finishTask);
        this.flashAlert(
          finished
            ? "Bloque actualizado y tarea culminada."
            : "Bloque actualizado correctamente.",
        );
      }
    }
    this.formOpen.set(false);
  }

  private async actualizarSituacion(
    data: EntryFormPayload["data"],
    finishTask: boolean,
  ): Promise<boolean> {
    if (data.kind !== "task" || !data.task) return false;
    const situation = this.taskSituations().get(data.task);
    if (situation === "Pendiente") {
      const started = await this.resourceDashboardService.cambiarSituacion(
        data.task,
        "En atencion",
      );
      if (!started) return false;
    }
    if (!finishTask || situation === "Culminado") return false;
    return this.resourceDashboardService.cambiarSituacion(data.task, "Culminado");
  }

  private async resolverActividad(
    data: EntryFormPayload["data"],
    previousActivityId?: string,
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
    const previa = previousActivityId
      ? this.actividadesService.buscarPorId(previousActivityId)
      : undefined;
    const body = {
      tipoActividadId: tipo.id,
      modalidadId: previa?.modalidadId ?? modalidad.id,
      titulo: titulo.slice(0, 200),
      descripcion: data.description.trim() || null,
      fecha: data.date,
      horaInicio: data.startTime,
      horaFin: data.endTime,
      organizadorId: previa?.organizadorId ?? organizadorId,
    };
    const guardada = previa
      ? await this.actividadesService.actualizar(previa.id, body)
      : await this.actividadesService.crear(body);
    if (!guardada) return null;
    return { ...data, activity: guardada.titulo, activityId: guardada.id };
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