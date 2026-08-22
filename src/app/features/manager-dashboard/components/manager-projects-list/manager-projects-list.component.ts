import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { CommonProgressBarComponent } from "@shared/common";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { ProjectProgressItem } from "../../services/manager-dashboard.service";

@Component({
  selector: "ManagerProjectsList",
  standalone: true,
  imports: [
    CommonProgressBarComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./manager-projects-list.component.html",
})
export class ManagerProjectsListComponent {
  readonly projects = input.required<ProjectProgressItem[]>();
}
