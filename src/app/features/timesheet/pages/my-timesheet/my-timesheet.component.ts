import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";

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
import type { TimesheetEntry } from "../../models/timesheet-entry";
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

  ngOnInit(): void {
    void this.timesheetService.cargar();
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

  protected async onSaveEntry(payload: EntryFormPayload): Promise<void> {
    if (payload.mode === "create") {
      const created = await this.timesheetService.create(payload.data);
      if (created) this.flashAlert("Bloque registrado correctamente.");
    } else if (payload.id) {
      const updated = await this.timesheetService.update(
        payload.id,
        payload.data,
      );
      if (updated) this.flashAlert("Bloque actualizado correctamente.");
    }
    this.formOpen.set(false);
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