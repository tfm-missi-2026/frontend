// icon-button.stories.ts — IconButton del design system

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { IconButtonComponent } from '@ui/icon-button/icon-button';
import { TooltipComponent } from '@ui/tooltip/tooltip';
import { IconProps } from '@ui/icon/icon.interface';

// ---------------------------------------------------------------------------
// Icon stub (replica del usado en button.stories)
// ---------------------------------------------------------------------------

@Component({
  selector: 'InfoIcon',
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
      <path
        d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12Zm-1-2h2v-5H7v5Zm1-6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  `,
})
class InfoIconStubComponent implements IconProps {
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

const meta: Meta<IconButtonComponent> = {
  title: 'Shared/IconButton',
  component: IconButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, IconButtonComponent, TooltipComponent, InfoIconStubComponent],
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
    transparent: { control: 'boolean' },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    fontSize: {
      control: 'select',
      options: ['bodyXxs', 'bodyXs', 'bodyS'],
    },
    tooltip: { control: 'text' },
    tooltipSide: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    width: { control: 'text' },
    labelText: { control: 'text' },
    timeout: { control: { type: 'number', min: 0 } },
    click: { action: 'clicked' },
  },
  args: {
    variant: 'primary',
    styleType: 'default',
    compact: false,
    transparent: false,
    disabled: false,
    isLoading: false,
    fontSize: 'bodyS',
    labelText: 'icon button',
  },
};

export default meta;

type Story = StoryObj<IconButtonComponent>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: (args) => ({
    props: { ...args, icon: InfoIconStubComponent },
    template: `
      <div class="p-4">
        <IconButton
          [variant]="variant"
          [styleType]="styleType"
          [compact]="compact"
          [transparent]="transparent"
          [disabled]="disabled"
          [isLoading]="isLoading"
          [fontSize]="fontSize"
          [Icon]="icon"
          [width]="width"
          [tooltip]="tooltip"
          [tooltipSide]="tooltipSide"
          [labelText]="labelText"
          [timeout]="timeout"
          (click)="click($event)"
        ></IconButton>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Variants × StyleTypes
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  render: () => ({
    props: { icon: InfoIconStubComponent },
    template: `
      <div class="space-y-4 p-4">
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Primary</h3>
          <div class="flex flex-wrap gap-2">
            <IconButton variant="primary" styleType="default" [Icon]="icon" labelText="default"></IconButton>
            <IconButton variant="primary" styleType="danger" [Icon]="icon" labelText="danger"></IconButton>
            <IconButton variant="primary" styleType="monochrome" [Icon]="icon" labelText="monochrome"></IconButton>
            <IconButton variant="primary" styleType="warning" [Icon]="icon" labelText="warning"></IconButton>
            <IconButton variant="primary" styleType="success" [Icon]="icon" labelText="success"></IconButton>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Secondary</h3>
          <div class="flex flex-wrap gap-2">
            <IconButton variant="secondary" styleType="default" [Icon]="icon" labelText="default"></IconButton>
            <IconButton variant="secondary" styleType="danger" [Icon]="icon" labelText="danger"></IconButton>
            <IconButton variant="secondary" styleType="monochrome" [Icon]="icon" labelText="monochrome"></IconButton>
            <IconButton variant="secondary" styleType="warning" [Icon]="icon" labelText="warning"></IconButton>
            <IconButton variant="secondary" styleType="success" [Icon]="icon" labelText="success"></IconButton>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Tertiary</h3>
          <div class="flex flex-wrap gap-2">
            <IconButton variant="tertiary" styleType="default" [Icon]="icon" labelText="default"></IconButton>
            <IconButton variant="tertiary" styleType="danger" [Icon]="icon" labelText="danger"></IconButton>
            <IconButton variant="tertiary" styleType="monochrome" [Icon]="icon" labelText="monochrome"></IconButton>
            <IconButton variant="tertiary" styleType="warning" [Icon]="icon" labelText="warning"></IconButton>
            <IconButton variant="tertiary" styleType="success" [Icon]="icon" labelText="success"></IconButton>
          </div>
        </div>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Sizes (fontSize)
// ---------------------------------------------------------------------------

export const Sizes: Story = {
  render: () => ({
    props: { icon: InfoIconStubComponent },
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <IconButton fontSize="bodyXxs" [Icon]="icon" labelText="bodyXxs"></IconButton>
        <IconButton fontSize="bodyXs" [Icon]="icon" labelText="bodyXs"></IconButton>
        <IconButton fontSize="bodyS" [Icon]="icon" labelText="bodyS"></IconButton>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Compact
// ---------------------------------------------------------------------------

export const Compact: Story = {
  render: () => ({
    props: { icon: InfoIconStubComponent },
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <IconButton compact="true" [Icon]="icon" labelText="compact"></IconButton>
        <IconButton [Icon]="icon" labelText="normal"></IconButton>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Disabled
// ---------------------------------------------------------------------------

export const Disabled: Story = {
  render: () => ({
    props: { icon: InfoIconStubComponent },
    template: `
      <div class="flex flex-wrap gap-2 p-4">
        <IconButton disabled="true" [Icon]="icon" labelText="primary"></IconButton>
        <IconButton variant="secondary" disabled="true" [Icon]="icon" labelText="secondary"></IconButton>
        <IconButton variant="tertiary" disabled="true" [Icon]="icon" labelText="tertiary"></IconButton>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

export const Loading: Story = {
  render: () => ({
    props: { icon: InfoIconStubComponent },
    template: `
      <div class="flex flex-wrap gap-2 p-4">
        <IconButton isLoading="true" [Icon]="icon" labelText="primary"></IconButton>
        <IconButton variant="secondary" isLoading="true" [Icon]="icon" labelText="secondary"></IconButton>
        <IconButton variant="tertiary" isLoading="true" [Icon]="icon" labelText="tertiary"></IconButton>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// With timeout
// ---------------------------------------------------------------------------

export const WithTimeout: Story = {
  args: { timeout: 5000 },
  render: (args) => ({
    props: { ...args, icon: InfoIconStubComponent },
    template: `
      <div class="p-4">
        <IconButton
          [Icon]="icon"
          [timeout]="timeout"
          labelText="timeout 5s"
          (click)="click($event)"
        ></IconButton>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// With tooltip
// ---------------------------------------------------------------------------

export const WithTooltip: Story = {
  args: { tooltip: 'Más información' },
  render: (args) => ({
    props: { ...args, icon: InfoIconStubComponent },
    template: `
      <div class="p-12 flex items-center justify-center">
        <IconButton
          [Icon]="icon"
          [tooltip]="tooltip"
          [tooltipSide]="tooltipSide"
          labelText="info"
        ></IconButton>
      </div>
    `,
  }),
};

export const TooltipAllSides: Story = {
  render: () => ({
    props: { icon: InfoIconStubComponent },
    template: `
      <div class="grid grid-cols-3 grid-rows-3 items-center justify-items-center gap-4 p-6 h-80">
        <div></div>
        <IconButton tooltip="Tooltip arriba" tooltipSide="top" [Icon]="icon" labelText="top"></IconButton>
        <div></div>
        <IconButton tooltip="Tooltip izquierda" tooltipSide="left" [Icon]="icon" labelText="left"></IconButton>
        <div></div>
        <IconButton tooltip="Tooltip derecha" tooltipSide="right" [Icon]="icon" labelText="right"></IconButton>
        <div></div>
        <IconButton tooltip="Tooltip abajo" tooltipSide="bottom" [Icon]="icon" labelText="bottom"></IconButton>
        <div></div>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// With explicit width
// ---------------------------------------------------------------------------

export const WithExplicitWidth: Story = {
  render: () => ({
    props: { icon: InfoIconStubComponent },
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <IconButton width="48px" [Icon]="icon" labelText="48px"></IconButton>
        <IconButton width="64px" [Icon]="icon" labelText="64px"></IconButton>
        <IconButton [Icon]="icon" labelText="default (square)"></IconButton>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// As link
// ---------------------------------------------------------------------------

export const AsLink: Story = {
  render: () => ({
    props: { icon: InfoIconStubComponent },
    template: `
      <div class="p-4">
        <IconButton
          [asLink]="true"
          [linkProps]="{ href: 'https://angular.dev', target: '_blank' }"
          [Icon]="icon"
          labelText="Angular docs"
        ></IconButton>
      </div>
    `,
  }),
};
