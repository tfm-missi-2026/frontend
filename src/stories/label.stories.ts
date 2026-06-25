import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiLabelComponent } from "@shared/ui/label";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle";
import { ColorType } from "@styles/types/colors";
import { FontWeightType, TypographyType } from "@styles/types/typography";

const typographyTypes: TypographyType[] = [
  "bodyXxs",
  "bodyXs",
  "bodyS",
  "HeadingXs",
  "HeadingS",
  "HeadingM",
  "HeadingL",
  "HeadingXl",
  "HeadingXxl",
  "HeadingTV",
];

const fontWeights: FontWeightType[] = ["regular", "medium", "semibold", "bold"];

const colors: ColorType[] = [
  "textStrong",
  "textWeak",
  "textWeakest",
  "textDisabled",
  "textAction",
  "textActionStrong",
  "textError",
  "textSuccess",
  "textWarning",
];

const meta: Meta<UiLabelComponent> = {
  title: "Shared/Label",
  component: UiLabelComponent,
  decorators: [
    moduleMetadata({
      imports: [UiLabelComponent, CommonThemeToggleComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    for: { control: "text" },
    text: { control: "text" },
    type: { control: "select", options: typographyTypes },
    weight: { control: "select", options: [...fontWeights, undefined] },
    color: { control: "select", options: [...colors, undefined] },
    wrapText: { control: "boolean" },
    wrapMaxLines: { control: { type: "number", min: 1, max: 10 } },
    availableSpaceOffset: { control: { type: "number", min: 0 } },
    italic: { control: "boolean" },
    refreshOnLoad: { control: "boolean" },
    align: {
      control: "select",
      options: ["left", "right", "center", "justify", undefined],
    },
    className: { control: "text" },
    tooltipSide: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
  args: {
    text: "The quick brown fox jumps over the lazy dog",
    type: "bodyXs",
    wrapText: false,
  },
};

export default meta;

type Story = StoryObj<UiLabelComponent>;

export const Typography: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        @for (t of types; track t) {
          <div class="flex items-baseline gap-4">
            <span class="w-24 text-xs text-gray-500">{{ t }}</span>
            <UiLabel [type]="t" text="The quick brown fox"></UiLabel>
          </div>
        }
      </div>
    `,
    props: { types: typographyTypes },
  }),
};

export const FontWeights: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        @for (w of weights; track w) {
          <div class="flex items-baseline gap-4">
            <span class="w-24 text-xs text-gray-500">{{ w }}</span>
            <UiLabel type="HeadingM" [weight]="w" text="The quick brown fox"></UiLabel>
          </div>
        }
      </div>
    `,
    props: { weights: fontWeights },
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        @for (c of colors; track c) {
          <div class="flex items-baseline gap-4">
            <span class="w-32 text-xs text-gray-500">{{ c }}</span>
            <UiLabel [color]="c" text="The quick brown fox"></UiLabel>
          </div>
        }
      </div>
    `,
    props: { colors },
  }),
};

export const Italic: Story = {
  args: { italic: true, text: "Italic text" },
};

export const Alignment: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3 max-w-md border rounded-lg">
        <UiLabel align="left" text="Left aligned"></UiLabel>
        <UiLabel align="center" text="Center aligned"></UiLabel>
        <UiLabel align="right" text="Right aligned"></UiLabel>
        <UiLabel
          align="justify"
          text="Justified text spans multiple lines so you can see how the spacing is distributed between words when justify is applied."
        ></UiLabel>
      </div>
    `,
  }),
};

export const NoWrap: Story = {
  args: {
    type: "bodyS",
    text:
      "Texto muy largo que no debería hacer wrap porque wrapText está en false. Si no cabe, se recorta con ellipsis.",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <UiLabel [text]="text" [type]="type" [wrapText]="false"></UiLabel>
      </div>
    `,
  }),
};

export const WrapMultiLine: Story = {
  args: {
    type: "bodyS",
    text:
      "Este texto sí hace wrap porque wrapText es true. Verás cómo se ajusta a varias líneas respetando el ancho del contenedor padre.",
    wrapText: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <UiLabel [text]="text" [type]="type" [wrapText]="wrapText"></UiLabel>
      </div>
    `,
  }),
};

export const LineClamp2: Story = {
  args: {
    type: "bodyS",
    wrapText: true,
    wrapMaxLines: 2,
    text:
      "Este es un texto largo que será recortado a 2 líneas gracias a line-clamp-2 de Tailwind. Aunque haya más contenido, el overflow se oculta y se muestra ellipsis al final de la segunda línea.",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [wrapText]="wrapText"
          [wrapMaxLines]="wrapMaxLines"
        ></UiLabel>
      </div>
    `,
  }),
};

export const LineClamp3: Story = {
  args: {
    type: "bodyS",
    wrapText: true,
    wrapMaxLines: 3,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-md border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [wrapText]="wrapText"
          [wrapMaxLines]="wrapMaxLines"
        ></UiLabel>
      </div>
    `,
  }),
};

export const LineClampDynamic: Story = {
  args: {
    type: "bodyS",
    wrapText: true,
    wrapMaxLines: 8,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-md border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [wrapText]="wrapText"
          [wrapMaxLines]="wrapMaxLines"
        ></UiLabel>
      </div>
    `,
  }),
};

const LONG_TEXT_FOR_TOOLTIP =
  "Este texto es intencionalmente largo para que desborde el contenedor padre y dispare el tooltip con el contenido completo al hacer hover.";

export const WithTooltipOnOverflow: Story = {
  args: {
    type: "bodyS",
    text: LONG_TEXT_FOR_TOOLTIP,
    tooltipSide: "top",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-50 border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></UiLabel>
      </div>
    `,
  }),
};

export const WithTooltipClamped: Story = {
  args: {
    type: "bodyS",
    wrapText: true,
    wrapMaxLines: 2,
    text:
      "Texto largo con line-clamp a 2 líneas. Al hacer hover se muestra el Tooltip con el contenido íntegro porque el texto está siendo truncado y cumple la condición de overflow + wrapMaxLines.",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [wrapText]="wrapText"
          [wrapMaxLines]="wrapMaxLines"
        ></UiLabel>
      </div>
    `,
  }),
};

export const AssociatedWithInput: Story = {
  args: { for: "email", type: "bodyS", weight: "medium" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4 space-y-2 max-w-sm">
        <UiLabel [for]="for" [type]="type" [weight]="weight" color="textStrong">
          Email
          <span class="text-error-500">*</span>
        </UiLabel>
        <input
          id="{{ for }}"
          type="email"
          required
          class="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
    `,
  }),
};

export const WithThemeSwitch: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col items-start gap-6 p-6">
        <CommonThemeToggle variant="subtle" size="md"></CommonThemeToggle>

        <div class="space-y-2 w-full max-w-md">
          <UiLabel color="textStrong" text="Strong text"></UiLabel>
          <UiLabel color="textWeak" text="Weak text"></UiLabel>
          <UiLabel color="textWeakest" text="Weakest text"></UiLabel>
          <UiLabel color="textAction" text="Action / brand text"></UiLabel>
          <UiLabel color="textError" text="Error text"></UiLabel>
          <UiLabel color="textSuccess" text="Success text"></UiLabel>
          <UiLabel color="textWarning" text="Warning text"></UiLabel>
        </div>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg space-y-3">
        <UiLabel color="textStrong" text="Strong text"></UiLabel>
        <UiLabel color="textWeak" text="Weak text"></UiLabel>
        <UiLabel color="textWeakest" text="Weakest text"></UiLabel>
        <UiLabel color="textAction" text="Action / brand text"></UiLabel>
        <UiLabel color="textError" text="Error text"></UiLabel>
        <UiLabel color="textSuccess" text="Success text"></UiLabel>
        <UiLabel color="textWarning" text="Warning text"></UiLabel>
      </div>
    `,
  }),
};

// Responsive — el line-clamp + tooltip deben disparar antes en mobile
export const Responsive: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
  render: () => ({
    template: `
      <div class="p-4 space-y-4 max-w-sm">
        <UiLabel
          type="bodyS"
          wrapText="true"
          wrapMaxLines="2"
          text="Texto largo en mobile: el contenedor angosto fuerza el line-clamp a 2 líneas antes, y al hacer hover se muestra el tooltip con el contenido completo."
        ></UiLabel>
        <UiLabel
          type="bodyS"
          text="Este texto no debe hacer wrap porque wrapText es false; en mobile simplemente se recorta con ellipsis hasta el ancho disponible."
        ></UiLabel>
      </div>
    `,
  }),
};
