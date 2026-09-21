import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { IconCheckComponent, IconXComponent } from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { formatDateRange } from "@utils/date";

@Component({
  selector: "OverloadDialog",
  standalone: true,
  imports: [
    UiAlertComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./overload-dialog.component.html",
})
export class OverloadDialogComponent {
  readonly isOpen = input<boolean>(false);
  readonly resourceName = input<string>("");
  readonly committedHours = input<number>(0);
  readonly newHours = input<number>(0);
  readonly capacityHours = input<number>(0);
  readonly periodStart = input<string>("");
  readonly periodEnd = input<string>("");
  readonly businessDays = input<number>(0);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;

  protected readonly totalHours = computed<number>(
    () => this.committedHours() + this.newHours(),
  );

  protected readonly excessHours = computed<number>(() =>
    Math.max(0, this.totalHours() - this.capacityHours()),
  );

  protected readonly periodLabel = computed<string>(() =>
    formatDateRange(this.periodStart(), this.periodEnd()),
  );

  protected readonly explanationLabel = computed<string>(
    () =>
      `${this.resourceName()} quedaría con ${this.totalHours()} h planificadas frente a ${this.capacityHours()} h de capacidad en el periodo.`,
  );

  protected readonly rows = computed<{ label: string; value: string }[]>(() => [
    { label: "Recurso técnico", value: this.resourceName() },
    { label: "Periodo", value: this.periodLabel() },
    {
      label: "Capacidad",
      value: `${this.capacityHours()} h · ${this.businessDays()} días hábiles × 8 h`,
    },
    { label: "Ya comprometido", value: `${this.committedHours()} h` },
    { label: "Esta asignación", value: `${this.newHours()} h` },
    { label: "Total resultante", value: `${this.totalHours()} h` },
    { label: "Exceso", value: `${this.excessHours()} h` },
  ]);

  protected onAction(side: "left" | "right"): void {
    if (side === "left") this.cancel.emit();
    else this.confirm.emit();
  }
}
