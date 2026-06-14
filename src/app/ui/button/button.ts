import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  Type,
} from '@angular/core';

import { IconProps } from '@ui/icon/icon.interface';
import { TypographyType } from '@styles/types/typography';
import designConstants from '@styles/constants';
import {
  UiTooltipComponent,
  TooltipSide,
  TooltipVariantType,
} from '@ui/tooltip/tooltip';
import { UiLabelComponent } from '@ui/label/label';
import { UiLoadingTimeoutWrapperComponent } from '@ui/loading-timeout-wrapper/loading-timeout-wrapper';
import { getFocusStyling } from '@utils/styling';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';

import {
  ButtonProps,
  ButtonStyleType,
  ButtonTooltip,
  ButtonVariant,
} from './types';
import { getVariantClasses } from './variants';

/**
 * `UiButton`
 * ----------
 * Botón del design system.
 *
 * Capacidades:
 *  - 3 variants (`primary` | `secondary` | `tertiary`) × 5 styleTypes.
 *  - Íconos izquierda/derecha como **componentes Angular** (`Type<unknown>`).
 *  - Tooltip integrado con el `UiTooltipComponent` del DS.
 *  - Loading wrapper con progress bar (`timeout` + `isLoading`).
 *  - Foco accesible con `focus-visible` (vía `getFocusStyling`).
 *  - Soporte de `<a>` vía `asLink` + `linkProps`.
 *  - Reset manual del timer: el consumidor lo invoca con
 *    `viewChild.button.resetTimeout()`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: 'UiButton',
  standalone: true,
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    UiTooltipComponent,
    UiLabelComponent,
    UiLoadingTimeoutWrapperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #buttonTpl>
      @if (asLink()) {
        <a
          [class]="buttonClasses()"
          [attr.href]="linkProps()?.href || null"
          [attr.target]="linkProps()?.target || null"
          [attr.download]="linkProps()?.download || null"
          [attr.rel]="computedRel()"
          [attr.aria-label]="labelText() || null"
          (click)="onClick($event)"
          data-testid="button"
        >
          @if (LeftIcon()) {
            <ng-container
              *ngComponentOutlet="LeftIcon() ?? null; inputs: leftIconInputs()"
            ></ng-container>
          }

          @if (labelRender()) {
            <ng-container *ngTemplateOutlet="labelRender()"></ng-container>
          } @else if (label(); as lbl) {
            <UiLabel [type]="fontSize()" [text]="lbl" weight="medium"></UiLabel>
          } @else {
            <ng-content></ng-content>
          }

          @if (RightIcon()) {
            <ng-container
              *ngComponentOutlet="RightIcon() ?? null; inputs: rightIconInputs()"
            ></ng-container>
          }
        </a>
      } @else {
        <button
          [class]="buttonClasses()"
          [type]="isSubmit() ? 'submit' : 'button'"
          [disabled]="isEffectivelyDisabled()"
          [attr.aria-label]="labelText() || null"
          (click)="onClick($event)"
          data-testid="button"
        >
          @if (LeftIcon()) {
            <ng-container
              *ngComponentOutlet="LeftIcon() ?? null; inputs: leftIconInputs()"
            ></ng-container>
          }

          @if (labelRender()) {
            <ng-container *ngTemplateOutlet="labelRender()"></ng-container>
          } @else if (label(); as lbl) {
            <UiLabel [type]="fontSize()" [text]="lbl" weight="medium"></UiLabel>
          } @else {
            <ng-content></ng-content>
          }

          @if (RightIcon()) {
            <ng-container
              *ngComponentOutlet="RightIcon() ?? null; inputs: rightIconInputs()"
            ></ng-container>
          }
        </button>
      }
    </ng-template>

    @if (showWrapper()) {
      <UiLoadingTimeoutWrapper
        [variant]="variant()"
        [styleType]="styleType()"
        [fullWidth]="fullWidth()"
        [transparent]="transparent()"
        [timeout]="hasActiveTimeout() ? timeout() : undefined"
        [className]="className()"
      >
        @if (tooltip() !== undefined && tooltip() !== null) {
          <UiTooltip
            [content]="tooltip()!"
            [variant]="tooltipVariant()"
            [side]="tooltipSide()"
          >
            <ng-container *ngTemplateOutlet="buttonTpl"></ng-container>
          </UiTooltip>
        } @else {
          <ng-container *ngTemplateOutlet="buttonTpl"></ng-container>
        }
      </UiLoadingTimeoutWrapper>
    } @else if (tooltip() !== undefined && tooltip() !== null) {
      <UiTooltip
        [content]="tooltip()!"
        [variant]="tooltipVariant()"
        [side]="tooltipSide()"
      >
        <ng-container *ngTemplateOutlet="buttonTpl"></ng-container>
      </UiTooltip>
    } @else {
      <ng-container *ngTemplateOutlet="buttonTpl"></ng-container>
    }
  `,
})
export class UiButtonComponent implements OnDestroy {
  readonly variant = input<ButtonVariant>('primary');
  readonly styleType = input<ButtonStyleType>('default');
  readonly transparent = input<boolean>(false);
  readonly compact = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly isSubmit = input<boolean>(false);
  readonly fontSize = input<TypographyType>('bodyS');

  /** Texto del botón (alternativa al slot `<ng-content>` o a `labelRender`). */
  readonly label = input<string | undefined>(undefined);

  /** Template alternativa a `label` para contenido complejo. */
  readonly labelRender = input<TemplateRef<unknown> | undefined>(undefined);

  /** Componente Angular a la izquierda del label. */
  readonly LeftIcon = input<Type<unknown> | undefined>(undefined);

  /** Componente Angular a la derecha del label. */
  readonly RightIcon = input<Type<unknown> | undefined>(undefined);

  /** Props para los íconos (size por defecto = `fontSize` en px). */
  readonly iconProps = input<IconProps>({});

  /** Tooltip opcional (string o `TemplateRef`). */
  readonly tooltip = input<ButtonTooltip | undefined>(undefined);
  readonly tooltipSide = input<TooltipSide>('bottom');
  readonly tooltipVariant = input<TooltipVariantType>('dark');

  /** Mapea a `aria-label` (no se reenvía como atributo suelto). */
  readonly labelText = input<string | undefined>(undefined);

  /** Duración del timer (ms) — activa la progress bar. */
  readonly timeout = input<number | undefined>(undefined);
  readonly disableOnTimeout = input<boolean>(true);

  /** Si `true`, se renderiza como `<a>` y se aplican `linkProps`. */
  readonly asLink = input<boolean>(false);
  readonly linkProps = input<
    | {
        href?: string;
        target?: string;
        download?: boolean | string;
        rel?: string;
      }
    | undefined
  >(undefined);

  /** Clases extra para el contenedor exterior. */
  readonly className = input<string>('');

  /** Emite el `MouseEvent` nativo al hacer click. */
  readonly click = output<MouseEvent>();

  private cdr = inject(ChangeDetectorRef);
  private timeoutId?: ReturnType<typeof setTimeout>;

  /** `true` mientras la progress bar del `timeout` está corriendo. */
  private readonly _runningTimeout = signal(false);

  /** Effect-like: re-arrancamos el timer cuando cambia `timeout()` o `isLoading()`. */
  private timeoutWatcher = (): void => {
    // Iniciamos el timer en ngOnInit equivalente (primer render).
    if (this.timeout() !== undefined) this.startTimeout();
  };

  ngOnInit(): void {
    this.timeoutWatcher();
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  /**
   * Reinicia el `timeout`. Útil cuando el consumidor quiere resetear
   * el timer desde su handler de click.
   */
  resetTimeout = (): void => {
    this.clearTimeout();
    if (this.timeout() !== undefined) {
      this._runningTimeout.set(true);
      this.cdr.markForCheck();
      this.timeoutId = setTimeout(() => {
        this._runningTimeout.set(false);
        this.cdr.markForCheck();
      }, this.timeout()!);
    }
  };

  onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.click.emit(event);
  }

  private startTimeout(): void {
    this.clearTimeout();
    this._runningTimeout.set(true);
    this.cdr.markForCheck();
    this.timeoutId = setTimeout(() => {
      this._runningTimeout.set(false);
      this.cdr.markForCheck();
    }, this.timeout()!);
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  readonly isEffectivelyDisabled = computed<boolean>(
    () =>
      this.disabled() ||
      this.isLoading() ||
      (this._runningTimeout() && this.disableOnTimeout()),
  );

  readonly showWrapper = computed<boolean>(
    () => this.isLoading() || this._runningTimeout(),
  );

  /** Clases del `<button>` / `<a>` real. */
  readonly buttonClasses = computed<string>(() => {
    const baseLayout = [
      'inline-flex items-center justify-center',
      'gap-2',
      'min-w-10',
      'rounded-lg',
      'cursor-pointer select-none',
      'border border-solid',
      this.compact() ? 'px-2 py-1' : 'px-3 py-2',
      this.fullWidth() && !this.showWrapper() ? 'w-full' : '',
    ];

    if (this.showWrapper()) {
      return [
        ...baseLayout,
        'bg-transparent border-transparent',
        'disabled:opacity-0',
        this.getFocusClasses(),
      ].join(' ');
    }

    return [
      ...baseLayout,
      getVariantClasses(this.variant(), this.styleType(), this.transparent()),
      this.getFocusClasses(),
    ].join(' ');
  });

  /** Tamaño efectivo del ícono en px (resuelve `TypographyType` → px). */
  readonly resolvedIconSize = computed<string>(
    () => designConstants.typography.fontSize[this.fontSize()],
  );

  readonly leftIconInputs = computed<Record<string, unknown> | undefined>(
    () => (this.LeftIcon() ? this.buildIconInputs() : undefined),
  );

  readonly rightIconInputs = computed<Record<string, unknown> | undefined>(
    () => (this.RightIcon() ? this.buildIconInputs() : undefined),
  );

  private buildIconInputs(): Record<string, unknown> {
    const props: Record<string, unknown> = { ...this.iconProps() };
    if (props['size'] === undefined) {
      props['size'] = this.resolvedIconSize();
    }
    return props;
  }

  private getFocusClasses(): string {
    return getFocusStyling('visible');
  }

  /** `rel` automático si `target="_blank"` (anti-tabnabbing). */
  readonly computedRel = computed<string | null>(() => {
    if (!this.asLink()) return null;
    const explicit = this.linkProps()?.rel;
    if (explicit) return explicit;
    if (this.linkProps()?.target === '_blank') return 'noopener noreferrer';
    return null;
  });

  /** Indicador de si el wrapper está mostrando la progress bar. */
  readonly hasActiveTimeout = computed<boolean>(
    () => this.timeout() !== undefined && this._runningTimeout(),
  );
}
