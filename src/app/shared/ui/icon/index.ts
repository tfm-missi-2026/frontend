/**
 * Public API del barrel de iconos del design system.
 *
 * Cada icono es un `Component` standalone con signal-based inputs
 * (`size`, `width`, `height`, `color`, `className`, `dataTestId`,
 * `style`) y `computedWidth` / `computedHeight` para el `<svg>`.
 *
 * Para los iconos que se pasan por `*ngComponentOutlet` (por ejemplo en
 * `UiInput` o `UiTable`) basta con importar la clase del componente y
 * pasarla al input tipado como `Type<unknown>`.
 *
 * @example
 * ```ts
 * import { IconSearchLightComponent, IconChevronLeftComponent } from '@ui/icon';
 *
 * @Component({
 *   imports: [IconSearchLightComponent],
 *   template: `<IconSearchLight [size]="20" color="#3b82f6" />`,
 * })
 * export class MyComponent {}
 * ```
 */

export { IconArrowRightComponent } from './arrow-right-icon';
export { IconBoxComponent } from './box-icon';
export { IconCheckComponent } from './check-icon';
export { IconChevronDownComponent } from './chevron-down-icon';
export { IconChevronLeftComponent } from './chevron-left-icon';
export { IconChevronRightComponent } from './chevron-right-icon';
export { IconCircleInfoLightComponent } from './circle-info-icon-light';
export { IconEditLightComponent } from './edit-icon-light';
export { IconErrorComponent } from './error-icon';
export { IconExternalLinkComponent } from './external-link-icon';
export { IconEyeComponent } from './eye-icon';
export { IconFloppyDiskLightComponent } from './floppy-disk-icon-light';
export { IconInfoCircleComponent } from './info-circle-icon';
export { IconInfoComponent } from './info-icon';
export { IconLinkComponent } from './link-icon';
export { IconPlusComponent } from './plus-icon';
export { IconSearchComponent } from './search-icon';
export { IconSearchLightComponent } from './search-icon-light';
export { IconSuccessComponent } from './success-icon';
export { IconTrashLightComponent } from './trash-icon-light';
export { IconUploadLightComponent } from './upload-icon-light';
export { IconValidationErrorComponent } from './validation-error-icon';
export { IconWarningComponent } from './warning-icon';
export { IconXComponent } from './x-icon';

export type { IconProps } from './icon.interface';
