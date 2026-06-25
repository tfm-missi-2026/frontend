import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";

import { ThemeService } from "@shared/services/theme.service";

import { TooltipAlign, TooltipSide, TooltipVariantType } from "./tooltip.types";
import {
  DARK_VARIANT_CLASSES,
  LIGHT_VARIANT_CLASSES,
  SIDE_TRANSLATE_CLASSES,
} from "./tooltip.variants";
import { buildPositions, nextTooltipDomId } from "./tooltip.utils";

export type { TooltipVariantType, TooltipSide, TooltipAlign };

const BASE_TRANSITION_CLASSES =
  "transition-opacity transition-transform duration-200 ease-out";

/**
 * `UiTooltip`
 * -----------
 * Tooltip accesible basado en Angular CDK Overlay.
 *
 * El propio host (`<UiTooltip>`) actúa como trigger, así que no hace
 * falta un wrapper intermedio: los listeners y el `aria-describedby`
 * se declaran vía `host: {}`.
 *
 *  - 6 variantes (`light`, `dark`, `info`, `success`, `warning`, `error`)
 *    reactivas al tema global.
 *  - 4 lados + auto-flip cuando el lado preferido no cabe.
 *  - Animaciones con clases Tailwind (fade + `translate-*` por lado).
 *  - Soporte de `string` o `TemplateRef` como contenido.
 *  - Anti-flicker: entrar a la burbuja cancela el hide timer.
 *  - Reposicionamiento en `scroll`/`resize`.
 */
@Component({
  selector: "UiTooltip",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "inline-block relative",
    "[attr.aria-describedby]": "isOpen() ? tooltipId : null",
    "(mouseenter)": "onTriggerEnter()",
    "(mouseleave)": "onTriggerLeave()",
    "(focusin)": "onTriggerEnter()",
    "(focusout)": "onTriggerLeave()",
  },
  templateUrl: "./tooltip.component.html",
})
export class UiTooltipComponent implements OnDestroy {
  readonly content = input<string | TemplateRef<unknown>>("");
  readonly variant = input<TooltipVariantType>("light");
  readonly delayDuration = input<number>(200);
  readonly side = input<TooltipSide>("top");
  readonly autoPosition = input<boolean>(true);
  readonly sideOffset = input<number>(10);
  readonly align = input<TooltipAlign>("center");
  readonly className = input<string>("");
  readonly closeDelay = input<number>(100);

  readonly isOpen = signal(false);
  readonly tooltipId = nextTooltipDomId();

  private readonly themeService = inject(ThemeService);
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly contentTplRef = viewChild<TemplateRef<unknown>>("contentTpl");

  private readonly currentTheme = toSignal(this.themeService.theme$, {
    initialValue: "light" as "light" | "dark",
  });
  private readonly isDark = computed<boolean>(
    () => this.currentTheme() === "dark",
  );

  readonly isStringContent = computed<boolean>(
    () => typeof this.content() === "string",
  );

  readonly variantClasses = computed<string>(() =>
    this.isDark()
      ? DARK_VARIANT_CLASSES[this.variant()]
      : LIGHT_VARIANT_CLASSES[this.variant()],
  );

  readonly translateClass = computed<string>(() => {
    const side = this.side();
    return this.isOpen()
      ? SIDE_TRANSLATE_CLASSES[side].to
      : SIDE_TRANSLATE_CLASSES[side].from;
  });

  readonly opacityClass = computed<string>(() =>
    this.isOpen() ? "opacity-100" : "opacity-0",
  );

  readonly contentClasses = computed<string>(() =>
    `${this.variantClasses()} ${this.opacityClass()} ${this.translateClass()} ${BASE_TRANSITION_CLASSES} ${this.className()}`.trim(),
  );

  private overlayRef?: OverlayRef;
  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private viewportListeners?: { remove(): void };

  constructor() {
    this.destroyRef.onDestroy(() => this.disposeOverlay());

    effect(() => {
      if (!this.overlayRef) return;
      this.overlayRef.updatePositionStrategy(
        this.overlay
          .position()
          .flexibleConnectedTo(this.host.nativeElement)
          .withPositions(
            buildPositions(
              this.side(),
              this.align(),
              this.sideOffset(),
              this.autoPosition(),
            ),
          )
          .withFlexibleDimensions(false)
          .withPush(true),
      );
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.disposeOverlay();
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.isOpen()) this.hide();
  }

  onTriggerEnter(): void {
    this.clearTimers();
    this.showTimer = setTimeout(() => this.show(), this.delayDuration());
  }

  onTriggerLeave(): void {
    this.scheduleHide();
  }

  show(): void {
    this.clearTimers();
    if (this.overlayRef) {
      this.isOpen.set(true);
      return;
    }
    const tpl = this.contentTplRef();
    if (!tpl) return;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.host.nativeElement)
        .withPositions(
          buildPositions(
            this.side(),
            this.align(),
            this.sideOffset(),
            this.autoPosition(),
          ),
        )
        .withFlexibleDimensions(false)
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: "ui-tooltip-panel",
    });

    this.overlayRef.attach(new TemplatePortal(tpl, this.viewContainerRef));

    const el = this.overlayRef.overlayElement;
    el.addEventListener("mouseenter", this.onOverlayEnter);
    el.addEventListener("mouseleave", this.onOverlayLeave);

    this.installViewportListeners();
    this.isOpen.set(true);
  }

  hide(): void {
    this.clearTimers();
    if (!this.overlayRef) return;
    this.disposeOverlay();
    this.isOpen.set(false);
  }

  scheduleHide(): void {
    this.clearTimers();
    this.hideTimer = setTimeout(() => this.hide(), this.closeDelay());
  }

  private onOverlayEnter = (): void => {
    this.clearTimers();
  };

  private onOverlayLeave = (): void => {
    this.scheduleHide();
  };

  private installViewportListeners(): void {
    if (this.viewportListeners) return;
    const onChange = (): void => this.overlayRef?.updatePosition();
    window.addEventListener("scroll", onChange, true);
    window.addEventListener("resize", onChange);
    this.viewportListeners = {
      remove: () => {
        window.removeEventListener("scroll", onChange, true);
        window.removeEventListener("resize", onChange);
      },
    };
  }

  private disposeOverlay(): void {
    this.viewportListeners?.remove();
    this.viewportListeners = undefined;
    if (this.overlayRef) {
      const el = this.overlayRef.overlayElement;
      el.removeEventListener("mouseenter", this.onOverlayEnter);
      el.removeEventListener("mouseleave", this.onOverlayLeave);
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private clearTimers(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = undefined;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
  }
}
