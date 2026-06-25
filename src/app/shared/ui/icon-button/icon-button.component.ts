import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
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
} from "@shared/ui/button/button.types";
import { getVariantClasses } from "@shared/ui/button/button.variants";

/**
 * Botón cuadrado (aspect-ratio 1:1) con un único ícono. Mismas
 * capacidades que `UiButton` (variants, styleTypes, loading wrapper,
 * tooltip, `asLink`) salvo que no tiene label. Pensado para acciones
 * compactas en barras, tablas y headers.
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
  templateUrl: "./icon-button.component.html",
})
export class UiIconButtonComponent {
  readonly variant = input<ButtonVariant>("primary");
  readonly styleType = input<ButtonStyleType>("default");
  readonly transparent = input<boolean>(false);
  readonly compact = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly isSubmit = input<boolean>(false);
  readonly fontSize = input<TypographyType>("bodyS");
  readonly Icon = input.required<Type<unknown>>();
  readonly iconProps = input<IconProps>({});
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

  private timeoutId?: ReturnType<typeof setTimeout>;
  private readonly _runningTimeout = signal(false);

  constructor() {
    effect(() => {
      const ms = this.timeout();
      this.clearTimeout();
      if (ms === undefined) return;
      this._runningTimeout.set(true);
      this.timeoutId = setTimeout(() => this._runningTimeout.set(false), ms);
    });

    inject(DestroyRef).onDestroy(() => this.clearTimeout());
  }

  /** Reinicia el `timeout`. Útil desde el handler de click del consumidor. */
  resetTimeout = (): void => {
    const ms = this.timeout();
    this.clearTimeout();
    if (ms === undefined) return;
    this._runningTimeout.set(true);
    this.timeoutId = setTimeout(() => this._runningTimeout.set(false), ms);
  };

  onClick(event: MouseEvent): void {
    if (this.isEffectivelyDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.click.emit(event);
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

  /** `rel` automático si `target="_blank"` (anti-tabnabbing). */
  readonly computedRel = computed<string | null>(() => {
    if (!this.asLink()) return null;
    const explicit = this.linkProps()?.rel;
    if (explicit) return explicit;
    if (this.linkProps()?.target === "_blank") return "noopener noreferrer";
    return null;
  });

  /** Estilo inline para ancho explícito (`[style.width]` evita JIT miss). */
  readonly widthStyle = computed<{ width?: string }>(() => {
    const width = this.width();
    return width !== undefined ? { width } : {};
  });

  private getFocusClasses(): string {
    return getFocusStyling("visible");
  }
}
