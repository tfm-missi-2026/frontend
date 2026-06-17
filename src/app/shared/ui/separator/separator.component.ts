import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

import {
  SeparatorColor,
  SeparatorOrientation,
  SeparatorSpacing,
  SeparatorThickness,
  SeparatorVariant,
} from "./separator.types";

const ORIENTATION_CLASSES: Record<SeparatorOrientation, string> = {
  horizontal: "w-full h-px",
  vertical: "w-px h-full min-h-10",
};

const VARIANT_CLASSES: Record<SeparatorVariant, string> = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

const THICKNESS_CLASSES: Record<SeparatorThickness, string> = {
  thin: "border-t border-l-0",
  medium: "border-t-2 border-l-0",
  thick: "border-t-4 border-l-0",
};

const VERTICAL_THICKNESS_CLASSES: Record<SeparatorThickness, string> = {
  thin: "border-l border-t-0",
  medium: "border-l-2 border-t-0",
  thick: "border-l-4 border-t-0",
};

const SPACING_CLASSES: Record<SeparatorSpacing, string> = {
  none: "my-0 mx-0",
  sm: "my-2 mx-2",
  md: "my-4 mx-4",
  lg: "my-6 mx-6",
};

const COLOR_CLASSES: Record<SeparatorColor, string> = {
  gray: "border-gray-200 dark:border-gray-800",
  subtle: "border-gray-100 dark:border-gray-700/50",
  brand: "border-brand-500 dark:border-brand-400",
  danger: "border-error-500 dark:border-error-400",
};

/**
 * `UiSeparator`
 * ------------
 * Separador horizontal o vertical del design system. Renderiza un
 * `<hr>` semántico (preserva accesibilidad) con control sobre la
 * orientación, el estilo del trazo, el grosor, el espaciado y el
 * color.
 *
 * Es un wrapper sin estado y de `presentational component` — pensado
 * para dividir contenido en listas, sidebars, cards, etc.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiSeparator",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hr
      [class]="containerClasses()"
      [attr.data-testid]="'separator'"
      [attr.data-orientation]="orientation()"
      [attr.aria-orientation]="orientation()"
    />
  `,
})
export class UiSeparatorComponent {
  /** Orientación. Default: `horizontal`. */
  readonly orientation = input<SeparatorOrientation>("horizontal");
  /** Estilo del trazo. Default: `solid`. */
  readonly variant = input<SeparatorVariant>("solid");
  /** Grosor del trazo. Default: `thin`. */
  readonly thickness = input<SeparatorThickness>("thin");
  /** Espaciado alrededor. Default: `none`. */
  readonly spacing = input<SeparatorSpacing>("none");
  /** Color semántico. Default: `gray`. */
  readonly color = input<SeparatorColor>("gray");
  /** Clases extra aplicadas al `<hr>`. */
  readonly className = input<string>("");

  readonly containerClasses = computed<string>(() => {
    const isVertical = this.orientation() === "vertical";
    const thicknessMap = isVertical
      ? VERTICAL_THICKNESS_CLASSES
      : THICKNESS_CLASSES;
    return [
      "block border-0",
      ORIENTATION_CLASSES[this.orientation()],
      VARIANT_CLASSES[this.variant()],
      thicknessMap[this.thickness()],
      SPACING_CLASSES[this.spacing()],
      COLOR_CLASSES[this.color()],
      this.className(),
    ]
      .filter(Boolean)
      .join(" ");
  });
}
