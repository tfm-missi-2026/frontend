/**
 * Public API del `UiToast`.
 *
 * Notificación flotante independiente de `UiAlert`. Componentes
 * `UiSurface` + `UiIcon` + `UiFlex` + `UiLabel` del design system.
 * Soporta posición fija en viewport, cierre manual con × y
 * auto-dismiss vía `durationSeconds` (default 5s; pasar `0` para
 * desactivar).
 *
 * API signal-based (Angular 17.1+).
 */
export { UiToastComponent } from './toast.component';
export type { ToastPosition, ToastVariant } from './toast.types';