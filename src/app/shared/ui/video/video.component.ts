import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { VideoRatio } from "./video.types";

/**
 * Mapa de ratios a clases de Tailwind.
 *
 * Las clases se mantienen como literales para que el compilador de
 * Tailwind las detecte (no se generan con template literals dinámicos).
 */
const RATIO_CLASSES: Record<VideoRatio, string> = {
  "1:1": "aspect-square",
  "4:3": "aspect-4/3",
  "16:9": "aspect-video",
  "21:9": "aspect-21/9",
};

const ALLOW_FEATURES =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

/**
 * `UiVideo`
 * --------
 * Wrapper de `<iframe>` que mantiene proporciones fijas (1:1, 4:3,
 * 16:9, 21:9) con bordes redondeados y recorte del overflow.
 *
 * Pensado para embeber videos responsivos (YouTube, Vimeo, etc.).
 * La URL se pasa por `src` y se espera un `src` de embed válido
 * (no la URL pública del video).
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiVideo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./video.component.html",
})
export class UiVideoComponent {
  /** URL de embed del video (iframe `src`). */
  readonly src = input.required<string>();
  /** Relación de aspecto del contenedor. Default `16:9`. */
  readonly ratio = input<VideoRatio>("16:9");
  /** Título accesible del iframe. */
  readonly title = input<string>("Embedded Video");
  /** Clases extra para el contenedor. */
  readonly className = input<string>("");

  /** Clases de Tailwind según el ratio elegido. */
  readonly aspectClass = computed<string>(() => RATIO_CLASSES[this.ratio()]);

  /** Clases combinadas del contenedor. */
  readonly containerClasses = computed<string>(() =>
    ["overflow-hidden rounded-lg", this.aspectClass(), this.className()]
      .filter(Boolean)
      .join(" "),
  );

  /** Atributo `allow` del iframe (constante del design system). */
  readonly allowFeatures = ALLOW_FEATURES;
}
