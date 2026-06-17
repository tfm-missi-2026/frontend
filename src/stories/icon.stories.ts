import { CommonModule } from "@angular/common";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import {
  IconArrowDownTrendComponent,
  IconArrowLeftComponent,
  IconArrowLeftPaginationComponent,
  IconArrowRightPaginationComponent,
  IconArrowUpTrendComponent,
  IconAlertBlobComponent,
  IconAlertErrorComponent,
  IconAlertInfoComponent,
  IconAlertSuccessComponent,
  IconAlertWarningComponent,
  IconBellComponent,
  IconCalendar24Component,
  IconCalendarComponent,
  IconCardComponent,
  IconCheckCheckboxDisabledComponent,
  IconCheckCheckboxComponent,
  IconCheckComponent,
  IconCheckLargeComponent,
  IconCheckSmallComponent,
  IconCheckboxCheckComponent,
  IconChevronDownComponent,
  IconChevronLeftComponent,
  IconChevronRightComponent,
  IconChevronRightSmallComponent,
  IconCircleInfoLightComponent,
  IconClockComponent,
  IconCloseCircleComponent,
  IconCloseLargeComponent,
  IconDotsVerticalComponent,
  IconDownloadComponent,
  IconEditLightComponent,
  IconEditPencilComponent,
  IconEnvelopeComponent,
  IconEnvelopeStrokeComponent,
  IconErrorComponent,
  IconEyeComponent,
  IconEyeOffComponent,
  IconEyeOpenComponent,
  IconEyePreviewComponent,
  IconFilterComponent,
  IconFloppyDiskLightComponent,
  IconGoogleComponent,
  IconInfoCircleBorderComponent,
  IconInfoCircleComponent,
  IconInfoCircleFaqComponent,
  IconInfoCircleSmallComponent,
  IconInfoComponent,
  IconLinkComponent,
  IconLogoutComponent,
  IconMastercardComponent,
  IconMastercardSmallComponent,
  IconMoonComponent,
  IconPaypalComponent,
  IconPdfComponent,
  IconPlusComponent,
  IconPlusSimpleComponent,
  IconPrinterComponent,
  IconSearchComponent,
  IconSearchLightComponent,
  IconSettingsComponent,
  IconShoppingCartComponent,
  IconSortDownComponent,
  IconSortUpComponent,
  IconStepperMinusComponent,
  IconStepperPlusComponent,
  IconSuccessComponent,
  IconSunComponent,
  IconTrashComponent,
  IconTrashLightComponent,
  IconUploadComponent,
  IconUploadLargeComponent,
  IconUploadLightComponent,
  IconUserCircleComponent,
  IconValidationErrorComponent,
  IconVisaComponent,
  IconWarningComponent,
  IconXComponent,
  IconXLargeComponent,
  IconXSocialComponent,
} from "@shared/icons";

interface IconEntry {
  name: string;
  component: unknown;
  selector: string;
}

const ICON_CATALOG: IconEntry[] = [
  {
    name: "Arrow Down Trend",
    component: IconArrowDownTrendComponent,
    selector: "IconArrowDownTrend",
  },
  {
    name: "Arrow Left",
    component: IconArrowLeftComponent,
    selector: "IconArrowLeft",
  },
  {
    name: "Arrow Left Pagination",
    component: IconArrowLeftPaginationComponent,
    selector: "IconArrowLeftPagination",
  },
  {
    name: "Arrow Right Pagination",
    component: IconArrowRightPaginationComponent,
    selector: "IconArrowRightPagination",
  },
  {
    name: "Arrow Up Trend",
    component: IconArrowUpTrendComponent,
    selector: "IconArrowUpTrend",
  },
  {
    name: "Alert Blob",
    component: IconAlertBlobComponent,
    selector: "IconAlertBlob",
  },
  {
    name: "Alert Error",
    component: IconAlertErrorComponent,
    selector: "IconAlertError",
  },
  {
    name: "Alert Info",
    component: IconAlertInfoComponent,
    selector: "IconAlertInfo",
  },
  {
    name: "Alert Success",
    component: IconAlertSuccessComponent,
    selector: "IconAlertSuccess",
  },
  {
    name: "Alert Warning",
    component: IconAlertWarningComponent,
    selector: "IconAlertWarning",
  },
  { name: "Bell", component: IconBellComponent, selector: "IconBell" },
  {
    name: "Calendar",
    component: IconCalendarComponent,
    selector: "IconCalendar",
  },
  {
    name: "Calendar 24",
    component: IconCalendar24Component,
    selector: "IconCalendar24",
  },
  { name: "Card", component: IconCardComponent, selector: "IconCard" },
  { name: "Check", component: IconCheckComponent, selector: "IconCheck" },
  {
    name: "Check Checkbox",
    component: IconCheckCheckboxComponent,
    selector: "IconCheckCheckbox",
  },
  {
    name: "Check Checkbox Disabled",
    component: IconCheckCheckboxDisabledComponent,
    selector: "IconCheckCheckboxDisabled",
  },
  {
    name: "Check Large",
    component: IconCheckLargeComponent,
    selector: "IconCheckLarge",
  },
  {
    name: "Check Small",
    component: IconCheckSmallComponent,
    selector: "IconCheckSmall",
  },
  {
    name: "Checkbox Check",
    component: IconCheckboxCheckComponent,
    selector: "IconCheckboxCheck",
  },
  {
    name: "Chevron Down",
    component: IconChevronDownComponent,
    selector: "IconChevronDown",
  },
  {
    name: "Chevron Left",
    component: IconChevronLeftComponent,
    selector: "IconChevronLeft",
  },
  {
    name: "Chevron Right",
    component: IconChevronRightComponent,
    selector: "IconChevronRight",
  },
  {
    name: "Chevron Right Small",
    component: IconChevronRightSmallComponent,
    selector: "IconChevronRightSmall",
  },
  {
    name: "Circle Info Light",
    component: IconCircleInfoLightComponent,
    selector: "IconCircleInfoLight",
  },
  {
    name: "Clock",
    component: IconClockComponent,
    selector: "IconClock",
  },
  {
    name: "Close Circle",
    component: IconCloseCircleComponent,
    selector: "IconCloseCircle",
  },
  {
    name: "Close Large",
    component: IconCloseLargeComponent,
    selector: "IconCloseLarge",
  },
  {
    name: "Dots Vertical",
    component: IconDotsVerticalComponent,
    selector: "IconDotsVertical",
  },
  {
    name: "Download",
    component: IconDownloadComponent,
    selector: "IconDownload",
  },
  {
    name: "Edit Light",
    component: IconEditLightComponent,
    selector: "IconEditLight",
  },
  {
    name: "Edit Pencil",
    component: IconEditPencilComponent,
    selector: "IconEditPencil",
  },
  {
    name: "Envelope",
    component: IconEnvelopeComponent,
    selector: "IconEnvelope",
  },
  {
    name: "Envelope Stroke",
    component: IconEnvelopeStrokeComponent,
    selector: "IconEnvelopeStroke",
  },
  { name: "Error", component: IconErrorComponent, selector: "IconError" },
  { name: "Eye", component: IconEyeComponent, selector: "IconEye" },
  {
    name: "Eye Off",
    component: IconEyeOffComponent,
    selector: "IconEyeOff",
  },
  {
    name: "Eye Open",
    component: IconEyeOpenComponent,
    selector: "IconEyeOpen",
  },
  {
    name: "Eye Preview",
    component: IconEyePreviewComponent,
    selector: "IconEyePreview",
  },
  {
    name: "Filter",
    component: IconFilterComponent,
    selector: "IconFilter",
  },
  {
    name: "Floppy Disk Light",
    component: IconFloppyDiskLightComponent,
    selector: "IconFloppyDiskLight",
  },
  { name: "Google", component: IconGoogleComponent, selector: "IconGoogle" },
  { name: "Info", component: IconInfoComponent, selector: "IconInfo" },
  {
    name: "Info Circle",
    component: IconInfoCircleComponent,
    selector: "IconInfoCircle",
  },
  {
    name: "Info Circle Border",
    component: IconInfoCircleBorderComponent,
    selector: "IconInfoCircleBorder",
  },
  {
    name: "Info Circle Faq",
    component: IconInfoCircleFaqComponent,
    selector: "IconInfoCircleFaq",
  },
  {
    name: "Info Circle Small",
    component: IconInfoCircleSmallComponent,
    selector: "IconInfoCircleSmall",
  },
  { name: "Logout", component: IconLogoutComponent, selector: "IconLogout" },
  {
    name: "Mastercard",
    component: IconMastercardComponent,
    selector: "IconMastercard",
  },
  {
    name: "Mastercard Small",
    component: IconMastercardSmallComponent,
    selector: "IconMastercardSmall",
  },
  { name: "Moon", component: IconMoonComponent, selector: "IconMoon" },
  {
    name: "Paypal",
    component: IconPaypalComponent,
    selector: "IconPaypal",
  },
  { name: "Pdf", component: IconPdfComponent, selector: "IconPdf" },
  { name: "Plus", component: IconPlusComponent, selector: "IconPlus" },
  {
    name: "Plus Simple",
    component: IconPlusSimpleComponent,
    selector: "IconPlusSimple",
  },
  {
    name: "Printer",
    component: IconPrinterComponent,
    selector: "IconPrinter",
  },
  { name: "Search", component: IconSearchComponent, selector: "IconSearch" },
  {
    name: "Search Light",
    component: IconSearchLightComponent,
    selector: "IconSearchLight",
  },
  {
    name: "Settings",
    component: IconSettingsComponent,
    selector: "IconSettings",
  },
  {
    name: "Shopping Cart",
    component: IconShoppingCartComponent,
    selector: "IconShoppingCart",
  },
  {
    name: "Sort Down",
    component: IconSortDownComponent,
    selector: "IconSortDown",
  },
  {
    name: "Sort Up",
    component: IconSortUpComponent,
    selector: "IconSortUp",
  },
  {
    name: "Stepper Minus",
    component: IconStepperMinusComponent,
    selector: "IconStepperMinus",
  },
  {
    name: "Stepper Plus",
    component: IconStepperPlusComponent,
    selector: "IconStepperPlus",
  },
  { name: "Success", component: IconSuccessComponent, selector: "IconSuccess" },
  { name: "Sun", component: IconSunComponent, selector: "IconSun" },
  {
    name: "Trash",
    component: IconTrashComponent,
    selector: "IconTrash",
  },
  {
    name: "Trash Light",
    component: IconTrashLightComponent,
    selector: "IconTrashLight",
  },
  {
    name: "Upload",
    component: IconUploadComponent,
    selector: "IconUpload",
  },
  {
    name: "Upload Large",
    component: IconUploadLargeComponent,
    selector: "IconUploadLarge",
  },
  {
    name: "Upload Light",
    component: IconUploadLightComponent,
    selector: "IconUploadLight",
  },
  {
    name: "User Circle",
    component: IconUserCircleComponent,
    selector: "IconUserCircle",
  },
  {
    name: "Validation Error",
    component: IconValidationErrorComponent,
    selector: "IconValidationError",
  },
  { name: "Visa", component: IconVisaComponent, selector: "IconVisa" },
  { name: "Warning", component: IconWarningComponent, selector: "IconWarning" },
  { name: "X", component: IconXComponent, selector: "IconX" },
  {
    name: "X Large",
    component: IconXLargeComponent,
    selector: "IconXLarge",
  },
  {
    name: "X Social",
    component: IconXSocialComponent,
    selector: "IconXSocial",
  },
];

const meta: Meta = {
  title: "Shared/Icon",
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ...ICON_CATALOG.map((i) => i.component)],
    }),
  ],
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj;

// Default
export const Default: Story = {
  render: () => ({
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Iconos del Design System
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {{ count }} iconos disponibles en
          <code class="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-xs">@ui/icon</code>.
          Todos aceptan <code class="px-1 rounded bg-gray-200 dark:bg-white/10 text-xs">size</code>,
          <code class="px-1 rounded bg-gray-200 dark:bg-white/10 text-xs">color</code> y
          <code class="px-1 rounded bg-gray-200 dark:bg-white/10 text-xs">className</code>.
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          @for (entry of catalog; track entry.selector) {
            <div
              class="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3 hover:border-brand-300 dark:hover:border-brand-500/40 transition-colors"
            >
              <div class="text-gray-700 dark:text-gray-200" [style.color]="rowColor()">
                <ng-container
                  *ngComponentOutlet="entry.component; inputs: { size: 28 }"
                ></ng-container>
              </div>
              <div class="text-xs font-medium text-gray-800 dark:text-gray-100 text-center">
                {{ entry.name }}
              </div>
              <code class="text-[10px] text-gray-500 dark:text-gray-400 break-all text-center">
                &lt;{{ entry.selector }}&gt;
              </code>
            </div>
          }
        </div>
      </div>
    `,
    props: {
      catalog: ICON_CATALOG,
      count: ICON_CATALOG.length,
      rowColor: () => "currentColor",
    },
  }),
};

// Tamaños
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          Sizes (16, 20, 24, 32, 40, 48)
        </h3>
        <div class="flex flex-wrap items-end gap-6 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <ng-container *ngComponentOutlet="Search; inputs: { size: 16 }"></ng-container>
            <span class="text-[10px]">16</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <ng-container *ngComponentOutlet="Search; inputs: { size: 20 }"></ng-container>
            <span class="text-[10px]">20</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <ng-container *ngComponentOutlet="Search; inputs: { size: 24 }"></ng-container>
            <span class="text-[10px]">24</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <ng-container *ngComponentOutlet="Search; inputs: { size: 32 }"></ng-container>
            <span class="text-[10px]">32</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <ng-container *ngComponentOutlet="Search; inputs: { size: 40 }"></ng-container>
            <span class="text-[10px]">40</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <ng-container *ngComponentOutlet="Search; inputs: { size: 48 }"></ng-container>
            <span class="text-[10px]">48</span>
          </div>
        </div>

        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-8 mb-4">
          width/height explícitos (sobrescriben size)
        </h3>
        <div class="flex flex-wrap items-end gap-6 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <ng-container *ngComponentOutlet="Info; inputs: { width: 60, height: 30 }"></ng-container>
          <ng-container *ngComponentOutlet="Info; inputs: { width: 30, height: 60 }"></ng-container>
        </div>
      </div>
    `,
    props: {
      Search: IconSearchComponent,
      Info: IconInfoComponent,
    },
  }),
};

// Colores
export const Colors: Story = {
  render: () => ({
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          Color via CSS (currentColor)
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Si no pasás <code class="px-1 rounded bg-gray-200 dark:bg-white/10 text-[10px]">color</code>,
          el icono hereda el <code class="px-1 rounded bg-gray-200 dark:bg-white/10 text-[10px]">color</code>
          del padre.
        </p>
        <div class="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <span class="text-gray-900 dark:text-gray-100">
            <ng-container *ngComponentOutlet="Check; inputs: { size: 24 }"></ng-container>
          </span>
          <span class="text-brand-500">
            <ng-container *ngComponentOutlet="Check; inputs: { size: 24 }"></ng-container>
          </span>
          <span class="text-success-500">
            <ng-container *ngComponentOutlet="Check; inputs: { size: 24 }"></ng-container>
          </span>
          <span class="text-warning-500">
            <ng-container *ngComponentOutlet="Check; inputs: { size: 24 }"></ng-container>
          </span>
          <span class="text-error-500">
            <ng-container *ngComponentOutlet="Check; inputs: { size: 24 }"></ng-container>
          </span>
        </div>

        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-8 mb-4">
          Color explícito vía input
        </h3>
        <div class="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <ng-container *ngComponentOutlet="Check; inputs: { size: 24, color: '#3b82f6' }"></ng-container>
          <ng-container *ngComponentOutlet="Check; inputs: { size: 24, color: '#10b981' }"></ng-container>
          <ng-container *ngComponentOutlet="Check; inputs: { size: 24, color: '#f59e0b' }"></ng-container>
          <ng-container *ngComponentOutlet="Check; inputs: { size: 24, color: '#ef4444' }"></ng-container>
          <ng-container *ngComponentOutlet="Check; inputs: { size: 24, color: '#8b5cf6' }"></ng-container>
        </div>
      </div>
    `,
    props: {
      Check: IconCircleInfoLightComponent,
    },
  }),
};

// Grid
export const AllIconsGrid: Story = {
  render: () => ({
    template: `
      <div class="p-6 bg-gray-50 dark:bg-gray-900">
        <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-2">
          @for (entry of catalog; track entry.selector) {
            <div
              class="aspect-square flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              [title]="entry.selector"
            >
              <ng-container
                *ngComponentOutlet="entry.component; inputs: { size: 20 }"
              ></ng-container>
            </div>
          }
        </div>
      </div>
    `,
    props: { catalog: ICON_CATALOG },
  }),
};
