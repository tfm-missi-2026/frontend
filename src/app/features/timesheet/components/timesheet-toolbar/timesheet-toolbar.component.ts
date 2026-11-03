import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import {
  IconChevronLeftComponent,
  IconChevronRightComponent,
} from "@shared/icons";
import {
  CommonTabGroupComponent,
  type CommonTabOption,
} from "@shared/common/tab-group";
import { UiDatePickerComponent } from "@shared/ui/date-picker";
import type { DatePickerDayMark } from "@shared/ui/date-picker/date-picker.types";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiLabelComponent } from "@shared/ui/label";
import { parseIsoDate, toIsoDate } from "@utils/date";

export interface TimesheetLoggedDay {
  blocks: number;
  hours: number;
}

export type TimesheetViewMode = "month" | "day";

const DAY_NAMES_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const MONTH_NAMES_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const VIEW_TABS: CommonTabOption<TimesheetViewMode>[] = [
  { value: "day", label: "Por día" },
  { value: "month", label: "Por mes" },
];

@Component({
  selector: "TimesheetToolbar",
  standalone: true,
  imports: [
    CommonTabGroupComponent,
    UiDatePickerComponent,
    UiFlexComponent,
    UiIconButtonComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./timesheet-toolbar.component.html",
})
export class TimesheetToolbarComponent {
  readonly mode = input<TimesheetViewMode>("day");
  readonly date = input<string>("");
  readonly loggedDays = input<ReadonlyMap<string, TimesheetLoggedDay>>(
    new Map(),
  );

  readonly modeChange = output<TimesheetViewMode>();
  readonly dateChange = output<string>();

  protected readonly viewTabs = VIEW_TABS;
  protected readonly IconChevronLeftComponent = IconChevronLeftComponent;
  protected readonly IconChevronRightComponent = IconChevronRightComponent;

  protected readonly todayIso = toIsoDate(new Date());

  protected readonly todayLabel = computed<string>(() => {
    const today = parseIsoDate(this.todayIso);
    if (!today) return this.todayIso;
    return `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  });

  protected readonly dowLabel = computed<string>(() => {
    const d = parseIsoDate(this.date());
    if (!d) return "";
    return DAY_NAMES_ES[d.getDay()];
  });

  protected readonly loggedDayMark = computed(() => {
    const days = this.loggedDays();
    return (iso: string): DatePickerDayMark | null => {
      const day = days.get(iso);
      if (!day) return null;
      const blocks = day.blocks === 1 ? "1 bloque" : `${day.blocks} bloques`;
      return { className: "ui-day-logged", title: `${blocks} · ${day.hours} h` };
    };
  });

  protected onPickDate(value: string | string[]): void {
    const iso = Array.isArray(value) ? value[0] : value;
    if (iso && iso !== this.date()) this.dateChange.emit(iso);
  }

  protected onPrev(): void {
    const d = parseIsoDate(this.date());
    if (!d) return;
    d.setDate(d.getDate() - 1);
    this.dateChange.emit(toIsoDate(d));
  }

  protected onNext(): void {
    const d = parseIsoDate(this.date());
    if (!d) return;
    d.setDate(d.getDate() + 1);
    this.dateChange.emit(toIsoDate(d));
  }
}

export const TIMESHEET_DAY_NAMES = DAY_NAMES_ES;
export const TIMESHEET_MONTH_NAMES = MONTH_NAMES_ES;
export const toTimesheetIsoDate = toIsoDate;
export const parseTimesheetIsoDate = parseIsoDate;