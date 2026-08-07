import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { formatDateRange, formatShortDate } from "@utils/date";

const WIDTH_BUCKETS = [
  { max: 5, cls: "w-0" },
  { max: 15, cls: "w-1/12" },
  { max: 30, cls: "w-1/4" },
  { max: 45, cls: "w-2/5" },
  { max: 55, cls: "w-1/2" },
  { max: 70, cls: "w-2/3" },
  { max: 85, cls: "w-5/6" },
  { max: 100, cls: "w-full" },
] as const;

function widthClassFor(percent: number): string {
  for (const bucket of WIDTH_BUCKETS) {
    if (percent <= bucket.max) return bucket.cls;
  }
  return "w-full";
}

@Component({
  selector: "OverloadDialog",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiModalComponent,
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

  protected readonly totalHours = computed<number>(
    () => this.committedHours() + this.newHours(),
  );

  protected readonly committedPercent = computed<number>(() => {
    const total = this.totalHours();
    if (total <= 0) return 0;
    return (this.committedHours() / total) * 100;
  });

  protected readonly newPercent = computed<number>(() => {
    const total = this.totalHours();
    if (total <= 0) return 0;
    return (this.newHours() / total) * 100;
  });

  protected readonly capacityPercent = computed<number>(() => {
    const total = this.totalHours();
    if (total <= 0) return 0;
    return (this.capacityHours() / total) * 100;
  });

  protected readonly periodLabel = computed<string>(
    () => formatDateRange(this.periodStart(), this.periodEnd()),
  );

  protected readonly explanationLabel = computed<string>(
    () =>
      `${this.resourceName()} quedaría con ${this.totalHours()} h planificadas frente a ${this.capacityHours()} h de capacidad en el periodo (${this.businessDays()} días hábiles × 8 h).`,
  );

  protected committedBarClass(): string {
    return widthClassFor(this.committedPercent());
  }

  protected newBarClass(): string {
    return widthClassFor(this.newPercent());
  }
}