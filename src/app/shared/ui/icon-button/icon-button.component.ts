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
  Type,
} from "@angular/core";
import { NgComponentOutlet, NgTemplateOutlet } from "@angular/common";

import { IconProps } from "@shared/icons/icon.interface";
import { TypographyType } from "@styles/types/typography";
import designConstants from "@styles/constants";
import {
  UiTooltipComponent,
  TooltipSide,
  TooltipVariantType,
} from "@shared/ui/tooltip/tooltip.component";
import { UiLoadingTimeoutWrapperComponent } from "@shared/ui/loading-timeout-wrapper/loading-timeout-wrapper.component";
import { getFocusStyling } from "@utils/styling";

import {
  ButtonLinkProps,
  ButtonStyleType,
  ButtonTooltip,
  ButtonVariant,
} from "@shared/ui/button/types";
import { getVariantClasses } from "@shared/ui/button/variants";

/**
 * `UiIconButton`
 * --------------
 * Botón cuadrado (aspect-ratio 1:1) que contiene un único ícono.
 *
 * Mismas capacidades que `UiButton` (variants, styleTypes, loading
 * wrapper, tooltip, `asLink`) salvo que no tiene label.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiIconButton",
  standalone: true,
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    UiTooltipComponent,
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
          data-testid="icon-button"
        >
          <ng-container
            *ngComponentOutlet="Icon(); inputs: iconInputs()"
          ></ng-container>
        </a>
      } @else {
        <button
          [class]="buttonClasses()"
          [type]="isSubmit() ? 'submit' : 'button'"
          [disabled]="isEffectivelyDisabled()"
          [attr.aria-label]="labelText() || null"
          (click)="onClick($event)"
          data-testid="icon-button"
        >
          <ng-container
            *ngComponentOutlet="Icon(); inputs: iconInputs()"
          ></ng-container>
        </button>
      }
    </ng-template>

    @if (showWrapper()) {
      <UiLoadingTimeoutWrapper
        [variant]="variant()"
        [styleType]="styleType()"
        [transparent]="transparent()"
        [fullWidth]="false"
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
export class UiIconButtonComponent implements OnDestroy {
  readonly variant = input<ButtonVariant>("primary");
  readonly styleType = input<ButtonStyleType>("default");
  readonly transparent = input<boolean>(false);
  readonly compact = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly isSubmit = input<boolean>(false);
  readonly fontSize = input<TypographyType>("bodyS");

  /** Componente Angular que se renderiza dentro del botón. */
  readonly Icon = input.required<Type<unknown>>();
  readonly iconProps = input<IconProps>({});

  /** Ancho explícito del botón. Si se omite, usa aspect-ratio 1:1. */
  readonly width = input<string | undefined>(undefined);

  readonly tooltip = input<ButtonTooltip | undefined>(undefined);
  readonly tooltipSide = input<TooltipSide>("bottom");
  readonly tooltipVariant = input<TooltipVariantType>("dark");
  readonly labelText = input<string | undefined>(undefined);
  readonly timeout = input<number | undefined>(undefined);
  readonly disableOnTimeout = input<boolean>(true);
  readonly asLink = input<boolean>(false);
  readonly linkProps = input<ButtonLinkProps | undefined>(undefined);
  readonly className = input<string>("");

  readonly click = output<MouseEvent>();

  private cdr = inject(ChangeDetectorRef);
  private timeoutId?: ReturnType<typeof setTimeout>;
  private readonly _runningTimeout = signal(false);

  ngOnInit(): void {
    if (this.timeout() !== undefined) this.startTimeout();
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

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

  readonly isEffectivelyDisabled = computed<boolean>(
    () =>
      this.disabled() ||
      this.isLoading() ||
      (this._runningTimeout() && this.disableOnTimeout()),
  );

  readonly showWrapper = computed<boolean>(
    () => this.isLoading() || this._runningTimeout(),
  );

  readonly hasActiveTimeout = computed<boolean>(
    () => this.timeout() !== undefined && this._runningTimeout(),
  );

  readonly buttonClasses = computed<string>(() => {
    const width = this.width();
    const aspect = width ? "" : "aspect-square";
    const layout = [
      "inline-flex items-center justify-center",
      "rounded-lg",
      "cursor-pointer select-none",
      "border border-solid",
      this.compact() ? "p-1" : "p-2",
      width ? `w-[${width}]` : "",
      aspect,
    ];

    if (this.showWrapper()) {
      return [
        ...layout,
        "bg-transparent border-transparent",
        "disabled:opacity-0",
        this.getFocusClasses(),
      ].join(" ");
    }
    return [
      ...layout,
      getVariantClasses(this.variant(), this.styleType(), this.transparent()),
      this.getFocusClasses(),
    ].join(" ");
  });

  readonly iconInputs = computed<Record<string, unknown>>(() => {
    const props: Record<string, unknown> = { ...this.iconProps() };
    if (props["size"] === undefined) {
      props["size"] = designConstants.typography.fontSize[this.fontSize()];
    }
    return props;
  });

  readonly computedRel = computed<string | null>(() => {
    if (!this.asLink()) return null;
    const explicit = this.linkProps()?.rel;
    if (explicit) return explicit;
    if (this.linkProps()?.target === "_blank") return "noopener noreferrer";
    return null;
  });

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

  private getFocusClasses(): string {
    return getFocusStyling("visible");
  }
}
