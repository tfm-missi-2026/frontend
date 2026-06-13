// label.stories.ts — Label del design system

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { LabelComponent } from '@ui/label/label';
import { TooltipComponent } from '@ui/tooltip/tooltip';
import { ColorType } from '@styles/types/colors';
import { FontWeightType, TypographyType } from '@styles/types/typography';

const typographyTypes: TypographyType[] = [
  'bodyXxs',
  'bodyXs',
  'bodyS',
  'HeadingXs',
  'HeadingS',
  'HeadingM',
  'HeadingL',
  'HeadingXl',
  'HeadingXxl',
  'HeadingTV',
];

const fontWeights: FontWeightType[] = ['regular', 'medium', 'semibold', 'bold'];

const colors: ColorType[] = [
  'textStrong',
  'textWeak',
  'textWeakest',
  'textDisabled',
  'textAction',
  'textActionStrong',
  'textError',
  'textSuccess',
  'textWarning',
];

const meta: Meta<LabelComponent> = {
  title: 'Shared/Label',
  component: LabelComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, LabelComponent, TooltipComponent],
    }),
  ],
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    as: {
      control: 'select',
      options: ['small', 'span', 'p', 'strong'],
    },
    for: { control: 'text' },
    text: { control: 'text' },
    type: {
      control: 'select',
      options: typographyTypes,
    },
    weight: {
      control: 'select',
      options: [...fontWeights, null],
    },
    color: {
      control: 'select',
      options: [...colors, null],
    },
    wrapText: { control: 'boolean' },
    wrapMaxLines: { control: { type: 'number', min: 1, max: 6 } },
    availableSpaceOffset: { control: { type: 'number', min: 0 } },
    italic: { control: 'boolean' },
    refreshOnLoad: { control: 'boolean' },
    align: {
      control: 'select',
      options: ['left', 'right', 'center', 'justify', null],
    },
    className: { control: 'text' },
    tooltipSide: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  args: {
    text: 'The quick brown fox jumps over the lazy dog',
    type: 'bodyXs',
    wrapText: false,
  },
};

export default meta;

type Story = StoryObj<LabelComponent>;

// ---------------------------------------------------------------------------
// Tipografía
// ---------------------------------------------------------------------------

export const TypographyTypes: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        @for (t of types; track t) {
          <div class="flex items-baseline gap-4">
            <span class="w-32 text-xs text-gray-500">{{ t }}</span>
            <Label [type]="t" [text]="'The quick brown fox'" ></Label>
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
        <Label type="HeadingTV" text="Heading TV" ></Label>
        <Label type="HeadingXxl" text="Heading XXL" ></Label>
        <Label type="HeadingXl" text="Heading XL" ></Label>
        <Label type="HeadingL" text="Heading L" ></Label>
        <Label type="HeadingM" text="Heading M" ></Label>
        <Label type="HeadingS" text="Heading S" ></Label>
        <Label type="HeadingXs" text="Heading XS" ></Label>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Pesos
// ---------------------------------------------------------------------------

export const FontWeights: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        @for (w of weights; track w) {
          <div class="flex items-baseline gap-4">
            <span class="w-24 text-xs text-gray-500">{{ w }}</span>
            <Label type="HeadingM" [weight]="w" text="The quick brown fox" ></Label>
          </div>
        }
      </div>
    `,
    props: { weights: fontWeights },
  }),
};

// ---------------------------------------------------------------------------
// Colores
// ---------------------------------------------------------------------------

export const Colors: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        @for (c of colors; track c) {
          <div class="flex items-baseline gap-4">
            <span class="w-32 text-xs text-gray-500">{{ c }}</span>
            <Label [color]="c" text="The quick brown fox" ></Label>
          </div>
        }
      </div>
    `,
    props: { colors },
  }),
};

// ---------------------------------------------------------------------------
// Estilo
// ---------------------------------------------------------------------------

export const Italic: Story = {
  args: { italic: true, text: 'Italic text' },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6">
        <Label [text]="text" [italic]="italic" ></Label>
      </div>
    `,
  }),
};

export const Alignment: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3 max-w-md border rounded-lg">
        <Label align="left" text="Left aligned" ></Label>
        <Label align="center" text="Center aligned" ></Label>
        <Label align="right" text="Right aligned" ></Label>
        <Label align="justify" text="Justified text spans multiple lines so you can see how the spacing is distributed between words when justify is applied." ></Label>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Wrap / line-clamp
// ---------------------------------------------------------------------------

export const NoWrap: Story = {
  args: {
    type: 'bodyS',
    text: 'Texto muy largo que no debería hacer wrap porque wrapText está en false. Si no cabe, se recorta con ellipsis.',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [wrapText]="false"
        ></Label>
      </div>
    `,
  }),
};

export const WrapMultiLine: Story = {
  args: {
    type: 'bodyS',
    text: 'Este texto sí hace wrap porque wrapText es true. Verás cómo se ajusta a varias líneas respetando el ancho del contenedor padre.',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [wrapText]="true"
        ></Label>
      </div>
    `,
  }),
};

export const LineClamp: Story = {
  args: {
    type: 'bodyS',
    wrapText: true,
    wrapMaxLines: 2,
    text: 'Este es un texto largo que será recortado a 2 líneas gracias a webkit-line-clamp. Aunque haya más contenido, el overflow se oculta y se muestra ellipsis al final de la segunda línea.',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [wrapText]="wrapText"
          [wrapMaxLines]="wrapMaxLines"
        ></Label>
      </div>
    `,
  }),
};

export const LineClamp3: Story = {
  args: {
    type: 'bodyS',
    wrapText: true,
    wrapMaxLines: 3,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-md border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [wrapText]="wrapText"
          [wrapMaxLines]="wrapMaxLines"
        ></Label>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Overflow → Tooltip
// ---------------------------------------------------------------------------

const LONG_TEXT_FOR_TOOLTIP =
  'Este texto es intencionalmente largo para que desborde el contenedor padre y dispare el tooltip con el contenido completo al hacer hover.';

export const WithTooltipOnOverflow: Story = {
  args: {
    type: 'bodyS',
    text: LONG_TEXT_FOR_TOOLTIP,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-50 border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [tooltipSide]="'top'"
        ></Label>
      </div>
    `,
  }),
};

export const WithTooltipClamped: Story = {
  args: {
    type: 'bodyS',
    wrapText: true,
    wrapMaxLines: 2,
    text: 'Texto largo con line-clamp a 2 líneas. Al hacer hover se muestra el Tooltip con el contenido íntegro porque el texto está siendo truncado y cumple la condición de overflow + wrapMaxLines.',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-xs border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [wrapText]="wrapText"
          [wrapMaxLines]="wrapMaxLines"
        ></Label>
      </div>
    `,
  }),
};

export const WithTooltipTop: Story = {
  args: { type: 'bodyS', text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: 'top' },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 max-w-50 border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></Label>
      </div>
    `,
  }),
};

export const WithTooltipRight: Story = {
  args: { type: 'bodyS', text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: 'right' },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 max-w-50 border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></Label>
      </div>
    `,
  }),
};

export const WithTooltipBottom: Story = {
  args: { type: 'bodyS', text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: 'bottom' },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 max-w-50 border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></Label>
      </div>
    `,
  }),
};

export const WithTooltipLeft: Story = {
  args: { type: 'bodyS', text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: 'left' },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 max-w-50 border rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
        ></Label>
      </div>
    `,
  }),
};

export const WithTooltipAllSides: Story = {
  render: () => ({
    template: `
      <div class="grid h-80 grid-cols-3 grid-rows-3 items-center justify-items-center gap-4 p-6">
        <div></div>
        <Label
          type="bodyS"
          text="${LONG_TEXT_FOR_TOOLTIP}"
          tooltipSide="top"
        ></Label>
        <div></div>

        <Label
          type="bodyS"
          text="${LONG_TEXT_FOR_TOOLTIP}"
          tooltipSide="left"
        ></Label>
        <div class="text-xs text-gray-500">center</div>
        <Label
          type="bodyS"
          text="${LONG_TEXT_FOR_TOOLTIP}"
          tooltipSide="right"
        ></Label>

        <div></div>
        <Label
          type="bodyS"
          text="${LONG_TEXT_FOR_TOOLTIP}"
          tooltipSide="bottom"
        ></Label>
        <div></div>
      </div>
    `,
  }),
};

export const WithTooltipDark: Story = {
  args: { type: 'bodyS', text: LONG_TEXT_FOR_TOOLTIP, tooltipSide: 'top' },
  render: (args) => ({
    props: args,
    template: `
      <div class="dark bg-gray-900 p-12 max-w-50 rounded-lg">
        <Label
          [text]="text"
          [type]="type"
          [tooltipSide]="tooltipSide"
          color="textStrong"
        ></Label>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Required / dark / as
// ---------------------------------------------------------------------------

export const RequiredField: Story = {
  args: { for: 'email', type: 'bodyS', weight: 'medium' },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4 space-y-2 max-w-sm">
        <Label [for]="for" [type]="type" [weight]="weight" [color]="'textStrong'">
          Email
          <span class="text-error-500">*</span>
        </Label>
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

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg space-y-3">
        <Label color="textStrong" text="Strong text" ></Label>
        <Label color="textWeak" text="Weak text" ></Label>
        <Label color="textWeakest" text="Weakest text" ></Label>
        <Label color="textAction" text="Action / brand text" ></Label>
        <Label color="textError" text="Error text" ></Label>
        <Label color="textSuccess" text="Success text" ></Label>
        <Label color="textWarning" text="Warning text" ></Label>
      </div>
    `,
  }),
};

export const AsOverride: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-2">
        <Label as="span" type="bodyXs" text="Rendered as span" ></Label>
        <Label as="p" type="bodyXs" text="Rendered as paragraph" ></Label>
        <Label as="small" type="bodyXs" text="Rendered as small" ></Label>
        <Label as="strong" type="bodyXs" text="Rendered as strong" ></Label>
      </div>
    `,
  }),
};
