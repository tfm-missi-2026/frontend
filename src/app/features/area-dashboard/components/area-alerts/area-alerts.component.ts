import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type {
  AlertOverload,
  AreaTodoVariation,
} from "../../services/area-dashboard.service";

@Component({
  selector: "AreaAlerts",
  standalone: true,
  imports: [
    RouterLink,
    UiBadgeComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./area-alerts.component.html",
})
export class AreaAlertsComponent {
  readonly overloads = input<AlertOverload[]>([]);
  readonly variations = input<AreaTodoVariation[]>([]);
}
