import type { AvatarSize, AvatarStatus } from "./avatar.types";

/**
 * Tamaño del contenedor del avatar (alto y ancho).
 * `max-w-*` evita que la imagen se expanda más allá del contenedor.
 */
export const AVATAR_SIZE_CLASSES: Record<AvatarSize, string> = {
  xsmall: "h-6 w-6 max-w-6",
  small: "h-8 w-8 max-w-8",
  medium: "h-10 w-10 max-w-10",
  large: "h-12 w-12 max-w-12",
  xlarge: "h-14 w-14 max-w-14",
  xxlarge: "h-16 w-16 max-w-16",
};

/**
 * Tamaño del punto de estado, escalado según el tamaño del avatar.
 */
export const AVATAR_STATUS_SIZE_CLASSES: Record<AvatarSize, string> = {
  xsmall: "h-1.5 w-1.5 max-w-1.5",
  small: "h-2 w-2 max-w-2",
  medium: "h-2.5 w-2.5 max-w-2.5",
  large: "h-3 w-3 max-w-3",
  xlarge: "h-3.5 w-3.5 max-w-3.5",
  xxlarge: "h-4 w-4 max-w-4",
};

/**
 * Color semántico del punto de estado con par light + dark.
 * Las clases son literales para que el JIT de Tailwind las detecte.
 */
export const AVATAR_STATUS_COLOR_CLASSES: Record<
  Exclude<AvatarStatus, "none">,
  string
> = {
  online: "bg-success-500 dark:bg-success-400",
  offline: "bg-error-400 dark:bg-error-400",
  busy: "bg-warning-500 dark:bg-warning-400",
};