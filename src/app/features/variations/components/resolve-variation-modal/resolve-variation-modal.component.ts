import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiBadgeComponent } from "@shared/ui/badge";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiGridComponent } from "@shared/ui/grid";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiRadioComponent } from "@shared/ui/radio";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import {
  emptyResolveForm,
  type ResolveVariationFormData,
  type ResolveVariationPayload,
} from "../../models/variation-form";
import type { Variation } from "../../models/variation";
import { VariationReadOnlyBlockComponent } from "../variation-readonly-block/variation-readonly-block.component";

export type ResolveMode = "resolve" | "view";

@Component({
  selector: "ResolveVariationModal",
  standalone: true,
  imports: [
    FormsModule,
    UiBadgeComponent,
    UiButtonComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiGridComponent,
    UiLabelComponent,
    UiModalComponent,
    UiRadioComponent,
    UiSurfaceComponent,
    UiTextAreaComponent,
    VariationReadOnlyBlockComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./resolve-variation-modal.component.html",
})
export class ResolveVariationModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly mode = input<ResolveMode>("resolve");
  readonly variation = input.required<Variation>();
  readonly resolvedBy = input<string>("Ricardo Salazar Núñez");

  readonly close = output<void>();
  readonly resolve = output<ResolveVariationPayload>();

  protected readonly form = signal<ResolveVariationFormData>(emptyResolveForm());

  protected readonly canSubmit = computed<boolean>(
    () => this.form().decision !== null,
  );

  constructor() {
    effect(() => {
      if (!this.isOpen()) return;
      if (this.mode() === "resolve") {
        this.form.set(emptyResolveForm());
      }
    });
  }

  protected onDecisionChange(value: string): void {
    if (value === "Aprobada" || value === "Rechazada") {
      this.form.update((f) => ({ ...f, decision: value }));
    }
  }

  protected onObservationChange(value: string): void {
    this.form.update((f) => ({ ...f, observation: value }));
  }

  protected onCancel(): void {
    this.close.emit();
  }

  protected onCloseOnly(): void {
    this.close.emit();
  }

  protected onSaveDecision(): void {
    const f = this.form();
    if (!f.decision) return;
    this.resolve.emit({
      id: this.variation().id,
      decision: f.decision,
      observation: f.observation,
      resolvedBy: this.resolvedBy(),
    });
  }

  protected readonly resolvedDecisionLabel = computed<string | null>(() => {
    const r = this.variation().resolution;
    return r ? r.decision : null;
  });
}
