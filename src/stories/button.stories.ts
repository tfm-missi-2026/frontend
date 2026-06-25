import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { UiButtonComponent } from "@shared/ui/button/button.component";
import { UiTooltipComponent } from "@shared/ui/tooltip/tooltip.component";
import { IconFloppyDiskLightComponent } from "@shared/icons/floppy-disk-icon-light";
import { IconUploadLightComponent } from "@shared/icons/upload-icon-light";

const meta: Meta<UiButtonComponent> = {
  title: "Shared/Button",
  component: UiButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        UiButtonComponent,
        UiTooltipComponent,
        IconFloppyDiskLightComponent,
        IconUploadLightComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    styleType: {
      control: "select",
      options: ["default", "danger", "monochrome", "warning", "success"],
    },
    compact: { control: "boolean" },
    fullWidth: { control: "boolean" },
    transparent: { control: "boolean" },
    disabled: { control: "boolean" },
    isSubmit: { control: "boolean" },
    isLoading: { control: "boolean" },
    fontSize: {
      control: "select",
      options: [
        "bodyXxs",
        "bodyXs",
        "bodyS",
        "HeadingXs",
        "HeadingS",
        "HeadingM",
        "HeadingL",
      ],
    },
    tooltip: { control: "text" },
    tooltipSide: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    tooltipVariant: {
      control: "select",
      options: ["light", "dark", "info", "success", "warning", "error"],
    },
    labelText: { control: "text" },
    timeout: { control: { type: "number", min: 0 } },
    disableOnTimeout: { control: "boolean" },
    label: { control: "text" },
    className: { control: "text" },
    click: { action: "clicked" },
  },
  args: {
    variant: "primary",
    styleType: "default",
    compact: false,
    fullWidth: false,
    transparent: false,
    disabled: false,
    isSubmit: false,
    isLoading: false,
    fontSize: "bodyS",
    label: "Button",
  },
};

export default meta;

type Story = StoryObj<UiButtonComponent>;

// Default
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <UiButton
          [variant]="variant"
          [styleType]="styleType"
          [compact]="compact"
          [fullWidth]="fullWidth"
          [transparent]="transparent"
          [disabled]="disabled"
          [isSubmit]="isSubmit"
          [isLoading]="isLoading"
          [fontSize]="fontSize"
          [label]="label"
          [tooltip]="tooltip"
          [tooltipSide]="tooltipSide"
          [tooltipVariant]="tooltipVariant"
          [labelText]="labelText"
          [timeout]="timeout"
          [disableOnTimeout]="disableOnTimeout"
          [className]="className"
          (click)="click($event)"
        ></UiButton>
      </div>
    `,
  }),
};

// Variantes
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 p-4">
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Primary</h3>
          <div class="flex flex-wrap gap-2">
            <UiButton variant="primary" styleType="default" label="Default"></UiButton>
            <UiButton variant="primary" styleType="danger" label="Danger"></UiButton>
            <UiButton variant="primary" styleType="monochrome" label="Monochrome"></UiButton>
            <UiButton variant="primary" styleType="warning" label="Warning"></UiButton>
            <UiButton variant="primary" styleType="success" label="Success"></UiButton>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Secondary</h3>
          <div class="flex flex-wrap gap-2">
            <UiButton variant="secondary" styleType="default" label="Default"></UiButton>
            <UiButton variant="secondary" styleType="danger" label="Danger"></UiButton>
            <UiButton variant="secondary" styleType="monochrome" label="Monochrome"></UiButton>
            <UiButton variant="secondary" styleType="warning" label="Warning"></UiButton>
            <UiButton variant="secondary" styleType="success" label="Success"></UiButton>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Tertiary</h3>
          <div class="flex flex-wrap gap-2">
            <UiButton variant="tertiary" styleType="default" label="Default"></UiButton>
            <UiButton variant="tertiary" styleType="danger" label="Danger"></UiButton>
            <UiButton variant="tertiary" styleType="monochrome" label="Monochrome"></UiButton>
            <UiButton variant="tertiary" styleType="warning" label="Warning"></UiButton>
            <UiButton variant="tertiary" styleType="success" label="Success"></UiButton>
          </div>
        </div>
      </div>
    `,
  }),
};

// Estados
export const Compact: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <UiButton variant="primary" compact="true" label="Compact"></UiButton>
        <UiButton variant="primary" label="Normal"></UiButton>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2 p-4">
        <UiButton disabled="true" label="Primary disabled"></UiButton>
        <UiButton variant="secondary" disabled="true" label="Secondary disabled"></UiButton>
        <UiButton variant="tertiary" disabled="true" label="Tertiary disabled"></UiButton>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2 p-4">
        <UiButton isLoading="true" label="Primary loading"></UiButton>
        <UiButton variant="secondary" isLoading="true" label="Secondary loading"></UiButton>
        <UiButton variant="tertiary" isLoading="true" label="Tertiary loading"></UiButton>
      </div>
    `,
  }),
};

// Timeout
export const WithTimeout: Story = {
  args: {
    variant: "primary",
    timeout: 5000,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <UiButton
          [variant]="variant"
          [label]="label"
          [timeout]="timeout"
          (click)="click($event)"
        ></UiButton>
      </div>
    `,
  }),
};

export const WithTimeoutEnabledInteraction: Story = {
  args: {
    variant: "primary",
    timeout: 5000,
    disableOnTimeout: false,
    label: "Clickable during timeout",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <UiButton
          [variant]="variant"
          [label]="label"
          [timeout]="timeout"
          [disableOnTimeout]="disableOnTimeout"
          (click)="click($event)"
        ></UiButton>
      </div>
    `,
  }),
};

// Iconos
export const WithLeftIcon: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2 p-4">
        <UiButton
          variant="primary"
          [LeftIcon]="floppy"
          label="Grabar"
        ></UiButton>
        <UiButton
          variant="secondary"
          [LeftIcon]="floppy"
          label="Save"
        ></UiButton>
      </div>
    `,
    props: { floppy: IconFloppyDiskLightComponent },
  }),
};

export const WithRightIcon: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2 p-4">
        <UiButton
          variant="primary"
          [RightIcon]="upload"
          label="Upload"
        ></UiButton>
      </div>
    `,
    props: { upload: IconUploadLightComponent },
  }),
};

export const WithBothIcons: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2 p-4">
        <UiButton
          variant="primary"
          [LeftIcon]="floppy"
          [RightIcon]="upload"
          label="Save & upload"
        ></UiButton>
      </div>
    `,
    props: {
      floppy: IconFloppyDiskLightComponent,
      upload: IconUploadLightComponent,
    },
  }),
};

// Tamaños
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <UiButton fontSize="bodyXxs" label="bodyXxs"></UiButton>
        <UiButton fontSize="bodyXs" label="bodyXs"></UiButton>
        <UiButton fontSize="bodyS" label="bodyS"></UiButton>
        <UiButton fontSize="HeadingXs" label="HeadingXs"></UiButton>
        <UiButton fontSize="HeadingM" label="HeadingM"></UiButton>
      </div>
    `,
  }),
};

// Layout
export const FullWidth: Story = {
  render: () => ({
    template: `
      <div class="w-full max-w-sm p-4 space-y-2">
        <UiButton fullWidth="true" label="Full width primary"></UiButton>
        <UiButton variant="secondary" fullWidth="true" label="Full width secondary"></UiButton>
        <UiButton variant="tertiary" fullWidth="true" label="Full width tertiary"></UiButton>
      </div>
    `,
  }),
};

// Transparent
export const Transparent: Story = {
  render: () => ({
    template: `
      <div class="p-4 bg-gray-100 rounded-lg flex gap-2">
        <UiButton variant="secondary" transparent="true" label="Secondary transparent"></UiButton>
        <UiButton variant="tertiary" transparent="true" label="Tertiary transparent"></UiButton>
      </div>
    `,
  }),
};

// As link
export const AsLink: Story = {
  render: () => ({
    template: `
      <div class="p-4">
        <UiButton
          [asLink]="true"
          [linkProps]="{ href: 'https://angular.dev', target: '_blank' }"
          label="Abrir Angular"
        ></UiButton>
      </div>
    `,
  }),
};

// Tooltip
export const WithTooltip: Story = {
  args: { tooltip: "Guardar los cambios del formulario" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 flex items-center justify-center">
        <UiButton
          [tooltip]="tooltip"
          [tooltipSide]="tooltipSide"
          label="Hover me"
        ></UiButton>
      </div>
    `,
  }),
};

export const WithTooltipOnDisabled: Story = {
  args: { tooltip: "No puedes continuar hasta completar el paso anterior" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 flex items-center justify-center">
        <UiButton
          [tooltip]="tooltip"
          [disabled]="true"
          label="Disabled con tooltip"
        ></UiButton>
      </div>
    `,
  }),
};

export const TooltipFlip: Story = {
  render: () => ({
    template: `
      <div class="space-y-16 p-6">
        <p class="text-xs text-gray-500">
          El tooltip se auto-posiciona con Floating UI. Si el lado preferido
          no cabe en el viewport, salta al siguiente con espacio disponible.
        </p>
        <div class="flex flex-col gap-2">
          <span class="text-xs text-gray-500">tooltipSide="top" — con espacio arriba</span>
          <div class="flex justify-center pt-12">
            <UiButton tooltip="Tooltip arriba" tooltipSide="top" label="Hover me"></UiButton>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs text-gray-500">tooltipSide="right" (default) — con espacio a la derecha</span>
          <div class="flex justify-start">
            <UiButton tooltip="Tooltip a la derecha" label="Hover me"></UiButton>
          </div>
        </div>
      </div>
    `,
  }),
};

export const TooltipAllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-6 p-12">
        <UiButton variant="primary" tooltip="Tooltip en botón primary" label="Primary"></UiButton>
        <UiButton variant="secondary" tooltip="Tooltip en botón secondary" label="Secondary"></UiButton>
        <UiButton variant="tertiary" tooltip="Tooltip en botón tertiary" label="Tertiary"></UiButton>
        <UiButton variant="primary" [disabled]="true" tooltip="Disabled también muestra tooltip" label="Disabled"></UiButton>
      </div>
    `,
  }),
};
