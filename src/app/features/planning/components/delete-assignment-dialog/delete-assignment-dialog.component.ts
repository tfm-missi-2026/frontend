import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

import { IconCheckComponent, IconXComponent } from "@shared/icons";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSurfaceComponent } from "@shared/ui/surface";

@Component({
  selector: "DeleteAssignmentDialog",
  standalone: true,
  imports: [
    UiFlexComponent,
    UiLabelComponent,
    UiModalComponent,
    UiSurfaceComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./delete-assignment-dialog.component.html",
})
export class DeleteAssignmentDialogComponent {
  readonly isOpen = input<boolean>(false);
  readonly resourceName = input<string>("");
  readonly taskName = input<string>("");
  readonly plannedHours = input<number>(0);
  readonly periodLabel = input<string>("");
  readonly saving = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;

  protected onAction(side: "left" | "right"): void {
    if (side === "left") this.cancel.emit();
    else this.confirm.emit();
  }
}
