import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";

import { IconCheckComponent, IconXComponent } from "@shared/icons";
import { UiAlertComponent } from "@shared/ui/alert";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiSurfaceComponent } from "@shared/ui/surface";

@Component({
  selector: "FreezeBaselineDialog",
  standalone: true,
  imports: [
    UiAlertComponent,
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
  readonly currentVersion = input<number | null>(null);
  readonly unchanged = input<boolean>(false);
  readonly saving = input<boolean>(false);

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly IconCheck = IconCheckComponent;
  protected readonly IconX = IconXComponent;

  protected readonly nextVersion = computed<number>(
    () => (this.currentVersion() ?? 0) + 1,
  );

  protected readonly explanation = computed<string>(() => {
    const version = this.currentVersion();
    if (version === null) {
      return "Se guardará una copia inmutable del plan actual. A partir de ahí, el módulo Avance comparará las horas registradas contra esta foto.";
    }
    return `Este proyecto ya tiene la línea base v${version}. Congelar creará la v${this.nextVersion()} y el avance pasará a compararse contra ella.`;
  });

  protected readonly rows = computed<{ label: string; value: string }[]>(() => [
    { label: "Proyecto", value: this.projectLabel() },
    { label: "Asignaciones", value: `${this.assignmentCount()}` },
    { label: "Recursos técnicos", value: `${this.resourceCount()}` },
    { label: "Horas planificadas", value: `${this.totalHours()} h` },
    { label: "Versión a crear", value: `v${this.nextVersion()}` },
  ]);

  protected onAction(side: "left" | "right"): void {
    if (side === "left") this.cancel.emit();
    else this.confirm.emit();
  }
}
