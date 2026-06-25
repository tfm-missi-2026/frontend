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
  TemplateRef,
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
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { UiLoadingTimeoutWrapperComponent } from "@shared/ui/loading-timeout-wrapper/loading-timeout-wrapper.component";
import { getFocusStyling } from "@utils/styling";

import { ButtonStyleType, ButtonTooltip, ButtonVariant } from "./button.types";
import { getVariantClasses } from "./button.variants";

/**
 * Botón del design system.
 * Soporta variants (`primary`/`secondary`/`tertiary`) × styleTypes,
 * iconos izquierda/derecha como componentes Angular, tooltip integrado,
 * loading wrapper con progress bar y render como `<a>` vía `asLink`.
 * El reset manual del timer se hace con `viewChild.button.resetTimeout()`.
 */
@Component({
  selector: "UiButton",
  standalone: true,
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    UiTooltipComponent,
    UiLabelComponent,
    UiLoadingTimeoutWrapperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./button.component.html",
})
export class UiButtonComponent {
  readonly variant = input<ButtonVariant>("primary");
  readonly styleType = input<ButtonStyleType>("default");
  readonly transparent = input<boolean>(false);
  readonly compact = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly isSubmit = input<boolean>(false);
  readonly fontSize = input<TypographyType>("bodyS");
  readonly label = input<string | undefined>(undefined);
  readonly labelRender = input<TemplateRef<unknown> | undefined>(undefined);
  readonly LeftIcon = input<Type<unknown> | undefined>(undefined);
  readonly RightIcon = input<Type<unknown> | undefined>(undefined);
  readonly iconProps = input<IconProps>({});
  readonly tooltip = input<ButtonTooltip | undefined>(undefined);
  readonly tooltipSide = input<TooltipSide>("bottom");
  readonly tooltipVariant = input<TooltipVariantType>("dark");
  readonly labelText = input<string | undefined>(undefined);
  readonly timeout = input<number | undefined>(undefined);
  readonly disableOnTimeout = input<boolean>(true);
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

  /** Clases del `<button>` / `<a>` real. */
  readonly buttonClasses = computed<string>(() => {
    const baseLayout = [
      "inline-flex items-center justify-center",
      "gap-2",
      "min-w-10",
      "rounded-lg",
      "cursor-pointer select-none",
      "border border-solid",
      this.compact() ? "px-2 py-1" : "px-3 py-2",
      this.fullWidth() && !this.showWrapper() ? "w-full" : "",
    ];

    if (this.showWrapper()) {
      return [
        ...baseLayout,
        "bg-transparent border-transparent",
        "disabled:opacity-0",
        this.getFocusClasses(),
      ].join(" ");
    }

    return [
      ...baseLayout,
      getVariantClasses(this.variant(), this.styleType(), this.transparent()),
      this.getFocusClasses(),
    ].join(" ");
  });

  /** Tamaño efectivo del ícono en px (resuelve `TypographyType` → px). */
  readonly resolvedIconSize = computed<string>(
    () => designConstants.typography.fontSize[this.fontSize()],
  );

  readonly leftIconInputs = computed<Record<string, unknown> | undefined>(() =>
    this.LeftIcon() ? this.buildIconInputs() : undefined,
  );

  readonly rightIconInputs = computed<Record<string, unknown> | undefined>(
    () => (this.RightIcon() ? this.buildIconInputs() : undefined),
  );

  private buildIconInputs(): Record<string, unknown> {
    const props: Record<string, unknown> = { ...this.iconProps() };
    if (props["size"] === undefined) {
      props["size"] = this.resolvedIconSize();
    }
    return props;
  }

  private getFocusClasses(): string {
    return getFocusStyling("visible");
  }

  /** `rel` automático si `target="_blank"` (anti-tabnabbing). */
  readonly computedRel = computed<string | null>(() => {
    if (!this.asLink()) return null;
    const explicit = this.linkProps()?.rel;
    if (explicit) return explicit;
    if (this.linkProps()?.target === "_blank") return "noopener noreferrer";
    return null;
  });

  /** Indicador de si el wrapper está mostrando la progress bar. */
  readonly hasActiveTimeout = computed<boolean>(
    () => this.timeout() !== undefined && this._runningTimeout(),
  );
}
