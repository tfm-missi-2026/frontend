import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import designConstants, { TypographyType, FontWeightType, ColorType } from '@styles/constants';
import { TooltipComponent } from '@ui/tooltip/tooltip';
import { TooltipSide } from '@ui/tooltip/tooltip.types';

/** Elementos HTML válidos para el slot principal. */
export type LabelAs = 'small' | 'span' | 'p' | 'strong';

/** `typographyType` → elemento HTML por defecto. */
const TYPE_TO_HTML_ELEMENT: Record<TypographyType, string> = {
  bodyXxs: 'small',
  bodyXs: 'span',
  bodyS: 'p',
  HeadingXs: 'h6',
  HeadingS: 'h5',
  HeadingM: 'h4',
  HeadingL: 'h3',
  HeadingXl: 'h2',
  HeadingXxl: 'h1',
  HeadingTV: 'h1',
};

/**
 * `Label`
 * -------
 * Aplica tipografía (tamaño, line-height, peso) desde `designConstants`
 * y, opcionalmente, detecta overflow para envolver el texto en un
 * `Tooltip` con el contenido completo.
 *
 * Estructura: si `showTooltip` es `true`, el `<span>` se monta dentro de un
 * `<Tooltip variant="light" align="start" [content]="...">`. En caso contrario
 * se renderiza directamente.
 */
@Component({
  selector: 'Label',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showTooltip) {
      <Tooltip
        variant="light"
        align="start"
        [content]="resolvedText"
        [side]="tooltipSide"
      >
        <span
          #container
          class="label wrap-break-word"
          [ngClass]="className"
          [ngStyle]="containerStyles"
          [attr.for]="for || null"
          [style.color]="resolvedColor"
          [style.font-weight]="resolvedWeight"
          [style.font-style]="italic ? 'italic' : null"
          [style.text-align]="align || null"
          [style.white-space]="!wrapText ? 'nowrap' : null"
          [style.overflow]="!wrapText || wrapMaxLines ? 'hidden' : null"
          [style.text-overflow]="!wrapText || wrapMaxLines ? 'ellipsis' : null"
          [style.display]="wrapText && wrapMaxLines ? '-webkit-box' : null"
          [style.-webkit-box-orient]="wrapText && wrapMaxLines ? 'vertical' : null"
          [style.-webkit-line-clamp]="wrapText && wrapMaxLines ? wrapMaxLines.toString() : null"
        >
          <span #textEl class="label__text">
            @if (text) {
              {{ text }}
            } @else {
              <ng-content></ng-content>
            }
          </span>
        </span>
      </Tooltip>
    } @else {
      <span
        #container
        class="label wrap-break-word"
        [ngClass]="className"
        [ngStyle]="containerStyles"
        [attr.for]="for || null"
        [style.color]="resolvedColor"
        [style.font-weight]="resolvedWeight"
        [style.font-style]="italic ? 'italic' : null"
        [style.text-align]="align || null"
        [style.white-space]="!wrapText ? 'nowrap' : null"
        [style.overflow]="!wrapText || wrapMaxLines ? 'hidden' : null"
        [style.text-overflow]="!wrapText || wrapMaxLines ? 'ellipsis' : null"
        [style.display]="wrapText && wrapMaxLines ? '-webkit-box' : null"
        [style.-webkit-box-orient]="wrapText && wrapMaxLines ? 'vertical' : null"
        [style.-webkit-line-clamp]="wrapText && wrapMaxLines ? wrapMaxLines.toString() : null"
      >
        <span #textEl class="label__text">
          @if (text) {
            {{ text }}
          } @else {
            <ng-content></ng-content>
          }
        </span>
      </span>
    }
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
export class LabelComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Tag HTML concreto. Si se omite, se infiere por `type`. */
  @Input() as?: LabelAs;
  /** Asocia el label a un input por su `id` (atributo `for` del HTML). */
  @Input() for?: string;
  /** Texto a mostrar (alternativa al slot). */
  @Input() text?: string;
  /** Tipografía. */
  @Input() type: TypographyType = 'bodyXs';
  /** `font-weight` (si se omite, usa el de `fontWeightByTypographyType[type]`). */
  @Input() weight?: FontWeightType;
  /** Color semántico. */
  @Input() color?: ColorType;
  /** Si `false`, el texto no hace wrap (default). */
  @Input() wrapText = false;
  /** Máx. de líneas cuando `wrapText` es `true`. Activa line-clamp. */
  @Input() wrapMaxLines?: number;
  /** Offset (px) para restar al espacio disponible al detectar overflow. */
  @Input() availableSpaceOffset = 0;
  /** Aplica `font-style: italic`. */
  @Input() italic = false;
  /** Re-comprueba el overflow tras el primer render. */
  @Input() refreshOnLoad = false;
  /** `text-align` (CSS). */
  @Input() align?: 'left' | 'right' | 'center' | 'justify';
  /** Clases extra para el contenedor. */
  @Input() className = '';
  /** Lado del tooltip. */
  @Input() tooltipSide: TooltipSide = 'bottom';

  @ViewChild('container') containerRef?: ElementRef<HTMLElement>;
  @ViewChild('textEl') textRef?: ElementRef<HTMLElement>;

  isOverflowing = false;

  private cdr = inject(ChangeDetectorRef);
  private overflowTimeout?: ReturnType<typeof setTimeout>;

  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------

  get resolvedText(): string {
    return this.text ?? '';
  }

  get resolvedColor(): string {
    if (!this.color) return 'currentColor';
    return designConstants.colors[this.color] ?? 'currentColor';
  }

  get resolvedWeight(): string {
    const w =
      this.weight ?? designConstants.typography.fontWeightByTypographyType[this.type];
    return designConstants.typography.fontWeight[w].toString();
  }

  get resolvedHtmlElement(): string {
    return this.as ?? TYPE_TO_HTML_ELEMENT[this.type];
  }

  get containerStyles(): Record<string, string> {
    return {
      'font-size': designConstants.typography.fontSize[this.type],
      'line-height': designConstants.typography.lineHeight[this.type],
    };
  }

  get showTooltip(): boolean {
    return this.isOverflowing && (!this.wrapText || !!this.wrapMaxLines);
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  ngAfterViewInit(): void {
    this.scheduleOverflowCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['text'] ||
      changes['type'] ||
      changes['wrapText'] ||
      changes['wrapMaxLines'] ||
      changes['availableSpaceOffset']
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
    const container = this.containerRef?.nativeElement;
    const text = this.textRef?.nativeElement;
    if (!container || !text) return;

    const axis: 'offsetHeight' | 'offsetWidth' = this.wrapText
      ? 'offsetHeight'
      : 'offsetWidth';
    const containerSize = container[axis] as number;
    const textSize = text[axis] as number;
    const available = containerSize - this.availableSpaceOffset;

    this.isOverflowing = textSize > available;
    this.cdr.markForCheck();
  }
}
