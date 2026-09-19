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
import { formatShortDate } from "@utils/date";

import type { Variation } from "../../models/variation";

export interface VariationRowViewModel extends Variation {
  targetLabel: string;
  targetRef: string | null;
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
