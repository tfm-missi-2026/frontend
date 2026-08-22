import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiCardComponent } from "@shared/ui/card";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";

import type { TimesheetEntry } from "../../models/timesheet-entry";

const STATUS_COLORS: Record<
  TimesheetEntry["status"],
  "primary" | "success" | "warning" | "info" | "error" | "light" | "dark"
> = {
  draft: "light",
  submitted: "info",
  approved: "success",
  rejected: "error",
};

const STATUS_DOT: Record<TimesheetEntry["status"], string> = {
  draft: "○",
  submitted: "◐",
  approved: "●",
  rejected: "●",
};

@Component({
  selector: "TimesheetSummary",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiCardComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiCard padding="md" className="h-full">
      <UiFlex
        direction="row"
        alignItems="center"
        justifyContent="between"
        [gap]="12"
      >
        <UiFlex direction="column" [gap]="0">
          <UiLabel
            type="bodyXs"
            weight="medium"
            color="textWeak"
            className="uppercase"
          >
            Total del período
          </UiLabel>
          <UiHeader [level]="2" [text]="totalLabel()" />
          <UiLabel type="bodyS" color="textWeak" className="mt-1">
            {{ subtitle() }}
          </UiLabel>
        </UiFlex>
        <UiBadge variant="light" color="primary" size="md">
          {{ entries().length }} bloques
        </UiBadge>
      </UiFlex>

      <UiFlex
        direction="row"
        alignItems="center"
        [gap]="16"
        className="mt-4 flex-wrap border-t border-dashed border-gray-200 pt-4 dark:border-gray-800"
      >
        <UiFlex direction="column" [gap]="0" className="min-w-25">
          <UiLabel type="bodyXxs" color="textWeak" className="uppercase">
            Tareas
          </UiLabel>
          <UiLabel
            type="HeadingM"
            weight="bold"
            color="textStrong"
            [text]="taskHoursLabel()"
          />
        </UiFlex>
        <UiFlex direction="column" [gap]="0" className="min-w-25">
          <UiLabel type="bodyXxs" color="textWeak" className="uppercase">
            Actividades
          </UiLabel>
          <UiLabel
            type="HeadingM"
            weight="bold"
            color="textStrong"
            [text]="activityHoursLabel()"
          />
        </UiFlex>
        <UiFlex direction="row" [gap]="0" className="flex-1" />
        @for (s of statusSummary(); track s.status) {
          <UiBadge
            [variant]="'light'"
            [color]="STATUS_COLORS[s.status]"
            size="sm"
          >
            <UiLabel type="bodyXs" color="textWeak" [text]="STATUS_DOT[s.status]" className="mr-1" />
            {{ s.count }} {{ s.label }}
          </UiBadge>
        }
      </UiFlex>
    </UiCard>
  `,
})
export class TimesheetSummaryComponent {
  readonly entries = input<TimesheetEntry[]>([]);

  protected readonly STATUS_COLORS = STATUS_COLORS;
  protected readonly STATUS_DOT = STATUS_DOT;

  protected readonly totalHours = computed<number>(() =>
    this.entries().reduce((acc, e) => acc + e.hours, 0),
  );

  protected readonly taskHours = computed<number>(() =>
    this.entries()
      .filter((e) => e.kind === "task")
      .reduce((acc, e) => acc + e.hours, 0),
  );

  protected readonly activityHours = computed<number>(() =>
    this.entries()
      .filter((e) => e.kind === "activity")
      .reduce((acc, e) => acc + e.hours, 0),
  );

  protected readonly totalLabel = computed<string>(
    () => `${this.totalHours()} h`,
  );
  protected readonly taskHoursLabel = computed<string>(
    () => `${this.taskHours()} h`,
  );
  protected readonly activityHoursLabel = computed<string>(
    () => `${this.activityHours()} h`,
  );

  protected readonly subtitle = computed<string>(() => {
    const count = this.entries().length;
    if (count === 0) return "No se han registrado bloques.";
    return `Suma de ${count} bloque${count === 1 ? "" : "s"} registrados.`;
  });

  protected readonly statusSummary = computed<
    { status: TimesheetEntry["status"]; label: string; count: number }[]
  >(() => {
    const all = this.entries();
    const items: {
      status: TimesheetEntry["status"];
      label: string;
      count: number;
    }[] = [
      { status: "draft", label: "Borrador", count: 0 },
      { status: "submitted", label: "Enviado", count: 0 },
      { status: "approved", label: "Aprobado", count: 0 },
      { status: "rejected", label: "Rechazado", count: 0 },
    ];
    for (const e of all) {
      const item = items.find((i) => i.status === e.status);
      if (item) item.count += 1;
    }
    return items.filter((i) => i.count > 0);
  });
}
