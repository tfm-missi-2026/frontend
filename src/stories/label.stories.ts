import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { UiLabelComponent } from "@shared/ui/label/label";
import { UiTooltipComponent } from "@shared/ui/tooltip/tooltip";
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
      imports: [CommonModule, UiLabelComponent, UiTooltipComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    as: {
      control: "select",
      options: ["small", "span", "p", "strong"],
    },
    for: { control: "text" },
    text: { control: "text" },
    type: {
      control: "select",
      options: typographyTypes,
    },
    weight: {
      control: "select",
      options: [...fontWeights, null],
    },
    color: {
      control: "select",
      options: [...colors, null],
    },
    wrapText: { control: "boolean" },
    wrapMaxLines: { control: { type: "number", min: 1, max: 6 } },
    availableSpaceOffset: { control: { type: "number", min: 0 } },
    italic: { control: "boolean" },
    refreshOnLoad: { control: "boolean" },
    align: {
      control: "select",
      options: ["left", "right", "center", "justify", null],
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

// Tipografía
export const TypographyTypes: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        @for (t of types; track t) {
          <div class="flex items-baseline gap-4">
            <span class="w-32 text-xs text-gray-500">{{ t }}</span>
            <UiLabel [type]="t" [text]="'The quick brown fox'" ></UiLabel>
          </div>
        }
      </div>
    `,
    props: { types: typographyTypes },
  }),
};

export const Headings: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        <UiLabel type="HeadingTV" text="Heading TV" ></UiLabel>
        <UiLabel type="HeadingXxl" text="Heading XXL" ></UiLabel>
        <UiLabel type="HeadingXl" text="Heading XL" ></UiLabel>
        <UiLabel type="HeadingL" text="Heading L" ></UiLabel>
        <UiLabel type="HeadingM" text="Heading M" ></UiLabel>
        <UiLabel type="HeadingS" text="Heading S" ></UiLabel>
        <UiLabel type="HeadingXs" text="Heading XS" ></UiLabel>
      </div>
    `,
  }),
};

// Pesos
export const FontWeights: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        @for (w of weights; track w) {
          <div class="flex items-baseline gap-4">
            <span class="w-24 text-xs text-gray-500">{{ w }}</span>
            <UiLabel type="HeadingM" [weight]="w" text="The quick brown fox" ></UiLabel>
          </div>
        }
      </div>
    `,
    props: { weights: fontWeights },
  }),
};

// Colores
export const Colors: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        @for (c of colors; track c) {
          <div class="flex items-baseline gap-4">
            <span class="w-32 text-xs text-gray-500">{{ c }}</span>
            <UiLabel [color]="c" text="The quick brown fox" ></UiLabel>
          </div>
        }
      </div>
    `,
    props: { colors },
  }),
};

// Estilos
export const Italic: Story = {
  args: { italic: true, text: "Italic text" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6">
        <UiLabel [text]="text" [italic]="italic" ></UiLabel>
      </div>
    `,
  }),
};

export const Alignment: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3 max-w-md border rounded-lg">
        <UiLabel align="left" text="Left aligned" ></UiLabel>
        <UiLabel align="center" text="Center aligned" ></UiLabel>
        <UiLabel align="right" text="Right aligned" ></UiLabel>
        <UiLabel align="justify" text="Justified text spans multiple lines so you can see how the spacing is distributed between words when justify is applied." ></UiLabel>
      </div>
    `,
  }),
};

// Wrap
export const NoWrap: Story = {
  args: {
    type: "bodyS",
    text: "Texto muy largo que no debería hacer wrap porque wrapText está en false. Si no cabe, se recorta con ellipsis.",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [wrapText]="false"
        ></UiLabel>
      </div>
    `,
  }),
};

export const WrapMultiLine: Story = {
  args: {
    type: "bodyS",
    text: "Este texto sí hace wrap porque wrapText es true. Verás cómo se ajusta a varias líneas respetando el ancho del contenedor padre.",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [wrapText]="true"
        ></UiLabel>
      </div>
    `,
  }),
};

export const LineClamp: Story = {
  args: {
    type: "bodyS",
    wrapText: true,
    wrapMaxLines: 2,
    text: "Este es un texto largo que será recortado a 2 líneas gracias a webkit-line-clamp. Aunque haya más contenido, el overflow se oculta y se muestra ellipsis al final de la segunda línea.",
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
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
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

// Tooltip
export const WithTooltipOnOverflow: Story = {
  args: {
    type: "bodyS",
    text: LONG_TEXT_FOR_TOOLTIP,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-50 border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [tooltipSide]="'top'"
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
    text: "Texto largo con line-clamp a 2 líneas. Al hacer hover se muestra el Tooltip con el contenido íntegro porque el texto está siendo truncado y cumple la condición de overflow + wrapMaxLines.",
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

export const WithTooltipTop: Story = {
  args: { type: "bodyS", text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: "top" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 max-w-50 border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></UiLabel>
      </div>
    `,
  }),
};

export const WithTooltipRight: Story = {
  args: { type: "bodyS", text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: "right" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 max-w-50 border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></UiLabel>
      </div>
    `,
  }),
};

export const WithTooltipBottom: Story = {
  args: { type: "bodyS", text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: "bottom" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 max-w-50 border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></UiLabel>
      </div>
    `,
  }),
};

export const WithTooltipLeft: Story = {
  args: { type: "bodyS", text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: "left" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 max-w-50 border rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></UiLabel>
      </div>
    `,
  }),
};

export const WithTooltipAllSides: Story = {
  render: () => ({
    template: `
      <div class="grid h-80 grid-cols-3 grid-rows-3 items-center justify-items-center gap-4 p-6">
        <div></div>
        <UiLabel
          type="bodyS"
          text="${LONG_TEXT_FOR_TOOLTIP}"
          tooltipSide="top"
        ></UiLabel>
        <div></div>

        <UiLabel
          type="bodyS"
          text="${LONG_TEXT_FOR_TOOLTIP}"
          tooltipSide="left"
        ></UiLabel>
        <div class="text-xs text-gray-500">center</div>
        <UiLabel
          type="bodyS"
          text="${LONG_TEXT_FOR_TOOLTIP}"
          tooltipSide="right"
        ></UiLabel>

        <div></div>
        <UiLabel
          type="bodyS"
          text="${LONG_TEXT_FOR_TOOLTIP}"
          tooltipSide="bottom"
        ></UiLabel>
        <div></div>
      </div>
    `,
  }),
};

export const WithTooltipDark: Story = {
  args: { type: "bodyS", text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: "top" },
  render: (args) => ({
    props: args,
    template: `
      <div class="dark bg-gray-900 p-12 max-w-50 rounded-lg">
        <UiLabel
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
          color="textStrong"
        ></UiLabel>
      </div>
    `,
  }),
};

// Requerido
export const RequiredField: Story = {
  args: { for: "email", type: "bodyS", weight: "medium" },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4 space-y-2 max-w-sm">
        <UiLabel [for]="for" [type]="type" [weight]="weight" [color]="'textStrong'">
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

// Dark mode
export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg space-y-3">
        <UiLabel color="textStrong" text="Strong text" ></UiLabel>
        <UiLabel color="textWeak" text="Weak text" ></UiLabel>
        <UiLabel color="textWeakest" text="Weakest text" ></UiLabel>
        <UiLabel color="textAction" text="Action / brand text" ></UiLabel>
        <UiLabel color="textError" text="Error text" ></UiLabel>
        <UiLabel color="textSuccess" text="Success text" ></UiLabel>
        <UiLabel color="textWarning" text="Warning text" ></UiLabel>
      </div>
    `,
  }),
};

// As override
export const AsOverride: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        <UiLabel as="span" type="bodyXs" text="Rendered as span" ></UiLabel>
        <UiLabel as="p" type="bodyXs" text="Rendered as paragraph" ></UiLabel>
        <UiLabel as="small" type="bodyXs" text="Rendered as small" ></UiLabel>
        <UiLabel as="strong" type="bodyXs" text="Rendered as strong" ></UiLabel>
      </div>
    `,
  }),
};
