/**
 * Valores válidos de `object-fit` en CSS.
 * Mapean 1:1 a una clase utilitaria de Tailwind.
 */
export type ObjectFit =
  | "cover"
  | "contain"
  | "fill"
  | "none"
  | "scale-down";

/**
 * Tamaños de borde redondeado soportados por `UiImage`.
 * `none` desactiva el rounded por completo.
 */
export type RoundedSize =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

/**
 * Estrategias de carga del navegador para el `<img>`.
 * `lazy` retrasa la carga hasta que la imagen entra en el viewport.
 */
export type ImageLoading = "lazy" | "eager";
