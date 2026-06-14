// icon-button.stories.ts — IconButton del design system

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

import { UiIconButtonComponent } from "@ui/icon-button/icon-button";
import { UiTooltipComponent } from "@ui/tooltip/tooltip";
import { IconProps } from "@ui/icon/icon.interface";

// ---------------------------------------------------------------------------
// Icon stub (replica del usado en button.stories)
// ---------------------------------------------------------------------------

@Component({
  selector: "InfoIcon",
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
  @Input() color = "currentColor";
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

const meta: Meta<UiIconButtonComponent> = {
  title: "Shared/IconButton",
  component: UiIconButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        UiIconButtonComponent,
        UiTooltipComponent,
        InfoIconStubComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    styleType: {
      control: "select",
      options: ["default", "danger", "monochrome", "warning", "success"],
    },
    compact: { control: "boolean" },
    transparent: { control: "boolean" },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    fontSize: {
      control: "select",
      options: ["bodyXxs", "bodyXs", "bodyS"],
    },
    tooltip: { control: "text" },
    tooltipSide: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    width: { control: "text" },
    labelText: { control: "text" },
    timeout: { control: { type: "number", min: 0 } },
    click: { action: "clicked" },
  },
  args: {
    variant: "primary",
    styleType: "default",
    compact: false,
    transparent: false,
    disabled: false,
    isLoading: false,
    fontSize: "bodyS",
    labelText: "icon button",
  },
};

export default meta;

type Story = StoryObj<UiIconButtonComponent>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: (args) => ({
    props: { ...args, icon: InfoIconStubComponent },
    template: `
      <div class="p-4">
        <UiIconButton
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
        ></UiIconButton>
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
            <UiIconButton variant="primary" styleType="default" [Icon]="icon" labelText="default"></UiIconButton>
            <UiIconButton variant="primary" styleType="danger" [Icon]="icon" labelText="danger"></UiIconButton>
            <UiIconButton variant="primary" styleType="monochrome" [Icon]="icon" labelText="monochrome"></UiIconButton>
            <UiIconButton variant="primary" styleType="warning" [Icon]="icon" labelText="warning"></UiIconButton>
            <UiIconButton variant="primary" styleType="success" [Icon]="icon" labelText="success"></UiIconButton>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Secondary</h3>
          <div class="flex flex-wrap gap-2">
            <UiIconButton variant="secondary" styleType="default" [Icon]="icon" labelText="default"></UiIconButton>
            <UiIconButton variant="secondary" styleType="danger" [Icon]="icon" labelText="danger"></UiIconButton>
            <UiIconButton variant="secondary" styleType="monochrome" [Icon]="icon" labelText="monochrome"></UiIconButton>
            <UiIconButton variant="secondary" styleType="warning" [Icon]="icon" labelText="warning"></UiIconButton>
            <UiIconButton variant="secondary" styleType="success" [Icon]="icon" labelText="success"></UiIconButton>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600">Tertiary</h3>
          <div class="flex flex-wrap gap-2">
            <UiIconButton variant="tertiary" styleType="default" [Icon]="icon" labelText="default"></UiIconButton>
            <UiIconButton variant="tertiary" styleType="danger" [Icon]="icon" labelText="danger"></UiIconButton>
            <UiIconButton variant="tertiary" styleType="monochrome" [Icon]="icon" labelText="monochrome"></UiIconButton>
            <UiIconButton variant="tertiary" styleType="warning" [Icon]="icon" labelText="warning"></UiIconButton>
            <UiIconButton variant="tertiary" styleType="success" [Icon]="icon" labelText="success"></UiIconButton>
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
        <UiIconButton fontSize="bodyXxs" [Icon]="icon" labelText="bodyXxs"></UiIconButton>
        <UiIconButton fontSize="bodyXs" [Icon]="icon" labelText="bodyXs"></UiIconButton>
        <UiIconButton fontSize="bodyS" [Icon]="icon" labelText="bodyS"></UiIconButton>
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
        <UiIconButton compact="true" [Icon]="icon" labelText="compact"></UiIconButton>
        <UiIconButton [Icon]="icon" labelText="normal"></UiIconButton>
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
        <UiIconButton disabled="true" [Icon]="icon" labelText="primary"></UiIconButton>
        <UiIconButton variant="secondary" disabled="true" [Icon]="icon" labelText="secondary"></UiIconButton>
        <UiIconButton variant="tertiary" disabled="true" [Icon]="icon" labelText="tertiary"></UiIconButton>
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
        <UiIconButton isLoading="true" [Icon]="icon" labelText="primary"></UiIconButton>
        <UiIconButton variant="secondary" isLoading="true" [Icon]="icon" labelText="secondary"></UiIconButton>
        <UiIconButton variant="tertiary" isLoading="true" [Icon]="icon" labelText="tertiary"></UiIconButton>
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
        <UiIconButton
          [Icon]="icon"
          [timeout]="timeout"
          labelText="timeout 5s"
          (click)="click($event)"
        ></UiIconButton>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// With tooltip
// ---------------------------------------------------------------------------

export const WithTooltip: Story = {
  args: { tooltip: "Más información" },
  render: (args) => ({
    props: { ...args, icon: InfoIconStubComponent },
    template: `
      <div class="p-12 flex items-center justify-center">
        <UiIconButton
          [Icon]="icon"
          [tooltip]="tooltip"
          [tooltipSide]="tooltipSide"
          labelText="info"
        ></UiIconButton>
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
        <UiIconButton tooltip="Tooltip arriba" tooltipSide="top" [Icon]="icon" labelText="top"></UiIconButton>
        <div></div>
        <UiIconButton tooltip="Tooltip izquierda" tooltipSide="left" [Icon]="icon" labelText="left"></UiIconButton>
        <div></div>
        <UiIconButton tooltip="Tooltip derecha" tooltipSide="right" [Icon]="icon" labelText="right"></UiIconButton>
        <div></div>
        <UiIconButton tooltip="Tooltip abajo" tooltipSide="bottom" [Icon]="icon" labelText="bottom"></UiIconButton>
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
        <UiIconButton width="48px" [Icon]="icon" labelText="48px"></UiIconButton>
        <UiIconButton width="64px" [Icon]="icon" labelText="64px"></UiIconButton>
        <UiIconButton [Icon]="icon" labelText="default (square)"></UiIconButton>
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
        <UiIconButton
          [asLink]="true"
          [linkProps]="{ href: 'https://angular.dev', target: '_blank' }"
          [Icon]="icon"
          labelText="Angular docs"
        ></UiIconButton>
      </div>
    `,
  }),
};
