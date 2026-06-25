import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiFieldErrorComponent } from "@shared/ui/field-error";

const meta: Meta<UiFieldErrorComponent> = {
  title: "Shared/FieldError",
  component: UiFieldErrorComponent,
  decorators: [moduleMetadata({ imports: [UiFieldErrorComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    message: { control: "text" },
    id: { control: "text" },
    className: { control: "text" },
  },
  args: {
    message: "Este campo es obligatorio",
  },
};

export default meta;

type Story = StoryObj<UiFieldErrorComponent>;

// Default
export const Default: Story = {};

// Vacío → no renderiza nada
export const Empty: Story = {
  args: { message: "" },
};

// Ejemplo acoplado a un input con aria-describedby
export const PairedWithInput: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-sm space-y-1.5">
        <label
          for="email"
          class="block text-sm font-medium text-gray-700 dark:text-gray-400"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          aria-describedby="email-error"
          class="w-full border border-error-500 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:border-error-500 outline-none"
          value="not-an-email"
        />
        <UiFieldError
          [message]="message"
          [id]="'email-error'"
        ></UiFieldError>
      </div>
    `,
  }),
};
