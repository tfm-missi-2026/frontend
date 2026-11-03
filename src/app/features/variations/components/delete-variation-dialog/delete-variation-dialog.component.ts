import { ChangeDetectionStrategy, Component, computed, input, output, signal } from "@angular/core";

import { IconCheckComponent, IconXComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSurfaceComponent } from "@shared/ui/surface";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import type { Variation } from "../../models/variation";

@Component({
  selector: "DeleteVariationDialog",
  standalone: true,
  imports: [
    UiFlexComponent,
    UiFormLabelComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSurfaceComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./delete-variation-dialog.component.html",
})
export class DeleteVariationDialogComponent {
  readonly variation = input.required<Variation>();
  readonly saving = input<boolean>(false);

  readonly confirm = output<string>();
  readonly cancel = output<void>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;

  protected readonly reason = signal<string>("");

  protected readonly fields = computed(() => {
    const v = this.variation();
    return [
      { label: "Tarea", value: v.target?.label ?? "—" },
      { label: "Tipo", value: v.type },
      { label: "Reportada por", value: v.reportedBy },
    ];
  });

  protected readonly canConfirm = computed<boolean>(
    () => this.reason().trim().length > 0 && !this.saving(),
  );

  protected onAction(side: "left" | "right"): void {
    if (side === "left") this.cancel.emit();
    else if (this.canConfirm()) this.confirm.emit(this.reason().trim());
  }
}
