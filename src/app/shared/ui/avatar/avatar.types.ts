/**
 * Tamaños disponibles para `UiAvatar` y `UiAvatarText`.
 * Cada tamaño define simultáneamente el alto/ancho del contenedor y el
 * tamaño del punto de estado (en el caso de `UiAvatar`).
 */
export type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

/**
 * Estado de presencia representado como un punto sobre el avatar.
 * `'none'` oculta el indicador.
 */
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'none';
