import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";

const MARK_POS = 70;
const MAX_FILL = 99;

@Component({
  selector: "UtilizationBar",
  standalone: true,
  imports: [UiFlexComponent, UiLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./utilization-bar.component.html",
})
export class UtilizationBarComponent {
  readonly utilizationPct = input<number>(0);
  readonly hasPlan = input<boolean>(true);
  readonly isOverload = input<boolean>(false);

  protected readonly fillWidthPct = computed<number>(() => {
    if (!this.hasPlan()) return 0;
    const pct = this.utilizationPct();
    return Math.min((pct / 100) * MARK_POS, MAX_FILL);
  });

  protected readonly fillClasses = computed<string>(() => {
    const base = "absolute top-0 bottom-0 left-0";
    if (!this.hasPlan()) return `${base} bg-transparent`;
    if (this.isOverload()) {
      return `${base} bg-[repeating-linear-gradient(45deg,var(--color-brand-500,#4F46E5)_0_5px,var(--color-brand-300,#A5B4FC)_5px_10px)] dark:bg-[repeating-linear-gradient(45deg,var(--color-brand-400,#818CF8)_0_5px,var(--color-brand-300,_#A5B4FC)_5px_10px)]`;
    }
    return `${base} bg-gray-400 dark:bg-gray-600`;
  });

  protected readonly labelText = computed<string>(() => {
    if (!this.hasPlan()) return "0% sin plan";
    return `${this.utilizationPct()}%`;
  });

  protected readonly markPos = MARK_POS;
}
