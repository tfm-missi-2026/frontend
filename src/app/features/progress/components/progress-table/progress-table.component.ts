import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { TaskProgressRow } from "../../models/project-progress";

const MARK_POS = 70;
const MAX_FILL = 99;

const COLUMN_CLASSES = [
  "flex-1 min-w-0",
  "w-26 shrink-0 justify-center",
  "w-26 shrink-0 justify-center",
  "w-58 shrink-0",
  "w-36 shrink-0 justify-center",
] as const;

const HEADER_LABELS = [
  "Tarea",
  "Estim.",
  "Registr.",
  "% Avance",
  "Desviación",
] as const;

@Component({
  selector: "ProgressTable",
  standalone: true,
  imports: [UiBadgeComponent, UiFlexComponent, UiLabelComponent, UiSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./progress-table.component.html",
})
export class ProgressTableComponent {
  readonly rows = input<TaskProgressRow[]>([]);

  protected readonly columnClasses = COLUMN_CLASSES;
  protected readonly headerLabels = HEADER_LABELS;

  protected readonly fillWidthPct = (pct: number, isOver: boolean): number => {
    if (!isOver && pct < 100) {
      return Math.min((pct / 100) * MARK_POS, MAX_FILL);
    }
    return Math.min((pct / 100) * MARK_POS, MAX_FILL);
  };

  protected fillClasses(isOver: boolean): string {
    const base = "absolute top-0 bottom-0 left-0";
    if (isOver) {
      return `${base} bg-[repeating-linear-gradient(45deg,var(--color-error-500,_#EF4444)_0_5px,var(--color-error-300,_#FCA5A5)_5px_10px)] dark:bg-[repeating-linear-gradient(45deg,var(--color-error-400,_#F87171)_0_5px,var(--color-error-300,_#FCA5A5)_5px_10px)]`;
    }
    return `${base} bg-gray-400 dark:bg-gray-600`;
  }

  protected readonly formatDeviation = (dev: number, isOver: boolean): string => {
    if (dev === 0) return "0 h";
    return isOver ? `+${dev} h` : `${dev} h`;
  };
}
