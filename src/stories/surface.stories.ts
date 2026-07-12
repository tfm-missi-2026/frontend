import type { Meta, StoryObj } from "@storybook/angular";

import { UiSurfaceComponent } from "../app/shared/ui/surface/surface.component";

const VARIANTS = ["success", "error", "warning", "info", "neutral"] as const;
const PADDINGS = ["none", "sm", "md", "lg"] as const;

const meta: Meta<UiSurfaceComponent> = {
  title: "Components/Surface",
  component: UiSurfaceComponent,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: [...VARIANTS],
    },
    padding: {
      control: "select",
      options: [...PADDINGS],
    },
    className: { control: "text" },
    dataTestId: { control: "text" },
  },
  args: {
    variant: "neutral",
    padding: "md",
  },
};

export default meta;

type Story = StoryObj<UiSurfaceComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <UiSurface
        [variant]="variant"
        [padding]="padding"
        [className]="className"
        [dataTestId]="dataTestId"
      >
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Contenido de la superficie.
        </p>
      </UiSurface>
    `,
  }),
};

export const Neutral: Story = {
  render: () => ({
    template: `
      <UiSurface variant="neutral">
        <p class="text-sm text-gray-700 dark:text-gray-300">Surface neutral</p>
      </UiSurface>
    `,
  }),
};

export const Success: Story = {
  render: () => ({
    template: `
      <UiSurface variant="success">
        <p class="text-sm text-success-700 dark:text-success-300">
          Operación completada correctamente.
        </p>
      </UiSurface>
    `,
  }),
};

export const Error: Story = {
  render: () => ({
    template: `
      <UiSurface variant="error">
        <p class="text-sm text-error-700 dark:text-error-300">
          Ocurrió un error al procesar la solicitud.
        </p>
      </UiSurface>
    `,
  }),
};

export const Warning: Story = {
  render: () => ({
    template: `
      <UiSurface variant="warning">
        <p class="text-sm text-warning-700 dark:text-warning-300">
          Atención: revise los datos antes de continuar.
        </p>
      </UiSurface>
    `,
  }),
};

export const Info: Story = {
  render: () => ({
    template: `
      <UiSurface variant="info">
        <p class="text-sm text-blue-light-700 dark:text-blue-light-300">
          Información útil para el usuario.
        </p>
      </UiSurface>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <UiSurface variant="neutral">
          <span class="text-sm text-gray-700 dark:text-gray-300">neutral</span>
        </UiSurface>
        <UiSurface variant="success">
          <span class="text-sm text-success-700 dark:text-success-300">success</span>
        </UiSurface>
        <UiSurface variant="error">
          <span class="text-sm text-error-700 dark:text-error-300">error</span>
        </UiSurface>
        <UiSurface variant="warning">
          <span class="text-sm text-warning-700 dark:text-warning-300">warning</span>
        </UiSurface>
        <UiSurface variant="info">
          <span class="text-sm text-blue-light-700 dark:text-blue-light-300">info</span>
        </UiSurface>
      </div>
    `,
  }),
};

export const PaddingSizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <UiSurface variant="neutral" padding="none">
          <span class="text-sm text-gray-700 dark:text-gray-300">padding="none"</span>
        </UiSurface>
        <UiSurface variant="neutral" padding="sm">
          <span class="text-sm text-gray-700 dark:text-gray-300">padding="sm"</span>
        </UiSurface>
        <UiSurface variant="neutral" padding="md">
          <span class="text-sm text-gray-700 dark:text-gray-300">padding="md"</span>
        </UiSurface>
        <UiSurface variant="neutral" padding="lg">
          <span class="text-sm text-gray-700 dark:text-gray-300">padding="lg"</span>
        </UiSurface>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => ({
    template: `
      <div class="dark bg-gray-900 p-6 flex flex-col gap-4">
        <UiSurface variant="neutral">
          <span class="text-sm text-gray-700 dark:text-gray-300">neutral en dark</span>
        </UiSurface>
        <UiSurface variant="success">
          <span class="text-sm text-success-700 dark:text-success-300">success en dark</span>
        </UiSurface>
        <UiSurface variant="error">
          <span class="text-sm text-error-700 dark:text-error-300">error en dark</span>
        </UiSurface>
        <UiSurface variant="warning">
          <span class="text-sm text-warning-700 dark:text-warning-300">warning en dark</span>
        </UiSurface>
        <UiSurface variant="info">
          <span class="text-sm text-blue-light-700 dark:text-blue-light-300">info en dark</span>
        </UiSurface>
      </div>
    `,
  }),
};