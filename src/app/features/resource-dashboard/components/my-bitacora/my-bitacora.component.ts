import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { IconClockComponent, IconPlusSimpleComponent } from "@shared/icons";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { TimesheetEntry } from "@features/timesheet/models/timesheet-entry";

@Component({
  selector: "MyBitacora",
  standalone: true,
  imports: [
    IconClockComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./my-bitacora.component.html",
})
export class MyBitacoraComponent {
  readonly todayLabel = input.required<string>();
  readonly entries = input<TimesheetEntry[]>([]);
  readonly totalHours = input<number>(0);

  readonly registerBlock = output<void>();

  protected readonly IconPlusSimpleComponent = IconPlusSimpleComponent;

  protected readonly hasEntries = computed<boolean>(
    () => this.entries().length > 0,
  );

  protected kindLabel(e: TimesheetEntry): string {
    return e.kind === "task" ? "Tarea" : "Actividad";
  }

  protected blockTitle(e: TimesheetEntry): string {
    if (e.kind === "task") {
      return e.taskCode ?? e.task;
    }
    return e.activity ?? "Actividad";
  }

  protected blockTime(e: TimesheetEntry): string {
    return `${e.startTime}-${e.endTime}`;
  }

  protected onRegister(): void {
    this.registerBlock.emit();
  }
}