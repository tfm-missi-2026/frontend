import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
} from '@angular/core';
import {
  NgComponentOutlet,
  NgTemplateOutlet,
} from '@angular/common';

import { IconProps } from '@ui/icon/icon.interface';
import { TypographyType } from '@styles/types/typography';
import designConstants from '@styles/constants';
import {
  TooltipComponent,
  TooltipSide,
  TooltipVariantType,
} from '@ui/tooltip/tooltip';
import { LabelComponent } from '@ui/label/label';
import { LoadingTimeoutWrapperComponent } from '@ui/loading-timeout-wrapper/loading-timeout-wrapper';
import { getFocusStyling } from '@utils/styling';

import {
  ButtonProps,
  ButtonStyleType,
  ButtonTooltip,
  ButtonVariant,
} from './types';
import { getVariantClasses } from './variants';

/**
 * `Button`
 * --------
 * Botón del design system. Réplica Angular del `Button` del proyecto
 * React (styled-components) con la misma API.
 *
 * Capacidades:
 *  - 3 variants (`primary` | `secondary` | `tertiary`) × 5 styleTypes.
 *  - Íconos izquierda/derecha como **componentes Angular** (`Type<unknown>`).
 *  - Tooltip integrado con el `TooltipComponent` del DS.
 *  - Loading wrapper con progress bar (`timeout` + `isLoading`).
 *  - Foco accesible con `focus-visible` (vía `getFocusStyling`).
 *  - Soporte de `<a>` vía `asLink` + `linkProps`.
 *  - Reset manual del timer: el consumidor lo invoca con
 *    `viewChild.button.resetTimeout()`.
 */
@Component({
  selector: 'Button',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    TooltipComponent,
    LabelComponent,
    LoadingTimeoutWrapperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.html',
})
export class ButtonComponent implements OnInit, OnChanges, OnDestroy {
  // -------------------------------------------------------------------------
  // Inputs
  // -------------------------------------------------------------------------

  @Input() variant: ButtonVariant = 'primary';
  @Input() styleType: ButtonStyleType = 'default';
  @Input() transparent = false;
  @Input() compact = false;
  @Input() fullWidth = false;
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() isSubmit = false;
  @Input() fontSize: TypographyType = 'bodyS';

  /** Texto del botón (alternativa al slot `<ng-content>` o a `labelRender`). */
  @Input() label?: string;

  /** Template alternativa a `label` para contenido complejo. */
  @Input() labelRender?: TemplateRef<unknown>;

  /** Componente Angular a la izquierda del label. */
  @Input() LeftIcon?: Type<unknown>;

  /** Componente Angular a la derecha del label. */
  @Input() RightIcon?: Type<unknown>;

  /** Props para los íconos (size por defecto = `fontSize` en px). */
  @Input() iconProps: IconProps = {};

  /** Tooltip opcional (string o `TemplateRef`). */
  @Input() tooltip?: ButtonTooltip;
  @Input() tooltipSide: TooltipSide = 'bottom';
  @Input() tooltipVariant: TooltipVariantType = 'dark';

  /** Mapea a `aria-label` (no se reenvía como atributo suelto). */
  @Input() labelText?: string;

  /** Duración del timer (ms) — activa la progress bar. */
  @Input() timeout?: number;
  @Input() disableOnTimeout = true;

  /** Si `true`, se renderiza como `<a>` y se aplican `linkProps`. */
  @Input() asLink = false;
  @Input() linkProps?: { href?: string; target?: string; download?: boolean | string; rel?: string };

  /** Clases extra para el contenedor exterior. */
  @Input() className = '';

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  /**
   * Emite el `MouseEvent` nativo al hacer click.
   * Si el consumidor quiere resetear el `timeout` programáticamente,
   * debe llamar a `resetTimeout()` (público) desde su handler.
   */
  @Output() click = new EventEmitter<MouseEvent>();

  // -------------------------------------------------------------------------
  // Estado interno
  // -------------------------------------------------------------------------

  @ViewChild('buttonTpl', { static: true }) buttonTpl!: TemplateRef<unknown>;

  private cdr = inject(ChangeDetectorRef);
  private timeoutId?: ReturnType<typeof setTimeout>;

  /** `true` mientras la progress bar del `timeout` está corriendo. */
  runningTimeout = false;

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  ngOnInit(): void {
    if (this.timeout) this.startTimeout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeout']) {
      if (this.timeout) this.startTimeout();
      else this.clearTimeout();
    }
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  // -------------------------------------------------------------------------
  // API pública
  // -------------------------------------------------------------------------

  /**
   * Reinicia el `timeout`. Útil cuando el consumidor quiere resetear
   * el timer desde su handler de click (vía `viewChild.button.resetTimeout()`).
   * Réplica del segundo argumento que el `Button` React pasa a `onClick`.
   */
  resetTimeout = (): void => {
    this.clearTimeout();
    if (this.timeout) {
      this.runningTimeout = true;
      this.cdr.markForCheck();
      this.timeoutId = setTimeout(() => {
        this.runningTimeout = false;
        this.cdr.markForCheck();
      }, this.timeout);
    }
  };

  onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.click.emit(event);
  }

  // -------------------------------------------------------------------------
  // Timeout interno
  // -------------------------------------------------------------------------

  private startTimeout(): void {
    this.clearTimeout();
    this.runningTimeout = true;
    this.cdr.markForCheck();
    this.timeoutId = setTimeout(() => {
      this.runningTimeout = false;
      this.cdr.markForCheck();
    }, this.timeout);
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  // -------------------------------------------------------------------------
  // Getters computados
  // -------------------------------------------------------------------------

  get isEffectivelyDisabled(): boolean {
    return (
      this.disabled ||
      this.isLoading ||
      (this.runningTimeout && this.disableOnTimeout)
    );
  }

  get showWrapper(): boolean {
    return this.isLoading || this.runningTimeout;
  }

  /** Clases del `<button>` / `<a>` real. */
  get buttonClasses(): string {
    const baseLayout = [
      'inline-flex items-center justify-center',
      'gap-2', // designConstants.spacing[2]
      'min-w-10', // 40px
      'rounded-lg', // designConstants.borderRadius[2]
      'cursor-pointer select-none',
      'border border-solid',
      this.compact ? 'px-2 py-1' : 'px-3 py-2', // designConstants.spacing
      this.fullWidth && !this.showWrapper ? 'w-full' : '',
    ];

    if (this.showWrapper) {
      // El wrapper aporta el bg/border/color → el botón es transparente.
      return [
        ...baseLayout,
        'bg-transparent border-transparent',
        'disabled:opacity-0', // invisible cuando el wrapper domina
        this.getFocusClasses(),
      ].join(' ');
    }

    return [
      ...baseLayout,
      getVariantClasses(this.variant, this.styleType, this.transparent),
      this.getFocusClasses(),
    ].join(' ');
  }

  /** Tamaño efectivo del ícono en px (resuelve `TypographyType` → px). */
  get resolvedIconSize(): string {
    return designConstants.typography.fontSize[this.fontSize];
  }

  /** Inputs para `*ngComponentOutlet` del `LeftIcon`. */
  get leftIconInputs(): Record<string, unknown> | undefined {
    if (!this.LeftIcon) return undefined;
    return this.buildIconInputs();
  }

  /** Inputs para `*ngComponentOutlet` del `RightIcon`. */
  get rightIconInputs(): Record<string, unknown> | undefined {
    if (!this.RightIcon) return undefined;
    return this.buildIconInputs();
  }

  // -------------------------------------------------------------------------
  // Helpers privados
  // -------------------------------------------------------------------------

  private buildIconInputs(): Record<string, unknown> {
    const props: Record<string, unknown> = { ...this.iconProps };
    if (props['size'] === undefined) {
      props['size'] = this.resolvedIconSize;
    }
    if (props['width'] === undefined && props['height'] === undefined) {
      // Si no hay width/height explícitos, usa el size (comportamiento React)
    }
    return props;
  }

  private getFocusClasses(): string {
    return getFocusStyling('visible');
  }

  /** `rel` automático si `target="_blank"` (anti-tabnabbing). */
  get computedRel(): string | null {
    if (!this.asLink) return null;
    const explicit = this.linkProps?.rel;
    if (explicit) return explicit;
    if (this.linkProps?.target === '_blank') return 'noopener noreferrer';
    return null;
  }

  /** Indicador de si el wrapper está mostrando la progress bar. */
  get hasActiveTimeout(): boolean {
    return !!this.timeout && this.runningTimeout;
  }
}
