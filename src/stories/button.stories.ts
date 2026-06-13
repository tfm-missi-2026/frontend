// button.stories.ts — Button del design system

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ButtonComponent } from '@ui/button/button';
import { TooltipComponent } from '@ui/tooltip/tooltip';
import { IconProps } from '@ui/icon/icon.interface';

// ---------------------------------------------------------------------------
// Iconos stub (solo para Storybook — los íconos reales del DS se crean aparte).
// Cada stub respeta `IconProps` y renderiza un SVG simple.
// ---------------------------------------------------------------------------

@Component({
  selector: 'FloppyDiskIconLight',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth"
      [attr.height]="computedHeight"
      viewBox="0 0 16 16"
      fill="currentColor"
      [style.color]="color"
      style="display: inline-block; flex-shrink: 0;"
    >
      <path d="M3 1h8l4 4v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm6 1H3v3h6V2Zm0 5H5v6h4V7Z" />
    </svg>
  `,
})
class FloppyDiskIconLightStubComponent implements IconProps {
  @Input() size: number | string = 16;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() color = 'currentColor';
  @Input() className?: string;
  @Input() dataTestId?: string;
  get computedWidth() {
    return this.width ?? this.size;
  }
  get computedHeight() {
    return this.height ?? this.size;
  }
}

@Component({
  selector: 'UploadIconLight',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="computedWidth"
      [attr.height]="computedHeight"
      viewBox="0 0 16 16"
      fill="currentColor"
      [style.color]="color"
      style="display: inline-block; flex-shrink: 0;"
    >
      <path d="M8 1l4 4h-3v6H7V5H4l4-4Zm-6 12h12v2H2v-2Z" />
    </svg>
  `,
})
class UploadIconLightStubComponent implements IconProps {
  @Input() size: number | string = 16;
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() color = 'currentColor';
  @Input() className?: string;
  @Input() dataTestId?: string;
  get computedWidth() {
    return this.width ?? this.size;
  }
  get computedHeight() {
    return this.height ?? this.size;
  }
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<ButtonComponent> = {
  title: 'Shared/Button',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ButtonComponent,
        TooltipComponent,
        FloppyDiskIconLightStubComponent,
        UploadIconLightStubComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    styleType: {
      control: 'select',
      options: ['default', 'danger', 'monochrome', 'warning', 'success'],
    },
    compact: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    transparent: { control: 'boolean' },
    disabled: { control: 'boolean' },
    isSubmit: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    fontSize: {
      control: 'select',
      options: [
        'bodyXxs',
        'bodyXs',
        'bodyS',
        'HeadingXs',
        'HeadingS',
        'HeadingM',
        'HeadingL',
      ],
    },
    tooltip: { control: 'text' },
    tooltipSide: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    tooltipVariant: {
      control: 'select',
      options: ['light', 'dark', 'info', 'success', 'warning', 'error'],
    },
    labelText: { control: 'text' },
    timeout: { control: { type: 'number', min: 0 } },
    disableOnTimeout: { control: 'boolean' },
    label: { control: 'text' },
    className: { control: 'text' },
    click: { action: 'clicked' },
  },
  args: {
    variant: 'primary',
    styleType: 'default',
    compact: false,
    fullWidth: false,
    transparent: false,
    disabled: false,
    isSubmit: false,
    isLoading: false,
    fontSize: 'bodyS',
    label: 'Button',
  },
};

export default meta;

type Story = StoryObj<ButtonComponent>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <Button
          [variant]="variant"
          [styleType]="styleType"
          [compact]="compact"
          [fullWidth]="fullWidth"
          [transparent]="transparent"
          [disabled]="disabled"
          [isSubmit]="isSubmit"
          [isLoading]="isLoading"
          [fontSize]="fontSize"
          [label]="label"
          [tooltip]="tooltip"
          [tooltipSide]="tooltipSide"
          [tooltipVariant]="tooltipVariant"
          [labelText]="labelText"
          [timeout]="timeout"
          [disableOnTimeout]="disableOnTimeout"
          [className]="className"
          (click)="click($event)"
        ></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Variants × StyleTypes (15 combinaciones)
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 p-4">
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Primary</h3>
          <div class="flex flex-wrap gap-2">
            <Button variant="primary" styleType="default" label="Default"></Button>
            <Button variant="primary" styleType="danger" label="Danger"></Button>
            <Button variant="primary" styleType="monochrome" label="Monochrome"></Button>
            <Button variant="primary" styleType="warning" label="Warning"></Button>
            <Button variant="primary" styleType="success" label="Success"></Button>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Secondary</h3>
          <div class="flex flex-wrap gap-2">
            <Button variant="secondary" styleType="default" label="Default"></Button>
            <Button variant="secondary" styleType="danger" label="Danger"></Button>
            <Button variant="secondary" styleType="monochrome" label="Monochrome"></Button>
            <Button variant="secondary" styleType="warning" label="Warning"></Button>
            <Button variant="secondary" styleType="success" label="Success"></Button>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Tertiary</h3>
          <div class="flex flex-wrap gap-2">
            <Button variant="tertiary" styleType="default" label="Default"></Button>
            <Button variant="tertiary" styleType="danger" label="Danger"></Button>
            <Button variant="tertiary" styleType="monochrome" label="Monochrome"></Button>
            <Button variant="tertiary" styleType="warning" label="Warning"></Button>
            <Button variant="tertiary" styleType="success" label="Success"></Button>
          </div>
        </div>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Compact
// ---------------------------------------------------------------------------

export const Compact: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <Button variant="primary" compact="true" label="Compact"></Button>
        <Button variant="primary" label="Normal"></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Disabled
// ---------------------------------------------------------------------------

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2 p-4">
        <Button disabled="true" label="Primary disabled"></Button>
        <Button variant="secondary" disabled="true" label="Secondary disabled"></Button>
        <Button variant="tertiary" disabled="true" label="Tertiary disabled"></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

export const Loading: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2 p-4">
        <Button isLoading="true" label="Primary loading"></Button>
        <Button variant="secondary" isLoading="true" label="Secondary loading"></Button>
        <Button variant="tertiary" isLoading="true" label="Tertiary loading"></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// With timeout (progress bar)
// ---------------------------------------------------------------------------

export const WithTimeout: Story = {
  args: {
    variant: 'primary',
    timeout: 5000,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <Button
          [variant]="variant"
          [label]="label"
          [timeout]="timeout"
          (click)="click($event)"
        ></Button>
      </div>
    `,
  }),
};

export const WithTimeoutEnabledInteraction: Story = {
  args: {
    variant: 'primary',
    timeout: 5000,
    disableOnTimeout: false,
    label: 'Clickable during timeout',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <Button
          [variant]="variant"
          [label]="label"
          [timeout]="timeout"
          [disableOnTimeout]="disableOnTimeout"
          (click)="click($event)"
        ></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// With icons (Angular component classes)
// ---------------------------------------------------------------------------

export const WithLeftIcon: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2 p-4">
        <Button
          variant="primary"
          [LeftIcon]="floppy"
          label="Grabar"
        ></Button>
        <Button
          variant="secondary"
          [LeftIcon]="floppy"
          label="Save"
        ></Button>
      </div>
    `,
    props: { floppy: FloppyDiskIconLightStubComponent },
  }),
};

export const WithRightIcon: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2 p-4">
        <Button
          variant="primary"
          [RightIcon]="upload"
          label="Upload"
        ></Button>
      </div>
    `,
    props: { upload: UploadIconLightStubComponent },
  }),
};

export const WithBothIcons: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2 p-4">
        <Button
          variant="primary"
          [LeftIcon]="floppy"
          [RightIcon]="upload"
          label="Save & upload"
        ></Button>
      </div>
    `,
    props: {
      floppy: FloppyDiskIconLightStubComponent,
      upload: UploadIconLightStubComponent,
    },
  }),
};

// ---------------------------------------------------------------------------
// Sizes (fontSize)
// ---------------------------------------------------------------------------

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <Button fontSize="bodyXxs" label="bodyXxs"></Button>
        <Button fontSize="bodyXs" label="bodyXs"></Button>
        <Button fontSize="bodyS" label="bodyS"></Button>
        <Button fontSize="HeadingXs" label="HeadingXs"></Button>
        <Button fontSize="HeadingM" label="HeadingM"></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Full width
// ---------------------------------------------------------------------------

export const FullWidth: Story = {
  render: () => ({
    template: `
      <div class="w-full max-w-sm p-4 space-y-2">
        <Button fullWidth="true" label="Full width primary"></Button>
        <Button variant="secondary" fullWidth="true" label="Full width secondary"></Button>
        <Button variant="tertiary" fullWidth="true" label="Full width tertiary"></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Transparent
// ---------------------------------------------------------------------------

export const Transparent: Story = {
  render: () => ({
    template: `
      <div class="p-4 bg-gray-100 rounded-lg flex gap-2">
        <Button variant="secondary" transparent="true" label="Secondary transparent"></Button>
        <Button variant="tertiary" transparent="true" label="Tertiary transparent"></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// As link
// ---------------------------------------------------------------------------

export const AsLink: Story = {
  render: () => ({
    template: `
      <div class="p-4">
        <Button
          [asLink]="true"
          [linkProps]="{ href: 'https://angular.dev', target: '_blank' }"
          label="Abrir Angular"
        ></Button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export const WithTooltip: Story = {
  args: { tooltip: 'Guardar los cambios del formulario' },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 flex items-center justify-center">
        <Button
          [tooltip]="tooltip"
          [tooltipSide]="tooltipSide"
          label="Hover me"
        ></Button>
      </div>
    `,
  }),
};

export const WithTooltipOnDisabled: Story = {
  args: { tooltip: 'No puedes continuar hasta completar el paso anterior' },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-12 flex items-center justify-center">
        <Button
          [tooltip]="tooltip"
          [disabled]="true"
          label="Disabled con tooltip"
        ></Button>
      </div>
    `,
  }),
};

export const TooltipFlip: Story = {
  render: () => ({
    template: `
      <div class="space-y-16 p-6">
        <p class="text-xs text-gray-500">
          El tooltip se auto-posiciona con Floating UI. Si el lado preferido
          no cabe en el viewport, salta al siguiente con espacio disponible.
        </p>
        <div class="flex flex-col gap-2">
          <span class="text-xs text-gray-500">tooltipSide="top" — con espacio arriba</span>
          <div class="flex justify-center pt-12">
            <Button tooltip="Tooltip arriba" tooltipSide="top" label="Hover me"></Button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs text-gray-500">tooltipSide="right" (default) — con espacio a la derecha</span>
          <div class="flex justify-start">
            <Button tooltip="Tooltip a la derecha" label="Hover me"></Button>
          </div>
        </div>
      </div>
    `,
  }),
};

export const TooltipAllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-6 p-12">
        <Button variant="primary" tooltip="Tooltip en botón primary" label="Primary"></Button>
        <Button variant="secondary" tooltip="Tooltip en botón secondary" label="Secondary"></Button>
        <Button variant="tertiary" tooltip="Tooltip en botón tertiary" label="Tertiary"></Button>
        <Button variant="primary" [disabled]="true" tooltip="Disabled también muestra tooltip" label="Disabled"></Button>
      </div>
    `,
  }),
};
