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
import { UiFlexComponent } from "@shared/ui/flex";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiLabelComponent } from "@shared/ui/label";
import { parseIsoDate, toIsoDate } from "@utils/date";

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

function formatLong(iso: string): string {
  const d = parseIsoDate(iso);
  if (!d) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

const VIEW_TABS: CommonTabOption<TimesheetViewMode>[] = [
  { value: "day", label: "Por día" },
  { value: "month", label: "Por mes" },
];

@Component({
  selector: "TimesheetToolbar",
  standalone: true,
  imports: [
    CommonTabGroupComponent,
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

  protected readonly displayLabel = computed<string>(() =>
    formatLong(this.date()),
  );

  protected readonly dowLabel = computed<string>(() => {
    const d = parseIsoDate(this.date());
    if (!d) return "";
    return DAY_NAMES_ES[d.getDay()];
  });

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