import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";

const MAX_FILL = 99;
const DEFAULT_MARK_POS = 70;

@Component({
  selector: "CommonProgressBar",
  standalone: true,
  imports: [UiFlexComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./progress-bar.component.html",
})
export class CommonProgressBarComponent {
  readonly progressPct = input<number>(0);
  readonly isOver = input<boolean>(false);
  readonly markPos = input<number>(DEFAULT_MARK_POS);

  protected readonly fillWidthPct = computed<number>(() => {
    const pct = this.progressPct();
    return Math.min((pct / 100) * this.markPos(), MAX_FILL);
  });

  protected readonly fillClasses = computed<string>(() => {
    const base = "absolute top-0 bottom-0 left-0";
    if (this.isOver()) {
      return `${base} bg-[repeating-linear-gradient(45deg,var(--color-brand-500,_#4F46E5)_0_5px,var(--color-brand-300,_#A5B4FC)_5px_10px)] dark:bg-[repeating-linear-gradient(45deg,var(--color-brand-400,_#818CF8)_0_5px,var(--color-brand-300,_#A5B4FC)_5px_10px)]`;
    }
    return `${base} bg-gray-400 dark:bg-gray-600`;
  });
}
