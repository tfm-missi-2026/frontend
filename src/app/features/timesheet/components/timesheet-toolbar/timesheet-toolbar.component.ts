import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { IconArrowLeftComponent, IconArrowRightComponent } from "@shared/icons";
import { UiButtonComponent } from "@shared/ui/button";
import { UiDatePickerComponent } from "@shared/ui/date-picker";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiLabelComponent } from "@shared/ui/label";

export type TimesheetViewMode = "day" | "range";

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

function parseIsoDate(iso: string): Date | null {
  if (!iso) return null;
  const parts = iso.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatLong(iso: string): string {
  const d = parseIsoDate(iso);
  if (!d) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

@Component({
  selector: "TimesheetToolbar",
  standalone: true,
  imports: [
    FormsModule,
    UiButtonComponent,
    UiDatePickerComponent,
    UiFlexComponent,
    UiIconButtonComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex
      direction="row"
      alignItems="center"
      [gap]="16"
      className="flex-wrap"
    >
      <UiFlex direction="row" alignItems="stretch" [gap]="0">
        <UiButton
          variant="tertiary"
          [compact]="true"
          labelText="Por día"
          [className]="
            mode() === 'day'
              ? 'rounded-none bg-brand-500 text-white hover:bg-brand-600'
              : 'rounded-none text-gray-600 dark:text-gray-300'
          "
          (click)="modeChange.emit('day')"
        />
        <UiButton
          variant="tertiary"
          [compact]="true"
          labelText="Por rango"
          [className]="
            mode() === 'range'
              ? 'rounded-none bg-brand-500 text-white hover:bg-brand-600'
              : 'rounded-none text-gray-600 dark:text-gray-300'
          "
          (click)="modeChange.emit('range')"
        />
      </UiFlex>

      <UiFlex direction="row" alignItems="center" [gap]="0">
        <UiIconButton
          [Icon]="IconArrowLeftComponent"
          variant="tertiary"
          [compact]="true"
          labelText="Día anterior"
          (click)="onPrev()"
        />
        <UiFlex
          direction="column"
          alignItems="center"
          justifyContent="center"
          [gap]="0"
          className="border-x border-gray-200 px-5 py-1 dark:border-gray-700"
        >
          @if (mode() === "day") {
            <UiLabel type="bodyS" weight="semibold" color="textStrong">
              {{ displayLabel() }}
            </UiLabel>
            <UiLabel type="bodyXs" color="textWeak">
              {{ dowLabel() }}
            </UiLabel>
          } @else {
            <UiLabel type="bodyS" weight="semibold" color="textStrong">
              {{ rangeLabel() }}
            </UiLabel>
          }
        </UiFlex>
        <UiIconButton
          [Icon]="IconArrowRightComponent"
          variant="tertiary"
          [compact]="true"
          labelText="Día siguiente"
          (click)="onNext()"
        />
      </UiFlex>

      @if (mode() === "day") {
        <UiDatePicker
          className="w-44"
          placeholder="Seleccionar fecha"
          [value]="date()"
          (valueChange)="dateChange.emit(asString($event))"
        />
      } @else {
        <UiDatePicker
          className="w-44"
          mode="range"
          placeholder="Seleccionar rango"
          [value]="range()"
          (valueChange)="rangeChange.emit(asStringArray($event))"
        />
      }

      <UiFlex direction="row" [gap]="0" className="flex-1" />
      <UiLabel type="bodyXs" color="textWeak">
        Hoy: {{ todayLabel() }}
      </UiLabel>
    </UiFlex>
  `,
})
export class TimesheetToolbarComponent {
  readonly mode = input<TimesheetViewMode>("day");
  readonly date = input<string>("");
  readonly range = input<string[]>([]);

  readonly modeChange = output<TimesheetViewMode>();
  readonly dateChange = output<string>();
  readonly rangeChange = output<string[]>();

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

  protected readonly rangeLabel = computed<string>(() => {
    const r = this.range();
    if (!r || r.length === 0) return "Selecciona un rango";
    if (r.length === 1) return formatLong(r[0]);
    return `${formatLong(r[0])} – ${formatLong(r[r.length - 1])}`;
  });

  protected readonly IconArrowLeftComponent = IconArrowLeftComponent;
  protected readonly IconArrowRightComponent = IconArrowRightComponent;

  protected onPrev(): void {
    if (this.mode() === "day") {
      const d = parseIsoDate(this.date());
      if (!d) return;
      d.setDate(d.getDate() - 1);
      this.dateChange.emit(toIsoDate(d));
    } else {
      const r = this.range();
      if (!r.length) return;
      const start = parseIsoDate(r[0]);
      if (!start) return;
      start.setDate(start.getDate() - 7);
      const end = parseIsoDate(r[r.length - 1] ?? r[0]);
      if (end) end.setDate(end.getDate() - 7);
      this.rangeChange.emit([toIsoDate(start), toIsoDate(end ?? start)]);
    }
  }

  protected onNext(): void {
    if (this.mode() === "day") {
      const d = parseIsoDate(this.date());
      if (!d) return;
      d.setDate(d.getDate() + 1);
      this.dateChange.emit(toIsoDate(d));
    } else {
      const r = this.range();
      if (!r.length) return;
      const start = parseIsoDate(r[0]);
      if (!start) return;
      start.setDate(start.getDate() + 7);
      const end = parseIsoDate(r[r.length - 1] ?? r[0]);
      if (end) end.setDate(end.getDate() + 7);
      this.rangeChange.emit([toIsoDate(start), toIsoDate(end ?? start)]);
    }
  }

  protected asString(value: string | string[]): string {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
  }

  protected asStringArray(value: string | string[]): string[] {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  }
}

export const TIMESHEET_DAY_NAMES = DAY_NAMES_ES;
export const TIMESHEET_MONTH_NAMES = MONTH_NAMES_ES;
export const toTimesheetIsoDate = toIsoDate;
export const parseTimesheetIsoDate = parseIsoDate;
