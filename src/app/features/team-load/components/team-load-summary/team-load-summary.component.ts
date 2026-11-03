import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";

import { CommonKpiCardComponent } from "@shared/common";
import { UiGridComponent } from "@shared/ui/grid";

@Component({
  selector: "TeamLoadSummary",
  standalone: true,
  imports: [CommonKpiCardComponent, UiGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./team-load-summary.component.html",
})
export class TeamLoadSummaryComponent {
  readonly totalResources = input<number>(0);
  readonly overloadCount = input<number>(0);
  readonly averageUtilizationPct = input<number>(0);
}
