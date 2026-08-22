import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiInfoIconWithTooltipComponent } from "@shared/ui/info-icon-with-tooltip/info-icon-with-tooltip.component";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle/theme-toggle.component";

const sides = ["top", "right", "bottom", "left"] as const;
const aligns = ["start", "center", "end"] as const;
const variants = ["light", "dark"] as const;

const meta: Meta<UiInfoIconWithTooltipComponent> = {
  title: "Shared/InfoIconWithTooltip",
  component: UiInfoIconWithTooltipComponent,
  decorators: [
    moduleMetadata({
      imports: [UiInfoIconWithTooltipComponent, CommonThemeToggleComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    tooltip: { control: "text" },
    size: { control: { type: "number", min: 8, max: 48, step: 1 } },
    color: { control: "color" },
    dataTestId: { control: "text" },
    className: { control: "text" },
    variant: { control: "select", options: variants },
    side: { control: "select", options: sides },
    sideOffset: { control: { type: "number", min: 0, max: 32 } },
    align: { control: "select", options: aligns },
    delayDuration: { control: { type: "number", min: 0, max: 3000, step: 50 } },
  },
  args: {
    tooltip: "Información adicional al pasar el cursor",
    size: 12,
    color: "currentColor",
    variant: "light",
    side: "bottom",
    sideOffset: 8,
    align: "start",
    delayDuration: 200,
  },
};

export default meta;

type Story = StoryObj<UiInfoIconWithTooltipComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-32 items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-200">
        <span>Pasa el cursor sobre el icono</span>
        <InfoIconWithTooltip
          [tooltip]="tooltip"
          [size]="size"
          [color]="color"
          [variant]="variant"
          [side]="side"
          [sideOffset]="sideOffset"
          [align]="align"
          [delayDuration]="delayDuration"
          [className]="className"
          [dataTestId]="dataTestId"
        ></InfoIconWithTooltip>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-200">
        <span class="flex items-center gap-2">
          8 <InfoIconWithTooltip tooltip="8px" [size]="8"></InfoIconWithTooltip>
        </span>
        <span class="flex items-center gap-2">
          12 <InfoIconWithTooltip tooltip="12px" [size]="12"></InfoIconWithTooltip>
        </span>
        <span class="flex items-center gap-2">
          16 <InfoIconWithTooltip tooltip="16px" [size]="16"></InfoIconWithTooltip>
        </span>
        <span class="flex items-center gap-2">
          20 <InfoIconWithTooltip tooltip="20px" [size]="20"></InfoIconWithTooltip>
        </span>
        <span class="flex items-center gap-2">
          24 <InfoIconWithTooltip tooltip="24px" [size]="24"></InfoIconWithTooltip>
        </span>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-200">
        <InfoIconWithTooltip variant="light" tooltip="Variant light"></InfoIconWithTooltip>
        <InfoIconWithTooltip variant="dark" tooltip="Variant dark"></InfoIconWithTooltip>
      </div>
    `,
  }),
};

export const AllSides: Story = {
  render: () => ({
    template: `
      <div class="grid h-72 grid-cols-3 grid-rows-3 items-center justify-items-center gap-4 text-sm text-gray-700 dark:text-gray-200">
        <div></div>
        <InfoIconWithTooltip side="top" tooltip="Aparece desde arriba"></InfoIconWithTooltip>
        <div></div>

        <InfoIconWithTooltip side="left" tooltip="Aparece desde la izquierda"></InfoIconWithTooltip>
        <span class="text-xs text-gray-500">center</span>
        <InfoIconWithTooltip side="right" tooltip="Aparece desde la derecha"></InfoIconWithTooltip>

        <div></div>
        <InfoIconWithTooltip side="bottom" tooltip="Aparece desde abajo"></InfoIconWithTooltip>
        <div></div>
      </div>
    `,
  }),
};

export const CustomColor: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <span class="text-error-500"><InfoIconWithTooltip color="#ef4444" tooltip="Color heredado de currentColor"></InfoIconWithTooltip></span>
        <span class="text-brand-500"><InfoIconWithTooltip color="#3b82f6" tooltip="Color brand"></InfoIconWithTooltip></span>
        <span class="text-success-500"><InfoIconWithTooltip color="#10b981" tooltip="Color success"></InfoIconWithTooltip></span>
      </div>
    `,
  }),
};

export const WithLongContent: Story = {
  args: {
    tooltip:
      "Este tooltip tiene contenido extenso que demuestra que el mensaje puede incluir varias líneas y mantener la legibilidad gracias al max-width del componente.",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-32 items-center justify-center text-sm text-gray-700 dark:text-gray-200">
        <InfoIconWithTooltip
          [tooltip]="tooltip"
          [side]="side"
          [align]="align"
          [sideOffset]="sideOffset"
        ></InfoIconWithTooltip>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark bg-gray-900 rounded-lg p-6 space-y-4">
        <div class="flex items-center gap-6 text-sm text-gray-200">
          <InfoIconWithTooltip variant="light" tooltip="Light en dark theme"></InfoIconWithTooltip>
          <InfoIconWithTooltip variant="dark" tooltip="Dark en dark theme"></InfoIconWithTooltip>
        </div>
        <div class="flex items-center gap-6 text-sm text-gray-200">
          <span class="flex items-center gap-2">small <InfoIconWithTooltip tooltip="Pequeño" [size]="10"></InfoIconWithTooltip></span>
          <span class="flex items-center gap-2">medium <InfoIconWithTooltip tooltip="Mediano" [size]="14"></InfoIconWithTooltip></span>
          <span class="flex items-center gap-2">large <InfoIconWithTooltip tooltip="Grande" [size]="20"></InfoIconWithTooltip></span>
        </div>
      </div>
    `,
  }),
};

export const WithThemeSwitch: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col items-start gap-6 p-6">
        <CommonThemeToggle variant="subtle" size="md"></CommonThemeToggle>

        <div class="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-200">
          <InfoIconWithTooltip variant="light" tooltip="Light variant — se adapta al tema"></InfoIconWithTooltip>
          <InfoIconWithTooltip variant="dark" tooltip="Dark variant — se adapta al tema"></InfoIconWithTooltip>
          <InfoIconWithTooltip side="right" tooltip="Lado derecho"></InfoIconWithTooltip>
        </div>
      </div>
    `,
  }),
};

export const InlineWithLabel: Story = {
  name: "Inline with label",
  render: () => ({
    template: `
      <div class="flex flex-col gap-3 max-w-sm text-sm text-gray-700 dark:text-gray-200">
        <span class="inline-flex items-center gap-1">
          Email
          <InfoIconWithTooltip tooltip="Nunca compartiremos tu correo con terceros."></InfoIconWithTooltip>
        </span>
        <span class="inline-flex items-center gap-1">
          Contraseña
          <InfoIconWithTooltip side="right" tooltip="Mínimo 8 caracteres, una mayúscula y un número."></InfoIconWithTooltip>
        </span>
      </div>
    `,
  }),
};