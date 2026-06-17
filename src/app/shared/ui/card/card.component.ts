import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UiHeaderComponent } from "@shared/ui/header";
import { UiLabelComponent } from "@shared/ui/label";
import { UiBadgeComponent, BadgeColor, BadgeVariant } from "@shared/ui/badge";
import { UiSeparatorComponent } from "@shared/ui/separator";

import { CardPadding, CardVariant } from "./card.types";

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default:
    "rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]",
  elevated:
    "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]",
  flat: "rounded-xl bg-white dark:bg-white/[0.03]",
};

const TITLE_CLASSES = "text-lg font-semibold text-gray-800 dark:text-white/90";
const DESCRIPTION_CLASSES = "mt-1 text-sm text-gray-500 dark:text-gray-400";

/**
 * `UiCard`
 * --------
 * Contenedor genérico de contenido en formato de "tarjeta" del design
 * system. Aporta la base visual (borde, radio, padding, fondo y modo
 * oscuro) y compone otros componentes del DS en su cabecera:
 *
 * - `UiHeader` para el `title` (semántica h1–h5).
 * - `UiLabel` para la `description` (párrafo bodyS).
 * - `UiBadge` opcional junto al título.
 * - `UiSeparator` opcional entre la cabecera y el contenido.
 *
 * Si se necesita contenido custom (íconos, links, imágenes, etc.) se
 * sigue usando `<ng-content>` como slot libre.
 *
 * API signal-based (Angular 17.1+).
 *
 * @example
 * ```html
 * <UiCard title="Título" description="Descripción breve" />
 * ```
 *
 * @example
 * ```html
 * <UiCard
 *   title="Pro Plan"
 *   description="Acceso completo a funciones premium."
 *   badge="Popular"
 *   badgeColor="primary"
 *   [divider]="true"
 * />
 * ```
 */
@Component({
  selector: "UiCard",
  standalone: true,
  imports: [
    UiHeaderComponent,
    UiLabelComponent,
    UiBadgeComponent,
    UiSeparatorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasHeader()) {
      <div class="mb-3 flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          @if (title()) {
            <UiHeader
              [level]="3"
              [text]="title()"
              [className]="titleClasses()"
            ></UiHeader>
          }
          @if (description()) {
            <UiLabel
              as="p"
              type="bodyS"
              [text]="description()"
              [className]="descriptionClasses()"
            ></UiLabel>
          }
        </div>
        @if (badge()) {
          <UiBadge [variant]="badgeVariant()" [color]="badgeColor()">
            {{ badge() }}
          </UiBadge>
        }
      </div>
    }
    @if (divider() && hasHeader()) {
      <UiSeparator spacing="sm" className="mb-3"></UiSeparator>
    }
    <ng-content></ng-content>
  `,
})
export class UiCardComponent {
  /** Padding interno. Default: `md`. */
  readonly padding = input<CardPadding>("md");
  /** Variante visual. Default: `default`. */
  readonly variant = input<CardVariant>("default");
  /** Clases extra aplicadas al contenedor. */
  readonly className = input<string>("");
  /** Título opcional renderizado con `UiHeader` (nivel 3). */
  readonly title = input<string>("");
  /** Descripción opcional renderizada con `UiLabel` (párrafo bodyS). */
  readonly description = input<string>("");
  /** Texto del badge opcional en la esquina superior derecha. */
  readonly badge = input<string>("");
  /** Color del badge. Default: `primary`. */
  readonly badgeColor = input<BadgeColor>("primary");
  /** Variante del badge. Default: `light`. */
  readonly badgeVariant = input<BadgeVariant>("light");
  /** Si `true`, dibuja un `UiSeparator` entre la cabecera y el contenido. */
  readonly divider = input<boolean>(false);

  /** Clases combinadas del contenedor. */
  readonly containerClasses = computed<string>(() =>
    [
      VARIANT_CLASSES[this.variant()],
      PADDING_CLASSES[this.padding()],
      this.className(),
    ]
      .filter(Boolean)
      .join(" "),
  );

  /** Indica si se debe renderizar la cabecera (title, description o badge). */
  readonly hasHeader = computed<boolean>(
    () => !!this.title() || !!this.description() || !!this.badge(),
  );

  readonly titleClasses = computed<string>(() => TITLE_CLASSES);
  readonly descriptionClasses = computed<string>(() => DESCRIPTION_CLASSES);
}
