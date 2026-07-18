import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiGridComponent } from "@shared/ui/grid";
import { UiLabelComponent } from "@shared/ui/label";
import { UiSurfaceComponent } from "@shared/ui/surface";

import type { Variation } from "../../models/variation";

function formatShortDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

@Component({
  selector: "VariationReadOnlyBlock",
  standalone: true,
  imports: [UiFlexComponent, UiGridComponent, UiLabelComponent, UiSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./variation-readonly-block.component.html",
})
export class VariationReadOnlyBlockComponent {
  readonly variation = input.required<Variation>();

  protected readonly targetLabel = computed<string>(() => {
    const t = this.variation().target;
    return t?.label ?? "(sin tarea específica)";
  });

  protected readonly targetRef = computed<string | null>(() => {
    const t = this.variation().target;
    return t?.ref ?? null;
  });

  protected readonly detectionLabel = computed<string>(() =>
    formatShortDate(this.variation().detectionDate),
  );

  protected readonly previousLabel = computed<string>(() => {
    const v = this.variation().previousValue;
    return v ? (isIsoDate(v) ? formatShortDate(v) : v) : "";
  });

  protected readonly newLabel = computed<string>(() => {
    const v = this.variation().newValue;
    return v ? (isIsoDate(v) ? formatShortDate(v) : v) : "";
  });

  protected readonly hasChange = computed<boolean>(
    () => !!this.variation().previousValue || !!this.variation().newValue,
  );
}
