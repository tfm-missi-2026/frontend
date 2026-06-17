import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { UiSeparatorComponent } from "@shared/ui/separator";

const meta: Meta<UiSeparatorComponent> = {
  title: "Shared/Separator",
  component: UiSeparatorComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, UiSeparatorComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
    },
    thickness: {
      control: "select",
      options: ["thin", "medium", "thick"],
    },
    spacing: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["gray", "subtle", "brand", "danger"],
    },
    className: { control: "text" },
  },
  args: {
    orientation: "horizontal",
    variant: "solid",
    thickness: "thin",
    spacing: "md",
    color: "gray",
    className: "",
  },
};

export default meta;

type Story = StoryObj<UiSeparatorComponent>;

// Default
export const Default: Story = {};

// Variantes de trazo
export const Solid: Story = { args: { variant: "solid" } };

export const Dashed: Story = { args: { variant: "dashed" } };

export const Dotted: Story = { args: { variant: "dotted" } };

// Grosor
export const Thin: Story = { args: { thickness: "thin" } };

export const Medium: Story = { args: { thickness: "medium" } };

export const Thick: Story = { args: { thickness: "thick" } };

// Colores
export const Gray: Story = { args: { color: "gray" } };

export const Subtle: Story = { args: { color: "subtle" } };

export const Brand: Story = { args: { color: "brand" } };

export const Danger: Story = { args: { color: "danger" } };

// Espaciado
export const NoSpacing: Story = { args: { spacing: "none" } };

export const SpacingSm: Story = { args: { spacing: "sm" } };

export const SpacingMd: Story = { args: { spacing: "md" } };

export const SpacingLg: Story = { args: { spacing: "lg" } };

// Vertical — necesita un contenedor con altura para que se vea
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-center gap-4 min-h-50 p-4 bg-white dark:bg-gray-900">
        <span class="text-sm text-gray-700 dark:text-gray-200">Item A</span>
        <UiSeparator
          [orientation]="orientation"
          [variant]="variant"
          [thickness]="thickness"
          [color]="color"
        />
        <span class="text-sm text-gray-700 dark:text-gray-200">Item B</span>
        <UiSeparator
          [orientation]="orientation"
          [variant]="variant"
          [thickness]="thickness"
          [color]="color"
        />
        <span class="text-sm text-gray-700 dark:text-gray-200">Item C</span>
      </div>
    `,
  }),
};

// Caso real — lista con separadores
export const InList: Story = {
  render: () => ({
    template: `
      <ul class="max-w-md bg-white dark:bg-gray-900">
        <li class="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
          Elemento 1
        </li>
        <UiSeparator spacing="none" />
        <li class="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
          Elemento 2
        </li>
        <UiSeparator spacing="none" />
        <li class="py-3 px-4 text-sm text-gray-700 dark:text-gray-200">
          Elemento 3
        </li>
      </ul>
    `,
  }),
};

// Caso real — toolbar con separadores verticales
export const InToolbar: Story = {
  render: () => ({
    template: `
      <div
        class="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
      >
        <button
          type="button"
          class="text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500"
        >
          Negrita
        </button>
        <UiSeparator orientation="vertical" thickness="thin" />
        <button
          type="button"
          class="text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500"
        >
          Itálica
        </button>
        <UiSeparator orientation="vertical" thickness="thin" />
        <button
          type="button"
          class="text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500"
        >
          Subrayado
        </button>
      </div>
    `,
  }),
};

// Combinación
export const BrandDashed: Story = {
  args: {
    color: "brand",
    variant: "dashed",
    thickness: "medium",
    spacing: "lg",
  },
};
