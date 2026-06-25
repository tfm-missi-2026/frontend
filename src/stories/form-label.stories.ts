import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiFormLabelComponent } from "@shared/ui/form-label/form-label.component";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle";
import { FontWeightType } from "@styles/types/typography";

const fontWeights: FontWeightType[] = ["regular", "medium", "semibold", "bold"];

const meta: Meta<UiFormLabelComponent> = {
  title: "Shared/FormLabel",
  component: UiFormLabelComponent,
  decorators: [
    moduleMetadata({
      imports: [UiFormLabelComponent, CommonThemeToggleComponent],
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
    weight: { control: "select", options: [...fontWeights, undefined] },
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

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-1 max-w-sm">
        <UiFormLabel
          [labelText]="labelText"
          [labelFor]="labelFor"
        ></UiFormLabel>
        <input
          id="{{ labelFor }}"
          type="email"
          class="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
    `,
  }),
};

export const Required: Story = {
  args: { required: true },
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-1 max-w-sm">
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
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-1 max-w-sm">
        <UiFormLabel
          [labelText]="labelText"
          [labelFor]="labelFor"
          [required]="required"
          [disabled]="disabled"
        ></UiFormLabel>
        <input
          id="{{ labelFor }}"
          type="email"
          disabled
          class="w-full border rounded-md px-3 py-2 text-sm opacity-60"
        />
      </div>
    `,
  }),
};

export const ReadOnly: Story = {
  args: { required: true, readOnly: true },
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-1 max-w-sm">
        <UiFormLabel
          [labelText]="labelText"
          [labelFor]="labelFor"
          [required]="required"
          [readOnly]="readOnly"
        ></UiFormLabel>
        <input
          id="{{ labelFor }}"
          type="email"
          readonly
          class="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
    `,
  }),
};

export const WithTooltip: Story = {
  args: {
    tooltip: "Este correo se usará para enviarte notificaciones importantes.",
  },
  render: (args) => ({
    props: args,
    template: `
      <UiFormLabel
        [labelText]="labelText"
        [labelFor]="labelFor"
        [tooltip]="tooltip"
      ></UiFormLabel>
    `,
  }),
};

export const RequiredWithTooltip: Story = {
  args: {
    required: true,
    tooltip: "Tu contraseña debe tener al menos 8 caracteres.",
  },
  render: (args) => ({
    props: args,
    template: `
      <UiFormLabel
        [labelText]="labelText"
        [labelFor]="labelFor"
        [required]="required"
        [tooltip]="tooltip"
      ></UiFormLabel>
    `,
  }),
};

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

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg space-y-4">
        <UiFormLabel labelText="Default" labelFor="d1"></UiFormLabel>
        <UiFormLabel labelText="Required" labelFor="d2" [required]="true"></UiFormLabel>
        <UiFormLabel labelText="Disabled" labelFor="d3" [required]="true" [disabled]="true"></UiFormLabel>
        <UiFormLabel labelText="Read only" labelFor="d4" [required]="true" [readOnly]="true"></UiFormLabel>
        <UiFormLabel labelText="With tooltip" labelFor="d5" tooltip="Texto de ayuda"></UiFormLabel>
        <UiFormLabel labelText="Required + tooltip" labelFor="d6" [required]="true" tooltip="Texto de ayuda"></UiFormLabel>
      </div>
    `,
  }),
};

export const WithThemeSwitch: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col items-start gap-6 p-6">
        <CommonThemeToggle variant="subtle" size="md"></CommonThemeToggle>
        <div class="space-y-3">
          <UiFormLabel labelText="Email" labelFor="l1" [required]="true"></UiFormLabel>
          <UiFormLabel labelText="Password" labelFor="l2" [required]="true" tooltip="Mínimo 8 caracteres"></UiFormLabel>
          <UiFormLabel labelText="Display name" labelFor="l3" [weight]="'semibold'"></UiFormLabel>
        </div>
      </div>
    `,
  }),
};

export const Responsive: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
  render: () => ({
    template: `
      <div class="p-4 max-w-sm space-y-4">
        <UiFormLabel
          labelText="Etiqueta con texto largo que demuestra que el wrapText funciona en mobile cuando el contenedor es estrecho"
          labelFor="r1"
          [wrapText]="true"
        ></UiFormLabel>
        <UiFormLabel
          labelText="Email"
          labelFor="r2"
          [required]="true"
          tooltip="Requerido y con tooltip"
        ></UiFormLabel>
      </div>
    `,
  }),
};
