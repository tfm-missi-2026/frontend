import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";

import {
  IconEditPencilComponent,
  IconPlusSimpleComponent,
  IconTrashComponent,
} from "@shared/icons";
import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiCardComponent } from "@shared/ui/card";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiTableComponent } from "@shared/ui/table";
import type { TableAction, TableColumn } from "@shared/ui/table";

import {
  EntryFormModalComponent,
  type EntryFormPayload,
} from "../../components/entry-form-modal/entry-form-modal.component";
import { TimesheetSummaryComponent } from "../../components/timesheet-summary/timesheet-summary.component";
import {
  TimesheetToolbarComponent,
  type TimesheetViewMode,
} from "../../components/timesheet-toolbar/timesheet-toolbar.component";
import {
  TIMESHEET_ENTRY_STATUS_LABELS,
  TIMESHEET_PROJECTS,
  TIMESHEET_TASKS,
} from "../../models/timesheet-entry";
import type { TimesheetEntry } from "../../models/timesheet-entry";
import { TimesheetMockService } from "../../services/timesheet-mock.service";

interface EntryRow extends TimesheetEntry {
  projectLabel: string;
  taskLabel: string;
  kindLabel: string;
  statusLabel: string;
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

@Component({
  selector: "MyTimesheetPage",
  standalone: true,
  imports: [
    CommonBreadcrumbComponent,
    EntryFormModalComponent,
    TimesheetSummaryComponent,
    TimesheetToolbarComponent,
    UiAlertComponent,
    UiButtonComponent,
    UiCardComponent,
    UiFlexComponent,
    UiGridComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex direction="column" [gap]="20">
      <CommonBreadcrumb [items]="breadcrumbItems" />

      <UiFlex
        direction="row"
        alignItems="end"
        justifyContent="between"
        [gap]="12"
      >
        <UiFlex direction="column" [gap]="0">
          <UiHeader [level]="1" text="Mi bitácora" />
          <UiLabel type="bodyS" color="textWeak" className="mt-1 max-w-200">
            Registra tu dedicación real en bloques de tiempo. Cada bloque es
            trabajo en una tarea o participación en una actividad — nunca ambos.
          </UiLabel>
        </UiFlex>
        <UiButton
          variant="primary"
          [LeftIcon]="plusIcon"
          labelText="Registrar bloque"
          (click)="openCreate()"
        />
      </UiFlex>

      <TimesheetToolbar
        [mode]="mode()"
        [date]="date()"
        [range]="range()"
        (modeChange)="onModeChange($event)"
        (dateChange)="onDateChange($event)"
        (rangeChange)="onRangeChange($event)"
      />

      @if (showAlert(); as msg) {
        <UiAlert variant="success" [message]="msg" />
      }

      <UiGrid [columns]="2" gap="gap-5" className="items-stretch">
        <TimesheetSummary [entries]="visibleEntries()" />
        <UiCard padding="md">
          <UiFlex direction="column" [gap]="6">
            <UiLabel
              type="bodyXs"
              weight="medium"
              color="textWeak"
              className="uppercase"
            >
              {{ headerLabel() }}
            </UiLabel>
            <UiLabel type="HeadingM" weight="bold" color="textStrong">
              {{ visibleEntries().length }} bloque{{
                visibleEntries().length === 1 ? "" : "s"
              }}
            </UiLabel>
            <UiLabel type="bodyS" color="textWeak">
              {{ headerSubtitle() }}
            </UiLabel>
          </UiFlex>
        </UiCard>
      </UiGrid>

      @if (visibleEntries().length === 0) {
        <UiCard padding="lg" className="text-center">
          <UiFlex direction="column" alignItems="center" [gap]="12">
            <UiFlex
              direction="row"
              alignItems="center"
              justifyContent="center"
              [gap]="0"
              className="h-14 w-14 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <UiLabel type="HeadingL" color="textWeak">∅</UiLabel>
            </UiFlex>
            <UiHeader [level]="4" text="No registraste bloques este día." />
            <UiLabel type="bodyS" color="textWeak">
              Pulsa “Registrar bloque” para empezar.
            </UiLabel>
            <UiButton
              variant="primary"
              [LeftIcon]="plusIcon"
              labelText="Registrar bloque"
              (click)="openCreate()"
            />
          </UiFlex>
        </UiCard>
      } @else {
        <UiTable
          [data]="rows()"
          [columns]="columns"
          [actions]="rowActions"
          [searchable]="false"
          [paginated]="false"
          [hasActions]="true"
          emptyText="No hay entradas para este día."
        />
      }

      <UiCard padding="sm" className="bg-gray-50 dark:bg-white/3">
        <UiLabel type="bodyS" color="textWeak">
          Un bloque vincula a una tarea (vía tu asignación) o a una actividad
          (reunión, capacitación, soporte), nunca a las dos. La suma de bloques
          alimenta tus horas registradas en Carga del equipo.
        </UiLabel>
      </UiCard>
    </UiFlex>

    <EntryFormModal
      [isOpen]="formOpen()"
      [mode]="formMode()"
      [entry]="selectedEntry()"
      [defaultDate]="date()"
      (save)="onSaveEntry($event)"
      (close)="formOpen.set(false)"
    />
  `,
})
export class MyTimesheetComponent {
  private readonly timesheetService = inject(TimesheetMockService);

  protected readonly plusIcon = IconPlusSimpleComponent;
  protected readonly editIcon = IconEditPencilComponent;
  protected readonly trashIcon = IconTrashComponent;

  protected readonly breadcrumbItems = [
    { label: "Seguimiento" },
    { label: "Mi bitácora" },
  ];

  protected readonly columns: TableColumn<EntryRow>[] = [
    {
      key: "startTime",
      header: "Inicio",
      width: "80px",
      cellClassName: "font-mono",
    },
    {
      key: "endTime",
      header: "Fin",
      width: "80px",
      cellClassName: "font-mono",
    },
    {
      key: "kindLabel",
      header: "Tipo",
      width: "100px",
    },
    {
      key: "projectLabel",
      header: "Proyecto",
      width: "140px",
    },
    {
      key: "taskLabel",
      header: "Tarea / Actividad",
    },
    {
      key: "hours",
      header: "Horas",
      align: "end",
      width: "80px",
    },
    {
      key: "statusLabel",
      header: "Estado",
      width: "120px",
    },
  ];

  protected readonly rowActions: TableAction<unknown>[] = [
    {
      key: "edit",
      label: "Editar bloque",
      icon: IconEditPencilComponent,
      onClick: (row) => this.onActionEdit(row as EntryRow),
    },
    {
      key: "delete",
      label: "Eliminar bloque",
      icon: IconTrashComponent,
      onClick: (row) => this.onActionDelete(row as EntryRow),
    },
  ];

  protected readonly mode = signal<TimesheetViewMode>("day");
  protected readonly date = signal<string>(todayIso());
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

  protected readonly rows = computed<EntryRow[]>(() =>
    this.visibleEntries().map((e) => {
      const project = TIMESHEET_PROJECTS.find((p) => p.id === e.project);
      const task = TIMESHEET_TASKS.find((t) => t.id === e.task);
      const projectLabel = project?.code ?? "—";
      const taskLabel =
        e.kind === "task"
          ? task
            ? `${task.name} · ${task.code}`
            : "Tarea sin asignar"
          : (e.activity ?? "Actividad");
      return {
        ...e,
        projectLabel,
        taskLabel,
        kindLabel: e.kind === "task" ? "Tarea" : "Actividad",
        statusLabel: TIMESHEET_ENTRY_STATUS_LABELS[e.status],
      };
    }),
  );

  protected readonly formOpen = signal<boolean>(false);
  protected readonly formMode = signal<"create" | "edit">("create");
  protected readonly selectedEntry = signal<TimesheetEntry | null>(null);

  protected readonly showAlert = signal<string | null>(null);

  protected readonly headerLabel = computed<string>(() =>
    this.mode() === "day" ? "Bloques del día" : "Bloques del rango",
  );

  protected readonly headerSubtitle = computed<string>(() => {
    const n = this.visibleEntries().length;
    if (n === 0) return "No hay registros en este período.";
    return `Listado completo de ${n} bloque${n === 1 ? "" : "s"}.`;
  });

  protected onModeChange(m: TimesheetViewMode): void {
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

  protected onSaveEntry(payload: EntryFormPayload): void {
    if (payload.mode === "create") {
      this.timesheetService.create(payload.data);
      this.flashAlert("Bloque registrado correctamente.");
    } else if (payload.id) {
      this.timesheetService.update(payload.id, payload.data);
      this.flashAlert("Bloque actualizado correctamente.");
    }
    this.formOpen.set(false);
  }

  protected onDeleteEntry(entry: TimesheetEntry): void {
    this.timesheetService.remove(entry.id);
    this.flashAlert("Bloque eliminado.");
  }

  private flashAlert(message: string): void {
    this.showAlert.set(message);
    setTimeout(() => this.showAlert.set(null), 3000);
  }

  protected onActionEdit(row: EntryRow): void {
    const entry = this.entries().find((e) => e.id === row.id);
    if (entry) this.openEdit(entry);
  }

  protected onActionDelete(row: EntryRow): void {
    const entry = this.entries().find((e) => e.id === row.id);
    if (entry) this.onDeleteEntry(entry);
  }
}
