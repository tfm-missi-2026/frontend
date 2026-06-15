import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiBadgeComponent } from "@shared/ui/badge";

const PLUS_ICON = `<svg class="fill-current" width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.25012 3C5.25012 2.58579 5.58591 2.25 6.00012 2.25C6.41433 2.25 6.75012 2.58579 6.75012 3V5.25012L9.00034 5.25012C9.41455 5.25012 9.75034 5.58591 9.75034 6.00012C9.75034 6.41433 9.41455 6.75012 9.00034 6.75012H6.75012V9.00034C6.75012 9.41455 6.41433 9.75034 6.00012 9.75034C5.58591 9.75034 5.25012 9.41455 5.25012 9.00034L5.25012 6.75012H3C2.58579 6.75012 2.25 6.41433 2.25 6.00012C2.25 5.58591 2.58579 5.25012 3 5.25012H5.25012V3Z" fill=""></path></svg>`;

const VARIANTS = ["light", "solid"] as const;
const SIZES = ["sm", "md"] as const;
const COLORS = [
  "primary",
  "success",
  "error",
  "warning",
  "info",
  "light",
  "dark",
] as const;

const meta: Meta<UiBadgeComponent> = {
  title: "Shared/Badge",
  component: UiBadgeComponent,
  decorators: [moduleMetadata({ imports: [UiBadgeComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: [...VARIANTS],
    },
    size: {
      control: "select",
      options: [...SIZES],
    },
    color: {
      control: "select",
      options: [...COLORS],
    },
    startIcon: { control: "text" },
    endIcon: { control: "text" },
  },
  args: {
    variant: "light",
    size: "md",
    color: "primary",
  },
};

export default meta;

type Story = StoryObj<UiBadgeComponent>;

// Default
export const Default: Story = {
  render: (args) => ({
    props: { ...args, PLUS_ICON },
    template: `
      <div class="p-6">
        <UiBadge
          [variant]="variant"
          [size]="size"
          [color]="color"
          [startIcon]="startIcon"
          [endIcon]="endIcon"
        >
          Primary
        </UiBadge>
      </div>
    `,
  }),
};

// Light variant — todos los colores
export const LightVariant: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          variant="light"
        </h3>
        <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <UiBadge variant="light" color="primary">Primary</UiBadge>
          <UiBadge variant="light" color="success">Success</UiBadge>
          <UiBadge variant="light" color="error">Error</UiBadge>
          <UiBadge variant="light" color="warning">Warning</UiBadge>
          <UiBadge variant="light" color="info">Info</UiBadge>
          <UiBadge variant="light" color="light">Light</UiBadge>
          <UiBadge variant="light" color="dark">Dark</UiBadge>
        </div>
      </div>
    `,
  }),
};

// Solid variant — todos los colores
export const SolidVariant: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          variant="solid"
        </h3>
        <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <UiBadge variant="solid" color="primary">Primary</UiBadge>
          <UiBadge variant="solid" color="success">Success</UiBadge>
          <UiBadge variant="solid" color="error">Error</UiBadge>
          <UiBadge variant="solid" color="warning">Warning</UiBadge>
          <UiBadge variant="solid" color="info">Info</UiBadge>
          <UiBadge variant="solid" color="light">Light</UiBadge>
          <UiBadge variant="solid" color="dark">Dark</UiBadge>
        </div>
      </div>
    `,
  }),
};

// Tamaños
export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          size="sm" | size="md"
        </h3>
        <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <UiBadge size="sm" color="primary">Small</UiBadge>
          <UiBadge size="md" color="primary">Medium</UiBadge>
        </div>
      </div>
    `,
  }),
};

// Con startIcon
export const WithStartIcon: Story = {
  render: () => ({
    props: { PLUS_ICON },
    template: `
      <div class="p-6 space-y-4">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Light con startIcon
          </h3>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiBadge variant="light" color="primary" [startIcon]="PLUS_ICON">Primary</UiBadge>
            <UiBadge variant="light" color="success" [startIcon]="PLUS_ICON">Success</UiBadge>
            <UiBadge variant="light" color="error" [startIcon]="PLUS_ICON">Error</UiBadge>
            <UiBadge variant="light" color="warning" [startIcon]="PLUS_ICON">Warning</UiBadge>
            <UiBadge variant="light" color="info" [startIcon]="PLUS_ICON">Info</UiBadge>
            <UiBadge variant="light" color="light" [startIcon]="PLUS_ICON">Light</UiBadge>
            <UiBadge variant="light" color="dark" [startIcon]="PLUS_ICON">Dark</UiBadge>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Solid con startIcon
          </h3>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiBadge variant="solid" color="primary" [startIcon]="PLUS_ICON">Primary</UiBadge>
            <UiBadge variant="solid" color="success" [startIcon]="PLUS_ICON">Success</UiBadge>
            <UiBadge variant="solid" color="error" [startIcon]="PLUS_ICON">Error</UiBadge>
            <UiBadge variant="solid" color="warning" [startIcon]="PLUS_ICON">Warning</UiBadge>
            <UiBadge variant="solid" color="info" [startIcon]="PLUS_ICON">Info</UiBadge>
            <UiBadge variant="solid" color="light" [startIcon]="PLUS_ICON">Light</UiBadge>
            <UiBadge variant="solid" color="dark" [startIcon]="PLUS_ICON">Dark</UiBadge>
          </div>
        </div>
      </div>
    `,
  }),
};

// Con endIcon
export const WithEndIcon: Story = {
  render: () => ({
    props: { PLUS_ICON },
    template: `
      <div class="p-6 space-y-4">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Light con endIcon
          </h3>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiBadge variant="light" color="primary" [endIcon]="PLUS_ICON">Primary</UiBadge>
            <UiBadge variant="light" color="success" [endIcon]="PLUS_ICON">Success</UiBadge>
            <UiBadge variant="light" color="error" [endIcon]="PLUS_ICON">Error</UiBadge>
            <UiBadge variant="light" color="warning" [endIcon]="PLUS_ICON">Warning</UiBadge>
            <UiBadge variant="light" color="info" [endIcon]="PLUS_ICON">Info</UiBadge>
            <UiBadge variant="light" color="light" [endIcon]="PLUS_ICON">Light</UiBadge>
            <UiBadge variant="light" color="dark" [endIcon]="PLUS_ICON">Dark</UiBadge>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Solid con endIcon
          </h3>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiBadge variant="solid" color="primary" [endIcon]="PLUS_ICON">Primary</UiBadge>
            <UiBadge variant="solid" color="success" [endIcon]="PLUS_ICON">Success</UiBadge>
            <UiBadge variant="solid" color="error" [endIcon]="PLUS_ICON">Error</UiBadge>
            <UiBadge variant="solid" color="warning" [endIcon]="PLUS_ICON">Warning</UiBadge>
            <UiBadge variant="solid" color="info" [endIcon]="PLUS_ICON">Info</UiBadge>
            <UiBadge variant="solid" color="light" [endIcon]="PLUS_ICON">Light</UiBadge>
            <UiBadge variant="solid" color="dark" [endIcon]="PLUS_ICON">Dark</UiBadge>
          </div>
        </div>
      </div>
    `,
  }),
};

// Status usage examples
export const StatusUsage: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          Uso típico para status
        </h3>
        <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <UiBadge variant="light" color="success" size="sm">Delivered</UiBadge>
          <UiBadge variant="light" color="warning" size="sm">Pending</UiBadge>
          <UiBadge variant="light" color="error" size="sm">Canceled</UiBadge>
        </div>
      </div>
    `,
  }),
};
