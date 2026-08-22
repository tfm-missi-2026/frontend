import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  PLATFORM_ID,
  inject,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

import { IconXComponent } from "@shared/icons";

import { UiButtonComponent } from "@shared/ui/button";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";

import { UiModalBackdropComponent } from "./modal-backdrop.component";
import { UiModalShellComponent } from "./modal-shell.component";
import {
  MODAL_BODY_CLASSES,
  MODAL_CLOSE_BUTTON_CLASSES,
  MODAL_CONTENT_CLASSES,
  MODAL_FOOTER_CLASSES,
  MODAL_HEADER_CLASSES,
  ROUNDED_CLASS_MAP,
  SIZE_MIN_CLASS_MAP,
} from "./modal.constants";
import type {
  UiModalAction,
  UiModalFooterAlign,
  UiModalRounded,
  UiModalSize,
} from "./modal.types";

@Component({
  selector: "UiModal",
  standalone: true,
  imports: [
    UiButtonComponent,
    UiFlexComponent,
    UiHeaderComponent,
    UiLabelComponent,
    UiModalBackdropComponent,
    UiModalShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./modal.component.html",
})
export class UiModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly className = input<string>("");
  readonly showCloseButton = input<boolean>(true);
  readonly isFullscreen = input<boolean>(false);
  readonly rounded = input<UiModalRounded>("xl");
  readonly size = input<UiModalSize>("lg");

  readonly title = input<string>("");
  readonly subtitle = input<string>("");

  readonly showFooter = input<boolean>(false);
  readonly footerAlign = input<UiModalFooterAlign>("between");
  readonly leftAction = input<UiModalAction | null>(null);
  readonly rightAction = input<UiModalAction | null>(null);

  readonly close = output<void>();
  readonly action = output<"left" | "right">();

  readonly contentClasses = computed<string>(() => {
    const radiusClass = ROUNDED_CLASS_MAP[this.rounded()];
    const sizeClass = SIZE_MIN_CLASS_MAP[this.size()];
    const base = [
      ...MODAL_CONTENT_CLASSES,
      radiusClass,
      sizeClass,
    ].join(" ");
    const extra = this.className();
    return extra ? `${base} ${extra}` : base;
  });

  readonly closeButtonClasses = computed<string>(() =>
    MODAL_CLOSE_BUTTON_CLASSES.join(" "),
  );

  readonly headerClasses = computed<string>(() => MODAL_HEADER_CLASSES.join(" "));

  readonly bodyClasses = computed<string>(() => MODAL_BODY_CLASSES.join(" "));

  readonly footerClasses = computed<string>(() => MODAL_FOOTER_CLASSES.join(" "));

  readonly hasFooter = computed<boolean>(
    () =>
      this.showFooter() &&
      (this.leftAction() !== null || this.rightAction() !== null),
  );

  protected readonly IconX = IconXComponent;

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    effect((onCleanup) => {
      if (!isPlatformBrowser(this.platformId)) return;
      document.body.style.overflow = this.isOpen() ? "hidden" : "";
      onCleanup(() => {
        document.body.style.overflow = "";
      });
    });
  }

  onBackdropClick(): void {
    if (!this.isFullscreen()) {
      this.close.emit();
    }
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  protected onLeftAction(): void {
    this.action.emit("left");
  }

  protected onRightAction(): void {
    this.action.emit("right");
  }
}
