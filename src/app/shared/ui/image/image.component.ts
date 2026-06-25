import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

import {
  ImageLoading,
  ObjectFit,
  RoundedSize,
} from "./image.types";

/**
 * Clases utilitarias de Tailwind para `border-radius`.
 * Se mantienen como literales para que el compilador de Tailwind
 * las detecte (no se generan con template literals dinámicos).
 */
const ROUNDED_CLASSES: Record<RoundedSize, string> = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

/**
 * Clases utilitarias de Tailwind para `object-fit`.
 */
const OBJECT_FIT_CLASSES: Record<ObjectFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

const BORDER_CLASSES =
  "border border-gray-200 dark:border-gray-800";

/**
 * `UiImage`
 * --------
 * Imagen responsive con borde, redondeo y `object-fit` configurables.
 *
 * Pensado para imágenes decorativas o de contenido dentro de cards,
 * grids y galerías. Maneja el caso de error (URL rota) emitiendo
 * `(imageError)` y, opcionalmente, mostrando `fallbackSrc` como
 * imagen de respaldo.
 *
 * Accesibilidad:
 *  - `alt` es obligatorio para screen readers; si viene vacío el
 *    navegador ignora la imagen como contenido.
 *  - En estado de error sin fallback, se renderiza un placeholder
 *    con `role="img"` y `aria-label` derivado del `alt`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiImage",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./image.component.html",
})
export class UiImageComponent {
  /** URL de la imagen. */
  readonly src = input.required<string>();
  /** Texto alternativo (a11y). */
  readonly alt = input<string>("");
  /** Tamaño del borde redondeado. Default `xl`. */
  readonly rounded = input<RoundedSize>("xl");
  /** Si `true`, renderiza un borde sutil. Default `true`. */
  readonly bordered = input<boolean>(true);
  /** `object-fit` aplicado al `<img>`. Default `cover`. */
  readonly objectFit = input<ObjectFit>("cover");
  /** Ancho del `<img>` como clase Tailwind. Default `w-full`. */
  readonly width = input<string>("w-full");
  /** Alto del `<img>` como clase Tailwind. Default `h-auto`. */
  readonly height = input<string>("h-auto");
  /** Estrategia de carga. Default `lazy`. */
  readonly loading = input<ImageLoading>("lazy");
  /** URL de fallback si la imagen principal falla. */
  readonly fallbackSrc = input<string | undefined>(undefined);
  /** Clases extra para el contenedor. */
  readonly className = input<string>("");

  /** Se emite cuando el `<img>` falla al cargar. */
  readonly imageError = output<void>();

  private readonly _hasError = signal(false);

  /** `true` si la imagen principal falló al cargar. */
  readonly hasError = this._hasError.asReadonly();

  /** Clases combinadas del contenedor. */
  readonly containerClasses = computed<string>(() =>
    [
      "overflow-hidden",
      this.bordered() ? BORDER_CLASSES : "",
      ROUNDED_CLASSES[this.rounded()],
      this.className(),
    ]
      .filter(Boolean)
      .join(" "),
  );

  /** Clases del `<img>`. */
  readonly imageClasses = computed<string>(() =>
    [
      "block",
      this.width(),
      this.height(),
      OBJECT_FIT_CLASSES[this.objectFit()],
    ]
      .filter(Boolean)
      .join(" "),
  );

  /** `src` efectivo: usa el fallback si la imagen principal falló. */
  readonly effectiveSrc = computed<string>(() =>
    this._hasError() && this.fallbackSrc() ? this.fallbackSrc()! : this.src(),
  );

  onError(): void {
    if (this._hasError()) return;
    this._hasError.set(true);
    this.imageError.emit();
  }
}
