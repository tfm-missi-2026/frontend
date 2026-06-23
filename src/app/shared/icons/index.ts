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

export { IconArrowDownTrendComponent } from './arrow-down-trend-icon';
export { IconArrowLeftComponent } from './arrow-left-icon';
export { IconArrowLeftPaginationComponent } from './arrow-left-pagination-icon';
export { IconArrowRightComponent } from './arrow-right-icon';
export { IconArrowRightPaginationComponent } from './arrow-right-pagination-icon';
export { IconArrowUpTrendComponent } from './arrow-up-trend-icon';
export { IconAlertBlobComponent } from './alert-blob-icon';
export { IconAlertErrorComponent } from './alert-error-icon';
export { IconAlertInfoComponent } from './alert-info-icon';
export { IconAlertSuccessComponent } from './alert-success-icon';
export { IconAlertWarningComponent } from './alert-warning-icon';
export { IconBellComponent } from './bell-icon';
export { IconBoxComponent } from './box-icon';
export { IconCalendar24Component } from './calendar-24-icon';
export { IconCalendarComponent } from './calendar-icon';
export { IconCardComponent } from './card-icon';
export { IconCheckComponent } from './check-icon';
export { IconCheckLargeComponent } from './check-large-icon';
export { IconCheckSmallComponent } from './check-small-icon';
export { IconCheckboxCheckComponent } from './checkbox-check-icon';
export { IconChevronDownComponent } from './chevron-down-icon';
export { IconChevronLeftComponent } from './chevron-left-icon';
export { IconChevronRightComponent } from './chevron-right-icon';
export { IconChevronRightSmallComponent } from './chevron-right-small-icon';
export { IconCircleInfoLightComponent } from './circle-info-icon-light';
export { IconClockComponent } from './clock-icon';
export { IconCloseCircleComponent } from './close-circle-icon';
export { IconCloseLargeComponent } from './close-large-icon';
export { IconDotsVerticalComponent } from './dots-vertical-icon';
export { IconDownloadComponent } from './download-icon';
export { IconEditLightComponent } from './edit-icon-light';
export { IconEditPencilComponent } from './edit-pencil-icon';
export { IconEnvelopeComponent } from './envelope-icon';
export { IconEnvelopeStrokeComponent } from './envelope-stroke-icon';
export { IconErrorComponent } from './error-icon';
export { IconExternalLinkComponent } from './external-link-icon';
export { IconEyeComponent } from './eye-icon';
export { IconFacebookComponent } from './facebook-icon';
export { IconEyeOffComponent } from './eye-off-icon';
export { IconEyeOpenComponent } from './eye-open-icon';
export { IconEyePreviewComponent } from './eye-preview-icon';
export { IconFilterComponent } from './filter-icon';
export { IconFloppyDiskLightComponent } from './floppy-disk-icon-light';
export { IconGoogleComponent } from './google-icon';
export { IconInfoCircleBorderComponent } from './info-circle-border-icon';
export { IconInfoCircleComponent } from './info-circle-icon';
export { IconInfoCircleFaqComponent } from './info-circle-faq-icon';
export { IconInfoCircleSmallComponent } from './info-circle-small-icon';
export { IconInfoComponent } from './info-icon';
export { IconInstagramComponent } from './instagram-icon';
export { IconLinkComponent } from './link-icon';
export { IconLinkedinComponent } from './linkedin-icon';
export { IconLogoutComponent } from './logout-icon';
export { IconMastercardComponent } from './mastercard-icon';
export { IconMastercardSmallComponent } from './mastercard-small-icon';
export { IconMoonComponent } from './moon-icon';
export { IconPaypalComponent } from './paypal-icon';
export { IconPdfComponent } from './pdf-icon';
export { IconPlusComponent } from './plus-icon';
export { IconPlusSimpleComponent } from './plus-simple-icon';
export { IconPrinterComponent } from './printer-icon';
export { IconSearchComponent } from './search-icon';
export { IconSearchLightComponent } from './search-icon-light';
export { IconSettingsComponent } from './settings-icon';
export { IconShoppingCartComponent } from './shopping-cart-icon';
export { IconSortDownComponent } from './sort-down-icon';
export { IconSortUpComponent } from './sort-up-icon';
export { IconStepperMinusComponent } from './stepper-minus-icon';
export { IconStepperPlusComponent } from './stepper-plus-icon';
export { IconSuccessComponent } from './success-icon';
export { IconSunComponent } from './sun-icon';
export { IconTrashComponent } from './trash-icon';
export { IconTrashLightComponent } from './trash-icon-light';
export { IconUploadComponent } from './upload-icon';
export { IconUploadLargeComponent } from './upload-large-icon';
export { IconUploadLightComponent } from './upload-icon-light';
export { IconUserCircleComponent } from './user-circle-icon';
export { IconValidationErrorComponent } from './validation-error-icon';
export { IconVisaComponent } from './visa-icon';
export { IconWarningComponent } from './warning-icon';
export { IconXComponent } from './x-icon';
export { IconXLargeComponent } from './x-large-icon';
export { IconXSocialComponent } from './x-social-icon';

export type { IconProps } from './icon.interface';
