import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";

import { MODAL_BACKDROP_HOST_CLASSES } from "./modal-backdrop.constants";

@Component({
  selector: "UiModalBackdrop",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClasses()",
    "(click)": "onClick($event)",
  },
  template: ``,
})
export class UiModalBackdropComponent {
  readonly backdropClose = output<void>();
  readonly clickCloses = input<boolean>(true);

  readonly hostClasses = computed<string>(() =>
    MODAL_BACKDROP_HOST_CLASSES.join(" "),
  );

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.clickCloses()) {
      this.backdropClose.emit();
    }
  }
}
