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
  Type,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';

import { IconProps } from '@ui/icon/icon.interface';
import { TypographyType } from '@styles/types/typography';
import designConstants from '@styles/constants';
import {
  TooltipComponent,
  TooltipSide,
  TooltipVariantType,
} from '@ui/tooltip/tooltip';
import { LoadingTimeoutWrapperComponent } from '@ui/loading-timeout-wrapper/loading-timeout-wrapper';
import { getFocusStyling } from '@utils/styling';

import {
  ButtonLinkProps,
  ButtonStyleType,
  ButtonTooltip,
  ButtonVariant,
  IconButtonProps,
} from '@ui/button/types';
import { getVariantClasses } from '@ui/button/variants';

/**
 * `IconButton`
 * ------------
 * Botón cuadrado (aspect-ratio 1:1) que contiene un único ícono.
 * Réplica Angular del `IconButton` del proyecto React.
 *
 * Mismas capacidades que `Button` (variants, styleTypes, loading
 * wrapper, tooltip, `asLink`) salvo que no tiene label.
 */
@Component({
  selector: 'IconButton',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgComponentOutlet,
    TooltipComponent,
    LoadingTimeoutWrapperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button.html',
})
export class IconButtonComponent
  implements OnInit, OnChanges, OnDestroy, IconButtonProps
{
  // -------------------------------------------------------------------------
  // Inputs
  // -------------------------------------------------------------------------

  @Input() variant: ButtonVariant = 'primary';
  @Input() styleType: ButtonStyleType = 'default';
  @Input() transparent = false;
  @Input() compact = false;
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() isSubmit = false;
  @Input() fontSize: TypographyType = 'bodyS';

  /** Componente Angular que se renderiza dentro del botón. */
  @Input({ required: true }) Icon!: Type<unknown>;
  @Input() iconProps: IconProps = {};

  /** Ancho explícito del botón. Si se omite, usa aspect-ratio 1:1. */
  @Input() width?: string;

  @Input() tooltip?: ButtonTooltip;
  @Input() tooltipSide: TooltipSide = 'bottom';
  @Input() tooltipVariant: TooltipVariantType = 'dark';
  @Input() labelText?: string;
  @Input() timeout?: number;
  @Input() disableOnTimeout = true;
  @Input() asLink = false;
  @Input() linkProps?: ButtonLinkProps;
  @Input() className = '';

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  @Output() click = new EventEmitter<MouseEvent>();

  // -------------------------------------------------------------------------
  // Estado interno
  // -------------------------------------------------------------------------

  @ViewChild('buttonTpl', { static: true }) buttonTpl!: TemplateRef<unknown>;

  private cdr = inject(ChangeDetectorRef);
  private timeoutId?: ReturnType<typeof setTimeout>;
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
  // Getters
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

  get hasActiveTimeout(): boolean {
    return !!this.timeout && this.runningTimeout;
  }

  get buttonClasses(): string {
    const aspect = this.width ? '' : 'aspect-square';
    const layout = [
      'inline-flex items-center justify-center',
      'rounded-lg',
      'cursor-pointer select-none',
      'border border-solid',
      this.compact ? 'p-1' : 'p-2',
      this.width ? `w-[${this.width}]` : '',
      aspect,
    ];

    if (this.showWrapper) {
      return [
        ...layout,
        'bg-transparent border-transparent',
        'disabled:opacity-0',
        this.getFocusClasses(),
      ].join(' ');
    }
    return [
      ...layout,
      getVariantClasses(this.variant, this.styleType, this.transparent),
      this.getFocusClasses(),
    ].join(' ');
  }

  get iconInputs(): Record<string, unknown> {
    const props: Record<string, unknown> = { ...this.iconProps };
    if (props['size'] === undefined) {
      props['size'] = designConstants.typography.fontSize[this.fontSize];
    }
    return props;
  }

  get computedRel(): string | null {
    if (!this.asLink) return null;
    const explicit = this.linkProps?.rel;
    if (explicit) return explicit;
    if (this.linkProps?.target === '_blank') return 'noopener noreferrer';
    return null;
  }

  // -------------------------------------------------------------------------
  // Privados
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

  private getFocusClasses(): string {
    return getFocusStyling('visible');
  }
}
