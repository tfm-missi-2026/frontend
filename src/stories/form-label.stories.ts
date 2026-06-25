import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { UiFormLabelComponent } from "@shared/ui/form-label/form-label.component";
import { FontWeightType } from "@styles/types/typography";

const fontWeights: FontWeightType[] = ["regular", "medium", "semibold", "bold"];

const meta: Meta<UiFormLabelComponent> = {
  title: "Shared/FormLabel",
  component: UiFormLabelComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, UiFormLabelComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    labelText: { control: "text" },
    labelFor: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    weight: { control: "select", options: [...fontWeights, null] },
    wrapText: { control: "boolean" },
    tooltip: { control: "text" },
  },
  args: {
    labelText: "Email",
    labelFor: "email",
    required: false,
    disabled: false,
    readOnly: false,
    wrapText: false,
  },
};

export default meta;

type Story = StoryObj<UiFormLabelComponent>;

// Default
export const Default: Story = {};

// Estados
export const Required: Story = {
  args: { required: true },
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-1">
        <UiFormLabel
          [labelText]="labelText"
          [labelFor]="labelFor"
          [required]="required"
        ></UiFormLabel>
        <input
          id="{{ labelFor }}"
          type="email"
          required
          class="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: { required: true, disabled: true },
};

export const ReadOnly: Story = {
  args: { required: true, readOnly: true },
};

// Tooltip
export const WithTooltip: Story = {
  args: {
    tooltip: "Este correo se usará para enviarte notificaciones importantes.",
  },
};

export const RequiredWithTooltip: Story = {
  args: {
    required: true,
    tooltip: "Tu contraseña debe tener al menos 8 caracteres.",
  },
};

// Pesos
export const FontWeights: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        @for (w of weights; track w) {
          <div class="flex items-baseline gap-4">
            <span class="w-24 text-xs text-gray-500">{{ w }}</span>
            <UiFormLabel labelText="The quick brown fox" labelFor="fw" [weight]="w"></UiFormLabel>
          </div>
        }
      </div>
    `,
    props: { weights: fontWeights },
  }),
};

// Wrap
export const WrapText: Story = {
  args: {
    labelText:
      "Etiqueta muy larga que demuestra el comportamiento de wrapText cuando el contenedor padre tiene un ancho limitado.",
    labelFor: "wrap",
    wrapText: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-xs border rounded-lg p-3">
        <UiFormLabel
          [labelText]="labelText"
          [labelFor]="labelFor"
          [wrapText]="wrapText"
        ></UiFormLabel>
      </div>
    `,
  }),
};
