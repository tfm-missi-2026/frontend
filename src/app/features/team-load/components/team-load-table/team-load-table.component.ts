import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { ResourceWorkload } from "../../models/resource-workload";
import { UtilizationBarComponent } from "../utilization-bar/utilization-bar.component";

@Component({
  selector: "TeamLoadTable",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiSurfaceComponent,
    UtilizationBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./team-load-table.component.html",
})
export class TeamLoadTableComponent {
  readonly rows = input<ResourceWorkload[]>([]);

  protected asHours(value: number, hasPlan: boolean): string {
    return hasPlan ? `${value} h` : "—";
  }
}
