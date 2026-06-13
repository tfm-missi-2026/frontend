import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';
import {
  computePosition,
  flip,
  offset,
  shift,
  autoUpdate,
  type Placement,
} from '@floating-ui/dom';

/** Lados soportados (alineados con `TooltipSide` del componente). */
export type TooltipDirectiveSide = 'top' | 'right' | 'bottom' | 'left';
/** Variantes visuales (mismas que `TooltipVariantType`). */
export type TooltipDirectiveVariant =
  | 'light'
  | 'dark'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

const VARIANT_CLASSES: Record<TooltipDirectiveVariant, string> = {
  light: 'bg-white text-gray-800 border border-gray-200 px-3 py-3 text-sm leading-5',
  dark: 'bg-gray-900 text-white px-2 py-1 text-xs leading-4.5',
  info: 'bg-blue-light-50 text-blue-light-900 border border-blue-light-200 px-2 py-1 text-xs leading-4.5',
  success: 'bg-success-50 text-success-900 border border-success-200 px-2 py-1 text-xs leading-4.5',
  warning: 'bg-warning-50 text-warning-900 border border-warning-200 px-2 py-1 text-xs leading-4.5',
  error: 'bg-error-50 text-error-900 border border-error-200 px-2 py-1 text-xs leading-4.5',
};

/**
 * `appTooltip`
 * -----------
 * Directiva que muestra un tooltip al hacer hover/focus sobre el elemento
 * al que se aplica. Equivalente en Angular al patrón de Radix UI:
 *
 * - **Trigger asChild**: el elemento host ES el trigger (no se envuelve
 *   nada, evitando el problema de `<ng-content>` que intercepta el slot).
 * - **Portal**: el contenido se monta en `document.body` para evitar
 *   clipping por `overflow: hidden` y conflictos de `z-index` /
 *   stacking context con ancestros.
 * - **Popper (Floating UI)**: posicionamiento con detección de colisión
 *   (`flip`) que cambia automáticamente al lado con espacio si el
 *   preferido no cabe. Se reposiciona en scroll y resize (`autoUpdate`).
 *
 * Uso:
 * ```html
 * <button appTooltip="Guardar" tooltipSide="right">Guardar</button>
 * ```
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  /** Contenido del tooltip. Si es vacío/undefined, no se muestra. */
  @Input('appTooltip') content?: string;
  /** Lado preferido. Si no cabe, Floating UI hace flip a otro lado. */
  @Input() tooltipSide: TooltipDirectiveSide = 'right';
  /** Offset (px) entre el trigger y la burbuja. */
  @Input() tooltipSideOffset = 8;
  /** Delay (ms) antes de mostrar. */
  @Input() tooltipDelay = 200;
  /** Delay (ms) antes de ocultar. */
  @Input() tooltipCloseDelay = 100;
  /** Variante visual. */
  @Input() tooltipVariant: TooltipDirectiveVariant = 'dark';

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer = inject(Renderer2);

  private tooltipEl?: HTMLElement;
  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private cleanupAutoUpdate?: () => void;

  // ----- Triggers -----

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.cancelHide();
    this.showTimer = setTimeout(() => this.show(), this.tooltipDelay);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.cancelShow();
    this.hideTimer = setTimeout(() => this.hide(), this.tooltipCloseDelay);
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.cancelHide();
    this.showTimer = setTimeout(() => this.show(), this.tooltipDelay);
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.cancelShow();
    this.hideTimer = setTimeout(() => this.hide(), this.tooltipCloseDelay);
  }

  // ----- Show / hide -----

  show(): void {
    if (this.tooltipEl) return;
    if (!this.content) return;

    const el = this.renderer.createElement('span') as HTMLElement;
    el.setAttribute('role', 'tooltip');
    el.className =
      'pointer-events-none fixed top-0 left-0 z-9999 max-w-[500px] whitespace-normal ' +
      'rounded-md shadow-tooltip ' +
      VARIANT_CLASSES[this.tooltipVariant];
    el.textContent = this.content ?? '';
    // Móvil: max-width 50vw
    el.style.maxWidth = window.innerWidth < 768 ? '50vw' : '500px';

    this.renderer.appendChild(document.body, el);
    this.tooltipEl = el;

    const trigger = this.host.nativeElement;
    const placement: Placement = this.tooltipSide;

    // autoUpdate: reposiciona en scroll y resize, y limpia al llamar
    // al cleanup.
    this.cleanupAutoUpdate = autoUpdate(trigger, el, () => {
      computePosition(trigger, el, {
        placement,
        strategy: 'fixed',
        middleware: [
          offset(this.tooltipSideOffset),
          flip({ padding: 8 }),
          shift({ padding: 8 }),
        ],
      }).then(({ x, y }) => {
        Object.assign(el.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });
  }

  hide(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = undefined;
    }
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = undefined;
    }
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = undefined;
    }
  }

  // ----- Timers -----

  private cancelShow(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = undefined;
    }
  }
  private cancelHide(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
