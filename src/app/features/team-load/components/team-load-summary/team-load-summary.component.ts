import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

@Component({
  selector: "TeamLoadSummary",
  standalone: true,
  imports: [UiFlexComponent, UiGridComponent, UiLabelComponent, UiSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./team-load-summary.component.html",
})
export class TeamLoadSummaryComponent {
  readonly totalResources = input<number>(0);
  readonly overloadCount = input<number>(0);
  readonly averageUtilizationPct = input<number>(0);
}
