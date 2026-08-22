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

const COLUMN_CLASSES = [
  "w-52 shrink-0",
  "w-26 shrink-0 justify-center",
  "w-26 shrink-0 justify-center",
  "w-24 shrink-0 justify-center",
  "flex-1 min-w-0",
  "w-32 shrink-0 justify-center",
] as const;

const HEADER_LABELS = [
  "Recurso técnico",
  "Planif.",
  "Registr.",
  "Tareas act.",
  "% Utilización",
  "Estado",
] as const;

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

  protected readonly columnClasses = COLUMN_CLASSES;
  protected readonly headerLabels = HEADER_LABELS;

  protected asHours(value: number, hasPlan: boolean): string {
    return hasPlan ? `${value} h` : "—";
  }
}
