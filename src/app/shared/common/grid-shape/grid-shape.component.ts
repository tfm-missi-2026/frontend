import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UiFlexComponent } from "@shared/ui/flex";
import { UiImageComponent } from "@shared/ui/image";

/**
 * `CommonGridShape`
 * -----------------
 * Fondo decorativo basado en dos SVGs espejados en esquinas opuestas
 * (top-right y bottom-left, este último rotado 180°). Usado por
 * páginas con layouts centrados (auth, 404, etc.).
 *
 * Variantes:
 *  - `default`: la imagen decorativa estándar (`grid-01.svg`).
 *  - `tight`: variante más pequeña para layouts angostos (futuro).
 *
 * Posicionamiento: contenedor absoluto en `inset-0` con `-z-1` y
 * `pointer-events-none` para que no interfiera con la UI.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "CommonGridShape",
  standalone: true,
  imports: [UiFlexComponent, UiImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiFlex
      className="pointer-events-none absolute inset-0 -z-1"
      [ariaHidden]="true"
    >
      <UiImage
        [src]="imageSrc()"
        alt=""
        rounded="none"
        [bordered]="false"
        width="w-full max-w-62.5 xl:max-w-112.5"
        className="absolute right-0 top-0"
      />
      <UiImage
        [src]="imageSrc()"
        alt=""
        rounded="none"
        [bordered]="false"
        width="w-full max-w-62.5 xl:max-w-112.5"
        className="absolute bottom-0 left-0 rotate-180"
      />
    </UiFlex>
  `,
})
export class CommonGridShapeComponent {
  /** Ruta al SVG decorativo. Default: `/images/shape/grid-01.svg`. */
  readonly imageSrc = input<string>("/images/shape/grid-01.svg");
}