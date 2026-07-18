import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import {
  PROJECT_STATUS_LABELS,
  type Project,
} from "../../../projects/models/project";

@Component({
  selector: "ProjectsSubprojectsHeader",
  standalone: true,
  imports: [
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./projects-subprojects-header.component.html",
})
export class ProjectsSubprojectsHeaderComponent {
  readonly project = input.required<Project>();
  readonly managerName = input<string>("");
  readonly subCount = input.required<number>();

  protected readonly statusLabel = computed<string>(() =>
    PROJECT_STATUS_LABELS[this.project().status],
  );
}