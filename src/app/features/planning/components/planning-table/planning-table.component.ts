import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { Assignment } from "../../models/assignment";

export interface AssignmentRowViewModel extends Assignment {
  resourceName: string;
  resourceRole: string;
  taskName: string;
  taskSubprojectLabel: string;
}

function formatShortDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

const COLUMN_CLASSES = [
  "flex-1 min-w-0",
  "flex-1 min-w-0",
  "w-30 shrink-0 justify-center",
  "w-60 shrink-0",
  "flex-1 shrink-0 justify-end",
] as const;

const HEADER_LABELS = [
  "Recurso técnico",
  "Tarea",
  "Horas planif.",
  "Periodo",
  "Acciones",
];

@Component({
  selector: "PlanningTable",
  standalone: true,
  imports: [
    UiFlexComponent,
    UiLabelComponent,
    UiLinkComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./planning-table.component.html",
})
export class PlanningTableComponent {
  readonly rows = input<AssignmentRowViewModel[]>([]);

  readonly edit = output<Assignment>();
  readonly remove = output<Assignment>();

  protected readonly columnClasses = COLUMN_CLASSES;
  protected readonly headerLabels = HEADER_LABELS;

  protected formatPeriod(row: AssignmentRowViewModel): string {
    return `${formatShortDate(row.startDate)} – ${formatShortDate(row.endDate)}`;
  }
}