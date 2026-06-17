import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
  Type,
} from "@angular/core";
import { isPlatformBrowser, NgClass, NgComponentOutlet } from "@angular/common";
import { RouterModule } from "@angular/router";

import { IconProps } from "@shared/ui/icon/icon.interface";
import { TypographyType } from "@styles/types/typography";

import { LinkProps, LinkSize, LinkUnderline, LinkVariant } from "./link.types";
import designConstants from "@styles/constants";

const SIZE_CLASSES: Record<LinkSize, string> = {
  sm: "text-theme-xs",
  md: "text-theme-sm",
  lg: "text-base",
};

const VARIANT_CLASSES: Record<LinkVariant, string> = {
  primary:
    "text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300",
  secondary:
    "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
  danger:
    "text-error-500 hover:text-error-600 dark:text-error-400 dark:hover:text-error-300",
  subtle:
    "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
  unstyled: "",
};

const UNDERLINE_CLASSES: Record<LinkUnderline, string> = {
  hover: "hover:underline focus-visible:underline",
  always: "underline",
  none: "no-underline",
};

const BASE_CLASSES =
  "inline-flex items-center gap-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 rounded-sm";

/**
 * `UiLink`
 * --------
 * Enlace del design system. Renderiza siempre un `<a>` HTML y soporta
 * tanto `routerLink` (`to`) como URL externa (`href`).
 *
 * Características:
 *  - Slot `<ng-content>` para contenido HTML arbitrario (editable
 *    con HTML). Es la fuente principal de contenido.
 *  - Variantes de color (`primary` | `secondary` | `danger` |
 *    `subtle` | `unstyled`).
 *  - Tamaños (`sm` | `md` | `lg`).
 *  - Comportamiento de subrayado (`hover` | `always` | `none`).
 *  - Íconos izquierda/derecha como componentes Angular.
 *  - Estado `disabled` (clase + `aria-disabled` + bloqueo de click).
 *  - `rel="noopener noreferrer"` automático cuando `target="_blank"`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiLink",
  standalone: true,
  imports: [NgComponentOutlet, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./link.html",
})
export class UiLinkComponent {
  /** Ruta del router-link. */
  readonly to = input<string | undefined>(undefined);
  /** URL absoluta externa. Tiene precedencia sobre `to`. */
  readonly href = input<string | undefined>(undefined);
  /** Variante visual. Default: `primary`. */
  readonly variant = input<LinkVariant>("primary");
  /** Tamaño tipográfico. Default: `md`. */
  readonly size = input<LinkSize>("md");
  /** Comportamiento del subrayado. Default: `hover`. */
  readonly underline = input<LinkUnderline>("hover");
  /** Si `true`, deshabilita el link. */
  readonly disabled = input<boolean>(false);
  /** Atributo `target` del `<a>`. */
  readonly target = input<string | undefined>(undefined);
  /** Atributo `rel` del `<a>`. */
  readonly rel = input<string | undefined>(undefined);
  /** Mapea a `aria-label`. */
  readonly labelText = input<string | undefined>(undefined);
  /** Ícono a la izquierda. */
  readonly leftIcon = input<Type<unknown> | undefined>(undefined);
  /** Ícono a la derecha. */
  readonly rightIcon = input<Type<unknown> | undefined>(undefined);
  /** Props para los íconos (size por defecto = `fontSize` en px). */
  readonly iconProps = input<IconProps>({});
  /** Clases extra aplicadas al `<a>`. */
  readonly className = input<string>("");

  /** Emite el `MouseEvent` nativo al hacer click. */
  readonly click = output<MouseEvent>();

  private readonly platformId = inject(PLATFORM_ID);

  /** `href` efectivo (externo pisa interno). */
  readonly effectiveHref = computed<string | undefined>(
    () => this.href() ?? this.to(),
  );

  /** `true` cuando el destino es externo (no se usa routerLink). */
  readonly isExternal = computed<boolean>(() => !!this.href());

  /** Tamaño efectivo mapeado a `TypographyType` (resuelve px del font). */
  readonly fontSize = computed<TypographyType>(() => {
    const size = this.size();
    if (size === "sm") return "bodyXs";
    if (size === "lg") return "HeadingM";
    return "bodyS";
  });

  /** Tamaño de los íconos en px. */
  readonly iconSize = computed<string>(
    () => designConstants.typography.fontSize[this.fontSize()],
  );

  readonly leftIconInputs = computed<Record<string, unknown> | undefined>(() =>
    this.leftIcon() ? this.buildIconInputs() : undefined,
  );

  readonly rightIconInputs = computed<Record<string, unknown> | undefined>(
    () => (this.rightIcon() ? this.buildIconInputs() : undefined),
  );

  private buildIconInputs(): Record<string, unknown> {
    const props: Record<string, unknown> = { ...this.iconProps() };
    if (props["size"] === undefined) {
      props["size"] = this.iconSize();
    }
    return props;
  }

  /** `rel` automático si `target="_blank"` y no se definió `rel`. */
  readonly computedRel = computed<string | null>(() => {
    const explicit = this.rel();
    if (explicit) return explicit;
    if (this.target() === "_blank") return "noopener noreferrer";
    return null;
  });

  readonly containerClasses = computed<string>(() =>
    [
      BASE_CLASSES,
      SIZE_CLASSES[this.size()],
      VARIANT_CLASSES[this.variant()],
      UNDERLINE_CLASSES[this.underline()],
      this.disabled()
        ? "opacity-50 pointer-events-none cursor-not-allowed"
        : "cursor-pointer",
      this.className(),
    ]
      .filter(Boolean)
      .join(" "),
  );

  /** Bridge SSR. */
  readonly _isBrowser = computed<boolean>(() =>
    isPlatformBrowser(this.platformId),
  );

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.click.emit(event);
  }

  /** Resuelve la prop `LinkProps` exportada. Útil para consumidores
   * que quieran el shape completo en runtime. */
  asLinkProps(): LinkProps {
    return {
      to: this.to(),
      href: this.href(),
      variant: this.variant(),
      size: this.size(),
      underline: this.underline(),
      disabled: this.disabled(),
      target: this.target(),
      rel: this.rel(),
      labelText: this.labelText(),
      leftIcon: this.leftIcon(),
      rightIcon: this.rightIcon(),
      iconProps: this.iconProps(),
      className: this.className(),
    };
  }
}
