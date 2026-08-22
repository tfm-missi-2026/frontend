import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

@Component({
  selector: "CommonKpiCard",
  standalone: true,
  imports: [UiFlexComponent, UiLabelComponent, UiSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./kpi-card.component.html",
})
export class CommonKpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number | string>();
  readonly valueSuffix = input<string>("");
  readonly sub = input<string>("");
  readonly alert = input<boolean>(false);
  readonly progressPct = input<number | null>(null);
  readonly linkLabel = input<string>("");

  readonly linkClick = output<void>();

  protected readonly displayValue = computed<string>(() =>
    String(this.value()),
  );

  protected readonly showProgressBar = computed<boolean>(
    () => this.progressPct() !== null,
  );

  protected readonly minibarFillPct = computed<number>(() => {
    const pct = this.progressPct();
    if (pct === null) return 0;
    return Math.min(pct, 99);
  });

  protected onLinkClick(): void {
    if (this.linkLabel()) this.linkClick.emit();
  }
}
