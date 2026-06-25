/**
 * Public API de `UiVideo`.
 *
 * Wrapper de `<iframe>` con aspect ratio fijo (1:1, 4:3, 16:9, 21:9)
 * pensado para embeber videos responsivos.
 *
 * @example
 * ```html
 * <UiVideo
 *   src="https://www.youtube.com/embed/abc123"
 *   ratio="16:9"
 * />
 * ```
 */
export { UiVideoComponent } from "./video.component";
export type { VideoRatio } from "./video.types";
