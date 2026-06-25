/**
 * Public API de `UiImage`.
 *
 * Imagen responsive con borde, redondeo y `object-fit` configurables.
 * Pensado para cards, grids y galerías.
 *
 * @example
 * ```html
 * <UiImage
 *   src="/images/cover.jpg"
 *   alt="Cover"
 *   rounded="xl"
 *   bordered="true"
 * />
 * ```
 */
export { UiImageComponent } from "./image.component";
export type { ObjectFit, RoundedSize, ImageLoading } from "./image.types";
