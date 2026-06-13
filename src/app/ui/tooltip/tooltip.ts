import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipVariantType, TooltipSide, TooltipAlign } from './tooltip.types';

// Re-exports para retro-compatibilidad con consumidores que importaban
// el nombre antiguo.
export type { TooltipVariantType, TooltipSide, TooltipAlign };
/** @deprecated Usar `TooltipVariantType`. */
export type TooltipVariant = TooltipVariantType;

/**
 * Clases Tailwind por variante. Declaramos todas las propiedades visuales
 * (fondo, texto, borde, padding, tipografía) en un único map para que
 * añadir una variante sea una sola línea.
 */
const VARIANT_CLASSES: Record<TooltipVariantType, string> = {
  light: 'bg-white text-gray-800 border border-gray-200 ' + 'px-3 py-3 text-sm leading-5', // bodyS + spacing[3]
  dark: 'bg-gray-900 text-white ' + 'px-2 py-1 text-xs leading-4.5', // bodyXxs + spacing[1]/[2]
  info:
    'bg-blue-light-50 text-blue-light-900 border border-blue-light-200 ' +
    'px-2 py-1 text-xs leading-4.5',
  success:
    'bg-success-50 text-success-900 border border-success-200 ' + 'px-2 py-1 text-xs leading-4.5',
  warning:
    'bg-warning-50 text-warning-900 border border-warning-200 ' + 'px-2 py-1 text-xs leading-4.5',
  error: 'bg-error-50 text-error-900 border border-error-200 ' + 'px-2 py-1 text-xs leading-4.5',
};

/**
 * Clases de animación por lado. Cada lado se asocia a un keyframe con la
 * dirección de slide opuesta al lado del tooltip. Las 4 keyframes están
 * definidas en `styles: []` más abajo.
 */
const SIDE_ANIMATION_CLASS: Record<TooltipSide, string> = {
  top: 'animate-tooltip-down',
  right: 'animate-tooltip-left',
  bottom: 'animate-tooltip-up',
  left: 'animate-tooltip-right',
};

/**
 * Orden de prioridad al auto-posicionar. El primero que tenga espacio
 * suficiente es el elegido. Si ninguno cabe, se usa el lado preferido
 * (`side`).
 */
const SIDE_PRIORITY: TooltipSide[] = ['top', 'right', 'bottom', 'left'];

/**
 * `Tooltip`
 * ---------
 * Tooltip con 6 variantes visuales (`light`, `dark`, `info`, `success`,
 * `warning`, `error`), 4 keyframes de slide+fade por lado, padding y
 * tipografía diferenciados para `light`, `max-width` responsive (móvil
 * `50vw`) y cierre con `Escape` o click fuera.
 *
 * Auto-posicionamiento: con `autoPosition` (default `true`), al abrir
 * se mide el espacio disponible en cada lado del trigger y del propio
 * tooltip, y se elige el primer lado (en orden de prioridad) donde
 * quepa sin salirse del viewport. `side` actúa como lado preferido.
 */
@Component({
  selector: 'Tooltip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="tooltip inline-block relative"
      (mouseenter)="onTriggerEnter()"
      (mouseleave)="onTriggerLeave()"
      (focusin)="onTriggerEnter()"
      (focusout)="onTriggerLeave()"
    >
      <ng-content></ng-content>

      @if (isOpen) {
        <span
          #tooltipBody
          class="tooltip__content pointer-events-auto whitespace-normal rounded-md text-xs leading-4.5 shadow-tooltip"
          [ngClass]="[variantClass, sideAnimationClass, className]"
          [ngStyle]="contentStyles"
          role="tooltip"
          (mouseenter)="cancelHide()"
          (mouseleave)="scheduleHide()"
        >
          @if (isStringContent) {
            {{ content }}
          } @else {
            <ng-container
              *ngTemplateOutlet="$any(content); context: $any(contentContext)"
            ></ng-container>
          }
        </span>
      }
    </span>
  `,
  styles: [
    `
      @keyframes slideUpAndFade {
        from {
          opacity: 0;
          transform: translateY(2px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideDownAndFade {
        from {
          opacity: 0;
          transform: translateY(-2px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideLeftAndFade {
        from {
          opacity: 0;
          transform: translateX(2px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideRightAndFade {
        from {
          opacity: 0;
          transform: translateX(-2px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .animate-tooltip-up {
        animation: slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .animate-tooltip-down {
        animation: slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .animate-tooltip-left {
        animation: slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .animate-tooltip-right {
        animation: slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .tooltip__content {
        max-width: 500px;
        will-change: transform, opacity;
      }

      /* Móvil: max-width 50vw. */
      @media (max-width: 767px) {
        .tooltip__content {
          max-width: 50vw;
        }
      }
    `,
  ],
})
export class TooltipComponent implements OnDestroy {
  /** Contenido a mostrar dentro del tooltip. */
  @Input() content: string | TemplateRef<unknown> = '';
  /** Variante visual. */
  @Input() variant: TooltipVariantType = 'light';
  /** Delay (ms) antes de mostrar el tooltip al entrar al trigger. */
  @Input() delayDuration = 200;
  /**
   * Lado preferido. Si `autoPosition` es `true` (default), se usa como
   * punto de partida y se ajusta automáticamente al lado que tenga
   * espacio disponible en el viewport.
   */
  @Input() side: TooltipSide = 'right';
  /**
   * Si `true` (default), al abrir se recalcula el lado en función del
   * espacio disponible en el viewport. Si `false`, se respeta `side`
   * de forma estricta.
   */
  @Input() autoPosition = true;
  /** Distancia (px) entre el trigger y el tooltip. */
  @Input() sideOffset = 10;
  /** Alineación respecto al trigger. */
  @Input() align: TooltipAlign = 'center';
  /** Clases extra para la burbuja. */
  @Input() className = '';
  /** Delay (ms) antes de ocultar al salir del trigger. */
  @Input() closeDelay = 100;

  isOpen = false;

  /** Lado efectivo tras el auto-posicionamiento. */
  private _computedSide: TooltipSide = 'top';

  @ViewChild('tooltipBody') contentRef?: ElementRef<HTMLElement>;

  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private cdr = inject(ChangeDetectorRef);
  private host = inject(ElementRef<HTMLElement>);

  get isStringContent(): boolean {
    return typeof this.content === 'string';
  }
  get contentContext(): unknown {
    return undefined;
  }

  /** Clases Tailwind de la variante actual. */
  get variantClass(): string {
    return VARIANT_CLASSES[this.variant];
  }

  /**
   * Lado que se aplica al render actual. Si `autoPosition` es `false`,
   * devuelve el `side` configurado. Si es `true`, devuelve el lado
   * recalculado en función del viewport.
   */
  get effectiveSide(): TooltipSide {
    return this.autoPosition ? this._computedSide : this.side;
  }

  /** Clases Tailwind de la animación direccional. */
  get sideAnimationClass(): string {
    return SIDE_ANIMATION_CLASS[this.effectiveSide];
  }

  /**
   * Posición absoluta calculada a partir de `side`/`align`/`sideOffset`.
   * El `max-width: 500px` / `50vw` se aplica desde los `styles: []`
   * con `.tooltip__content` (más específico que inline style).
   */
  get contentStyles(): Record<string, string> {
    const offset = `${this.sideOffset}px`;
    const side = this.effectiveSide;
    const styles: Record<string, string> = {
      position: 'absolute',
      zIndex: '9999',
    };
    const isHorizontal = side === 'top' || side === 'bottom';
    if (isHorizontal) {
      styles[side === 'top' ? 'bottom' : 'top'] = `calc(100% + ${offset})`;
      if (this.align === 'center') {
        styles['left'] = '50%';
        styles['transform'] = 'translateX(-50%)';
      } else if (this.align === 'start') {
        styles['left'] = '0';
      } else {
        styles['right'] = '0';
      }
    } else {
      styles[side === 'left' ? 'right' : 'left'] = `calc(100% + ${offset})`;
      if (this.align === 'center') {
        styles['top'] = '50%';
        styles['transform'] = 'translateY(-50%)';
      } else if (this.align === 'start') {
        styles['top'] = '0';
      } else {
        styles['bottom'] = '0';
      }
    }
    return styles;
  }

  // ----- Lifecycle -----

  ngOnDestroy(): void {
    this.clearTimers();
  }

  // ----- Triggers -----

  onTriggerEnter(): void {
    this.clearTimers();
    this.showTimer = setTimeout(() => {
      this.isOpen = true;
      this._computedSide = this.side;
      this.cdr.markForCheck();
      this.recomputePosition();
    }, this.delayDuration);
  }

  onTriggerLeave(): void {
    this.scheduleHide();
  }

  // ----- Show / hide -----

  scheduleHide(): void {
    this.clearTimers();
    this.hideTimer = setTimeout(() => {
      this.isOpen = false;
      this.cdr.markForCheck();
    }, this.closeDelay);
  }

  cancelHide(): void {
    this.clearTimers();
  }

  show(): void {
    this.cancelHide();
    this.isOpen = true;
    this._computedSide = this.side;
    this.cdr.markForCheck();
    this.recomputePosition();
  }

  hide(): void {
    this.cancelHide();
    this.isOpen = false;
    this.cdr.markForCheck();
  }

  // ----- Auto-posicionamiento -----

  /**
   * Mide el espacio disponible en cada lado del trigger y del propio
   * tooltip, y elige el primer lado (en orden de prioridad, empezando
   * por el `side` preferido) donde quepa el tooltip sin salirse del
   * viewport. Si ninguno cabe, se queda con el lado preferido.
   */
  private recomputePosition(): void {
    if (!this.autoPosition) {
      this._computedSide = this.side;
      this.cdr.markForCheck();
      return;
    }
    // requestAnimationFrame: esperamos al siguiente paint para que el
    // tooltip ya esté en el DOM y sea medible.
    requestAnimationFrame(() => {
      if (!this.isOpen) return;
      const trigger = this.host.nativeElement;
      const tooltip = this.contentRef?.nativeElement;
      if (!trigger || !tooltip) {
        this._computedSide = this.side;
        this.cdr.markForCheck();
        return;
      }

      const tRect = trigger.getBoundingClientRect();
      const pRect = tooltip.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const gap = this.sideOffset;

      // Espacio disponible en cada lado (px hasta el borde del viewport).
      const available: Record<TooltipSide, number> = {
        top: tRect.top,
        bottom: vh - tRect.bottom,
        left: tRect.left,
        right: vw - tRect.right,
      };
      // Espacio requerido: tamaño del tooltip + offset del gap.
      const required: Record<TooltipSide, number> = {
        top: pRect.height + gap,
        bottom: pRect.height + gap,
        left: pRect.width + gap,
        right: pRect.width + gap,
      };

      // Reordenamos las prioridades empezando por el `side` preferido.
      const preferredOrder: TooltipSide[] = [
        this.side,
        ...SIDE_PRIORITY.filter((s) => s !== this.side),
      ];
      let best: TooltipSide = this.side;
      for (const s of preferredOrder) {
        if (available[s] >= required[s]) {
          best = s;
          break;
        }
      }

      this._computedSide = best;
      this.cdr.markForCheck();
    });
  }

  // ----- Timers -----

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

  // ----- Document listeners -----

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.hide();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const root = this.host.nativeElement;
    if (root && !root.contains(event.target as Node)) this.hide();
  }
}
