import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiBadgeComponent } from "@shared/ui/badge";
import { IconPlusComponent } from "@shared/icons";

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
    startIcon: { control: "object" },
    endIcon: { control: "object" },
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
    props: { ...args, PlusIcon: IconPlusComponent },
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
    props: { PlusIcon: IconPlusComponent },
    template: `
      <div class="p-6 space-y-4">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Light con startIcon
          </h3>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiBadge variant="light" color="primary" [startIcon]="PlusIcon">Primary</UiBadge>
            <UiBadge variant="light" color="success" [startIcon]="PlusIcon">Success</UiBadge>
            <UiBadge variant="light" color="error" [startIcon]="PlusIcon">Error</UiBadge>
            <UiBadge variant="light" color="warning" [startIcon]="PlusIcon">Warning</UiBadge>
            <UiBadge variant="light" color="info" [startIcon]="PlusIcon">Info</UiBadge>
            <UiBadge variant="light" color="light" [startIcon]="PlusIcon">Light</UiBadge>
            <UiBadge variant="light" color="dark" [startIcon]="PlusIcon">Dark</UiBadge>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Solid con startIcon
          </h3>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiBadge variant="solid" color="primary" [startIcon]="PlusIcon">Primary</UiBadge>
            <UiBadge variant="solid" color="success" [startIcon]="PlusIcon">Success</UiBadge>
            <UiBadge variant="solid" color="error" [startIcon]="PlusIcon">Error</UiBadge>
            <UiBadge variant="solid" color="warning" [startIcon]="PlusIcon">Warning</UiBadge>
            <UiBadge variant="solid" color="info" [startIcon]="PlusIcon">Info</UiBadge>
            <UiBadge variant="solid" color="light" [startIcon]="PlusIcon">Light</UiBadge>
            <UiBadge variant="solid" color="dark" [startIcon]="PlusIcon">Dark</UiBadge>
          </div>
        </div>
      </div>
    `,
  }),
};

// Con endIcon
export const WithEndIcon: Story = {
  render: () => ({
    props: { PlusIcon: IconPlusComponent },
    template: `
      <div class="p-6 space-y-4">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Light con endIcon
          </h3>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiBadge variant="light" color="primary" [endIcon]="PlusIcon">Primary</UiBadge>
            <UiBadge variant="light" color="success" [endIcon]="PlusIcon">Success</UiBadge>
            <UiBadge variant="light" color="error" [endIcon]="PlusIcon">Error</UiBadge>
            <UiBadge variant="light" color="warning" [endIcon]="PlusIcon">Warning</UiBadge>
            <UiBadge variant="light" color="info" [endIcon]="PlusIcon">Info</UiBadge>
            <UiBadge variant="light" color="light" [endIcon]="PlusIcon">Light</UiBadge>
            <UiBadge variant="light" color="dark" [endIcon]="PlusIcon">Dark</UiBadge>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            Solid con endIcon
          </h3>
          <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiBadge variant="solid" color="primary" [endIcon]="PlusIcon">Primary</UiBadge>
            <UiBadge variant="solid" color="success" [endIcon]="PlusIcon">Success</UiBadge>
            <UiBadge variant="solid" color="error" [endIcon]="PlusIcon">Error</UiBadge>
            <UiBadge variant="solid" color="warning" [endIcon]="PlusIcon">Warning</UiBadge>
            <UiBadge variant="solid" color="info" [endIcon]="PlusIcon">Info</UiBadge>
            <UiBadge variant="solid" color="light" [endIcon]="PlusIcon">Light</UiBadge>
            <UiBadge variant="solid" color="dark" [endIcon]="PlusIcon">Dark</UiBadge>
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