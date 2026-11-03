import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";

import { IconCheckComponent, IconXComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSurfaceComponent } from "@shared/ui/surface";

@Component({
  selector: "FreezeBaselineDialog",
  standalone: true,
  imports: [
    UiFlexComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./freeze-baseline-dialog.component.html",
})
export class FreezeBaselineDialogComponent {
  readonly isOpen = input<boolean>(false);
  readonly projectLabel = input<string>("");
  readonly assignmentCount = input<number>(0);
  readonly resourceCount = input<number>(0);
  readonly totalHours = input<number>(0);
  readonly saving = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;

  protected readonly rows = computed<{ label: string; value: string }[]>(() => [
    { label: "Proyecto", value: this.projectLabel() },
    { label: "Asignaciones", value: `${this.assignmentCount()}` },
    { label: "Recursos técnicos", value: `${this.resourceCount()}` },
    { label: "Horas planificadas", value: `${this.totalHours()} h` },
  ]);

  protected onAction(side: "left" | "right"): void {
    if (side === "left") this.cancel.emit();
    else this.confirm.emit();
  }
}
