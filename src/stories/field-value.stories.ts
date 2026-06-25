import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiFieldValueComponent } from "@shared/ui/field-value";

const meta: Meta<UiFieldValueComponent> = {
  title: "Shared/FieldValue",
  component: UiFieldValueComponent,
  decorators: [moduleMetadata({ imports: [UiFieldValueComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    valueClassName: { control: "text" },
    placeholderClassName: { control: "text" },
  },
  args: {
    value: "Angular",
    placeholder: "Seleccionar framework",
  },
};

export default meta;

type Story = StoryObj<UiFieldValueComponent>;

// Default — value presente
export const WithValue: Story = {};

// Placeholder cuando no hay valor
export const Placeholder: Story = {
  args: { value: undefined, placeholder: "Selecciona una opción" },
};

// Vacío → no renderiza
export const Empty: Story = {
  args: { value: undefined, placeholder: "" },
};

// Dentro de un control simulado (caso real en un UiSelect)
export const InsideControl: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-4 max-w-sm">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Con valor
        </h3>
        <div class="flex items-center min-h-11 w-full py-1 px-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700">
          <div class="flex flex-1 items-center min-w-0">
            <UiFieldValue value="Angular 17"></UiFieldValue>
          </div>
        </div>

        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Sin valor → placeholder
        </h3>
        <div class="flex items-center min-h-11 w-full py-1 px-3 rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700">
          <div class="flex flex-1 items-center min-w-0">
            <UiFieldValue placeholder="Selecciona una opción"></UiFieldValue>
          </div>
        </div>
      </div>
    `,
  }),
};
