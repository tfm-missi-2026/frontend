import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiLinkComponent } from "@shared/ui/link";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { Variation } from "../../models/variation";

const COLUMN_CLASSES = [
  "flex-1 min-w-0",
  "w-24 shrink-0 justify-center",
  "flex-1 min-w-0",
  "w-32 shrink-0",
  "w-24 shrink-0",
  "w-32 shrink-0 justify-center",
  "flex-1 shrink-0 justify-end",
] as const;

const HEADER_LABELS = [
  "Tarea afectada",
  "Tipo",
  "Descripción",
  "Reportada por",
  "Detección",
  "Situación",
  "",
] as const;

export interface VariationRowViewModel extends Variation {
  targetLabel: string;
  targetRef: string | null;
}

function formatShortDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

@Component({
  selector: "VariationsTable",
  standalone: true,
  imports: [
    UiBadgeComponent,
    UiFlexComponent,
    UiLabelComponent,
    UiLinkComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./variations-table.component.html",
})
export class VariationsTableComponent {
  readonly rows = input<VariationRowViewModel[]>([]);

  readonly view = output<Variation>();
  readonly resolve = output<Variation>();

  protected readonly columnClasses = COLUMN_CLASSES;
  protected readonly headerLabels = HEADER_LABELS;

  protected formatDate(iso: string): string {
    return formatShortDate(iso);
  }

  protected statusBadgeVariant(
    status: Variation["status"],
  ): "light" | "solid" {
    return status === "Pendiente" ? "light" : "solid";
  }

  protected statusBadgeColor(
    status: Variation["status"],
  ): "warning" | "success" | "error" {
    if (status === "Pendiente") return "warning";
    if (status === "Aprobada") return "success";
    return "error";
  }

  protected pendingBadgeClass(): string {
    return "border border-dashed border-warning-300 dark:border-warning-700";
  }

  protected isPending(v: VariationRowViewModel): boolean {
    return v.status === "Pendiente";
  }
}
