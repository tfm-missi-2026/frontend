import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { CommonProgressBarComponent } from "@shared/common";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { AlertOverload } from "../../services/area-dashboard.service";

@Component({
  selector: "AreaLoadChart",
  standalone: true,
  imports: [
    CommonProgressBarComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./area-load-chart.component.html",
})
export class AreaLoadChartComponent {
  readonly workloads = input<AlertOverload[]>([]);
}
