import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from "@angular/core";

import { MODAL_SHELL_HOST_CLASSES } from "./modal-shell.constants";

@Component({
  selector: "UiModalShell",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "hostClasses()",
    "[attr.data-ui-modal-shell]": "''",
  },
  template: `<ng-content></ng-content>`,
})
export class UiModalShellComponent {
  readonly backdropClose = output<void>();
  readonly clickCloses = input<boolean>(true);

  readonly hostClasses = computed<string>(() => MODAL_SHELL_HOST_CLASSES.join(" "));

  @HostListener("document:keydown.escape")
  protected onEscape(): void {
    if (this.clickCloses()) {
      this.backdropClose.emit();
    }
  }
}
