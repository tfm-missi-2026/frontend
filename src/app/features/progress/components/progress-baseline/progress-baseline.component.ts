import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

@Component({
  selector: "ProgressBaseline",
  standalone: true,
  imports: [UiFlexComponent, UiHeaderComponent, UiLabelComponent, UiSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./progress-baseline.component.html",
})
export class ProgressBaselineComponent {
  readonly baselineLabel = input<string>("");
  readonly baselineDate = input<string>("");
  readonly estimatedHours = input<number>(0);
  readonly loggedHours = input<number>(0);
  readonly progressPct = input<number>(0);
}
