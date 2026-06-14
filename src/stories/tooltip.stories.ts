import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { UiTooltipComponent } from '@ui/tooltip/tooltip';
import {
  TooltipVariantType,
  TooltipSide,
  TooltipAlign,
} from '@ui/tooltip/tooltip.types';

const variants: TooltipVariantType[] = [
  'light',
  'dark',
  'info',
  'success',
  'warning',
  'error',
];

const sides: TooltipSide[] = ['top', 'right', 'bottom', 'left'];
const aligns: TooltipAlign[] = ['start', 'center', 'end'];

const meta: Meta<UiTooltipComponent> = {
  title: 'Shared/Tooltip',
  component: UiTooltipComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, UiTooltipComponent],
    }),
  ],
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    content: { control: 'text' },
    variant: { control: 'select', options: variants },
    side: { control: 'select', options: sides },
    sideOffset: { control: { type: 'number', min: 0, max: 32 } },
    align: { control: 'select', options: aligns },
    delayDuration: { control: { type: 'number', min: 0, max: 3000, step: 50 } },
    closeDelay: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
    className: { control: 'text' },
  },
  args: {
    content: 'Texto del tooltip',
    variant: 'light',
    side: 'bottom',
    sideOffset: 8,
    align: 'center',
    delayDuration: 200,
  },
};

export default meta;

type Story = StoryObj<UiTooltipComponent>;

// Helpers
const trigger = (label = 'Hover me') => `<button type="button" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">${label}</button>`;

// Default
export const Default: Story = {
  args: {
    content: 'Tooltip por defecto (variant="light", side="bottom")',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-40 items-center justify-center">
        <UiTooltip
          [content]="content"
          [variant]="variant"
          [side]="side"
          [sideOffset]="sideOffset"
          [align]="align"
          [delayDuration]="delayDuration"
          [className]="className"
        >
          ${trigger()}
        </UiTooltip>
      </div>
    `,
  }),
};

// Variantes
export const Dark: Story = {
  args: { variant: 'dark', content: 'Tooltip dark con texto blanco' },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-40 items-center justify-center">
        <UiTooltip [content]="content" [variant]="variant">
          ${trigger('Hover (dark)')}
        </UiTooltip>
      </div>
    `,
  }),
};

export const Info: Story = {
  args: { variant: 'info', content: 'Información adicional para el usuario' },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-40 items-center justify-center">
        <UiTooltip [content]="content" [variant]="variant">
          ${trigger('Hover (info)')}
        </UiTooltip>
      </div>
    `,
  }),
};

export const Success: Story = {
  args: { variant: 'success', content: 'Acción completada con éxito' },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-40 items-center justify-center">
        <UiTooltip [content]="content" [variant]="variant">
          ${trigger('Hover (success)')}
        </UiTooltip>
      </div>
    `,
  }),
};

export const Warning: Story = {
  args: { variant: 'warning', content: 'Atención: revisa los datos antes de continuar' },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-40 items-center justify-center">
        <UiTooltip [content]="content" [variant]="variant">
          ${trigger('Hover (warning)')}
        </UiTooltip>
      </div>
    `,
  }),
};

export const Error: Story = {
  args: { variant: 'error', content: 'No se pudo guardar el formulario' },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-40 items-center justify-center">
        <UiTooltip [content]="content" [variant]="variant">
          ${trigger('Hover (error)')}
        </UiTooltip>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-6 p-6">
        <UiTooltip variant="light" content="Variant light">${trigger('light')}</UiTooltip>
        <UiTooltip variant="dark" content="Variant dark">${trigger('dark')}</UiTooltip>
        <UiTooltip variant="info" content="Variant info">${trigger('info')}</UiTooltip>
        <UiTooltip variant="success" content="Variant success">${trigger('success')}</UiTooltip>
        <UiTooltip variant="warning" content="Variant warning">${trigger('warning')}</UiTooltip>
        <UiTooltip variant="error" content="Variant error">${trigger('error')}</UiTooltip>
      </div>
    `,
  }),
};

// Lados
export const AllSides: Story = {
  render: () => ({
    template: `
      <div class="grid h-72 grid-cols-3 grid-rows-3 items-center justify-items-center gap-4 p-6">
        <div></div>
        <UiTooltip side="top" content="Aparece desde arriba (slide-down + fade)">
          ${trigger('top')}
        </UiTooltip>
        <div></div>

        <UiTooltip side="left" content="Aparece desde la izquierda (slide-right + fade)">
          ${trigger('left')}
        </UiTooltip>
        <div class="text-xs text-gray-500">center</div>
        <UiTooltip side="right" content="Aparece desde la derecha (slide-left + fade)">
          ${trigger('right')}
        </UiTooltip>

        <div></div>
        <UiTooltip side="bottom" content="Aparece desde abajo (slide-up + fade)">
          ${trigger('bottom')}
        </UiTooltip>
        <div></div>
      </div>
    `,
  }),
};

// Delay
export const WithDelay: Story = {
  args: { delayDuration: 1000, content: 'Aparece 1s después del hover' },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-40 items-center justify-center">
        <UiTooltip
          [content]="content"
          [variant]="variant"
          [delayDuration]="delayDuration"
        >
          ${trigger('Hover y espera')}
        </UiTooltip>
      </div>
    `,
  }),
};

// Contenido largo
export const WithLongContent: Story = {
  args: {
    content:
      'Este tooltip contiene un texto largo que demuestra que el contenido puede hacer wrap correctamente respetando el max-width definido por el componente (500px en desktop, 50vw en móvil).',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex h-40 items-center justify-center">
        <UiTooltip [content]="content" [variant]="variant">
          ${trigger('Hover para ver el wrap')}
        </UiTooltip>
      </div>
    `,
  }),
};

// Alineación
export const Alignment: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col items-start gap-8 p-6">
        <UiTooltip align="start" content="Alineado al inicio del trigger">
          ${trigger('align="start"')}
        </UiTooltip>
        <UiTooltip align="center" content="Centrado respecto al trigger">
          ${trigger('align="center"')}
        </UiTooltip>
        <UiTooltip align="end" content="Alineado al final del trigger">
          ${trigger('align="end"')}
        </UiTooltip>
      </div>
    `,
  }),
};

// Dark mode
export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark bg-gray-900 rounded-lg p-6">
        <div class="grid grid-cols-3 gap-4">
          <UiTooltip variant="light" content="Variant light">
            ${trigger('light')}
          </UiTooltip>
          <UiTooltip variant="dark" content="Variant dark">
            ${trigger('dark')}
          </UiTooltip>
          <UiTooltip variant="info" content="Variant info">
            ${trigger('info')}
          </UiTooltip>
          <UiTooltip variant="success" content="Variant success">
            ${trigger('success')}
          </UiTooltip>
          <UiTooltip variant="warning" content="Variant warning">
            ${trigger('warning')}
          </UiTooltip>
          <UiTooltip variant="error" content="Variant error">
            ${trigger('error')}
          </UiTooltip>
        </div>
      </div>
    `,
  }),
};
