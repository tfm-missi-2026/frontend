import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import designConstants, {
  ColorType,
  FontWeightType,
  TypographyType,
} from "@styles/constants";
import { COLOR_CLASSES } from "@styles/types/colors";
import { UiTooltipComponent } from "@shared/ui/tooltip/tooltip.component";
import { TooltipSide } from "@shared/ui/tooltip/tooltip.types";

/** Elementos HTML válidos para el slot principal. */
export type LabelAs = "small" | "span" | "p" | "strong";

/** `typographyType` → elemento HTML por defecto. */
const TYPE_TO_HTML_ELEMENT: Record<TypographyType, string> = {
  bodyXxs: "small",
  bodyXs: "span",
  bodyS: "p",
  HeadingXs: "h6",
  HeadingS: "h5",
  HeadingM: "h4",
  HeadingL: "h3",
  HeadingXl: "h2",
  HeadingXxl: "h1",
  HeadingTV: "h1",
};

/**
 * `UiLabel`
 * --------
 * Aplica tipografía (tamaño, line-height, peso) desde `designConstants`
 * y, opcionalmente, detecta overflow para envolver el texto en un
 * `UiTooltip` con el contenido completo.
 *
 * Estructura: si `showTooltip` es `true`, el `<span>` se monta dentro de un
 * `<UiTooltip variant="light" align="start" [content]="...">`. En caso
 * contrario se renderiza directamente.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiLabel",
  standalone: true,
  imports: [NgTemplateOutlet, UiTooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showTooltip()) {
      <UiTooltip
        variant="light"
        align="start"
        [content]="resolvedText()"
        [side]="tooltipSide()"
      >
        <ng-container *ngTemplateOutlet="labelTpl"></ng-container>
      </UiTooltip>
    } @else {
      <ng-container *ngTemplateOutlet="labelTpl"></ng-container>
    }

    <ng-template #labelTpl>
      <span
        #container
        class="label wrap-break-word"
        [class]="containerClasses()"
        [style]="containerStyles()"
        [attr.for]="for() || null"
        [style.font-weight]="resolvedWeight()"
        [style.font-style]="italic() ? 'italic' : null"
        [style.text-align]="align() || null"
        [style.white-space]="!wrapText() ? 'nowrap' : null"
        [style.overflow]="!wrapText() || wrapMaxLines() ? 'hidden' : null"
        [style.text-overflow]="
          !wrapText() || wrapMaxLines() ? 'ellipsis' : null
        "
        [style.display]="wrapText() && wrapMaxLines() ? '-webkit-box' : null"
        [style.-webkit-box-orient]="
          wrapText() && wrapMaxLines() ? 'vertical' : null
        "
        [style.-webkit-line-clamp]="
          wrapText() && wrapMaxLines() ? wrapMaxLines()?.toString() : null
        "
      >
        <span #textEl class="label__text">
          @if (text()) {
            {{ text() }}
          } @else {
            <ng-content></ng-content>
          }
        </span>
      </span>
    </ng-template>
  `,
  styles: [
    `
      .label {
        display: inline-block;
        max-width: 100%;
      }
    `,
  ],
})
export class UiLabelComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Tag HTML concreto. Si se omite, se infiere por `type`. */
  readonly as = input<LabelAs | undefined>(undefined);
  /** Asocia el label a un input por su `id` (atributo `for` del HTML). */
  readonly for = input<string | undefined>(undefined);
  /** Texto a mostrar (alternativa al slot). */
  readonly text = input<string | undefined>(undefined);
  /** Tipografía. */
  readonly type = input<TypographyType>("bodyXs");
  /** `font-weight` (si se omite, usa el de `fontWeightByTypographyType[type]`). */
  readonly weight = input<FontWeightType | undefined>(undefined);
  /** Color semántico. Si se omite, usa `textStrong` (gris oscuro / blanco/90 en dark). */
  readonly color = input<ColorType | undefined>(undefined);
  /** Si `false`, el texto no hace wrap (default). */
  readonly wrapText = input<boolean>(false);
  /** Máx. de líneas cuando `wrapText` es `true`. Activa line-clamp. */
  readonly wrapMaxLines = input<number | undefined>(undefined);
  /** Offset (px) para restar al espacio disponible al detectar overflow. */
  readonly availableSpaceOffset = input<number>(0);
  /** Aplica `font-style: italic`. */
  readonly italic = input<boolean>(false);
  /** Re-comprueba el overflow tras el primer render. */
  readonly refreshOnLoad = input<boolean>(false);
  /** `text-align` (CSS). */
  readonly align = input<"left" | "right" | "center" | "justify" | undefined>(
    undefined,
  );
  /** Clases extra para el contenedor. */
  readonly className = input<string>("");
  /** Lado del tooltip. */
  readonly tooltipSide = input<TooltipSide>("bottom");

  readonly containerRef = viewChild<ElementRef<HTMLElement>>("container");
  readonly textRef = viewChild<ElementRef<HTMLElement>>("textEl");

  isOverflowing = false;

  private cdr = inject(ChangeDetectorRef);
  private overflowTimeout?: ReturnType<typeof setTimeout>;

  // -------------------------------------------------------------------------
  // Getters (computed)
  // -------------------------------------------------------------------------

  readonly resolvedText = computed<string>(() => this.text() ?? "");

  readonly resolvedColorClass = computed<string>(() => {
    const c = this.color();
    return COLOR_CLASSES[c ?? "textStrong"];
  });

  readonly resolvedWeight = computed<string>(() => {
    const w =
      this.weight() ??
      designConstants.typography.fontWeightByTypographyType[this.type()];
    return designConstants.typography.fontWeight[w].toString();
  });

  readonly resolvedHtmlElement = computed<string>(
    () => this.as() ?? TYPE_TO_HTML_ELEMENT[this.type()],
  );

  readonly containerStyles = computed<Record<string, string>>(() => ({
    "font-size": designConstants.typography.fontSize[this.type()],
    "line-height": designConstants.typography.lineHeight[this.type()],
  }));

  readonly containerClasses = computed<string>(() => {
    const parts = [this.resolvedColorClass(), this.className()];
    return parts.filter(Boolean).join(" ");
  });

  readonly showTooltip = computed<boolean>(
    () => this.isOverflowing && (!this.wrapText() || !!this.wrapMaxLines()),
  );

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  ngAfterViewInit(): void {
    this.scheduleOverflowCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["text"] ||
      changes["type"] ||
      changes["wrapText"] ||
      changes["wrapMaxLines"] ||
      changes["availableSpaceOffset"]
    ) {
      this.scheduleOverflowCheck();
    }
  }

  ngOnDestroy(): void {
    if (this.overflowTimeout) clearTimeout(this.overflowTimeout);
  }

  // -------------------------------------------------------------------------
  // Overflow detection
  // -------------------------------------------------------------------------

  private scheduleOverflowCheck(): void {
    if (this.overflowTimeout) clearTimeout(this.overflowTimeout);
    this.overflowTimeout = setTimeout(() => this.checkOverflow(), 0);
  }

  private checkOverflow(): void {
    const container = this.containerRef()?.nativeElement;
    const text = this.textRef()?.nativeElement;
    if (!container || !text) return;

    const axis: "offsetHeight" | "offsetWidth" = this.wrapText()
      ? "offsetHeight"
      : "offsetWidth";
    const containerSize = container[axis] as number;
    const textSize = text[axis] as number;
    const available = containerSize - this.availableSpaceOffset();

    this.isOverflowing = textSize > available;
    this.cdr.markForCheck();
  }
}
