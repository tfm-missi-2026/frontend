import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiIconButtonComponent } from "@shared/ui/icon-button/icon-button.component";
import { UiTooltipComponent } from "@shared/ui/tooltip/tooltip.component";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle/theme-toggle.component";
import { IconInfoComponent } from "@shared/icons/info-icon";
import { IconCheckComponent } from "@shared/icons/check-icon";
import { IconCloseCircleComponent } from "@shared/icons/close-circle-icon";
import { IconEditPencilComponent } from "@shared/icons/edit-pencil-icon";
import { IconTrashLightComponent } from "@shared/icons/trash-icon-light";

const meta: Meta<UiIconButtonComponent> = {
  title: "Shared/IconButton",
  component: UiIconButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [
        UiIconButtonComponent,
        UiTooltipComponent,
        CommonThemeToggleComponent,
        IconInfoComponent,
        IconCheckComponent,
        IconCloseCircleComponent,
        IconEditPencilComponent,
        IconTrashLightComponent,
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
    isSubmit: { control: "boolean" },
    isLoading: { control: "boolean" },
    asLink: { control: "boolean" },
    fontSize: {
      control: "select",
      options: ["bodyXxs", "bodyXs", "bodyS"],
    },
    tooltip: { control: "text" },
    tooltipSide: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
    tooltipVariant: {
      control: "select",
      options: ["light", "dark", "info", "success", "warning", "error"],
    },
    width: { control: "text" },
    labelText: { control: "text" },
    timeout: { control: { type: "number", min: 0 } },
    disableOnTimeout: { control: "boolean" },
    click: { action: "clicked" },
  },
  args: {
    variant: "primary",
    styleType: "default",
    compact: false,
    transparent: false,
    disabled: false,
    isSubmit: false,
    isLoading: false,
    asLink: false,
    fontSize: "bodyS",
    labelText: "icon button",
  },
};

export default meta;

type Story = StoryObj<UiIconButtonComponent>;

// Default
export const Default: Story = {
  render: (args) => ({
    props: { ...args, icon: IconInfoComponent },
    template: `
      <div class="p-4">
        <UiIconButton
          [variant]="variant"
          [styleType]="styleType"
          [compact]="compact"
          [transparent]="transparent"
          [disabled]="disabled"
          [isSubmit]="isSubmit"
          [isLoading]="isLoading"
          [asLink]="asLink"
          [fontSize]="fontSize"
          [Icon]="icon"
          [width]="width"
          [tooltip]="tooltip"
          [tooltipSide]="tooltipSide"
          [tooltipVariant]="tooltipVariant"
          [labelText]="labelText"
          [timeout]="timeout"
          [disableOnTimeout]="disableOnTimeout"
          (click)="click($event)"
        ></UiIconButton>
      </div>
    `,
  }),
};

// Variantes
export const AllVariants: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="space-y-4 p-4">
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Primary</h3>
          <div class="flex flex-wrap gap-2">
            <UiIconButton variant="primary" styleType="default" [Icon]="icon" labelText="default"></UiIconButton>
            <UiIconButton variant="primary" styleType="danger" [Icon]="icon" labelText="danger"></UiIconButton>
            <UiIconButton variant="primary" styleType="monochrome" [Icon]="icon" labelText="monochrome"></UiIconButton>
            <UiIconButton variant="primary" styleType="warning" [Icon]="icon" labelText="warning"></UiIconButton>
            <UiIconButton variant="primary" styleType="success" [Icon]="icon" labelText="success"></UiIconButton>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Secondary</h3>
          <div class="flex flex-wrap gap-2">
            <UiIconButton variant="secondary" styleType="default" [Icon]="icon" labelText="default"></UiIconButton>
            <UiIconButton variant="secondary" styleType="danger" [Icon]="icon" labelText="danger"></UiIconButton>
            <UiIconButton variant="secondary" styleType="monochrome" [Icon]="icon" labelText="monochrome"></UiIconButton>
            <UiIconButton variant="secondary" styleType="warning" [Icon]="icon" labelText="warning"></UiIconButton>
            <UiIconButton variant="secondary" styleType="success" [Icon]="icon" labelText="success"></UiIconButton>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Tertiary</h3>
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

// Tamaños
export const Sizes: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <UiIconButton fontSize="bodyXxs" [Icon]="icon" labelText="bodyXxs"></UiIconButton>
        <UiIconButton fontSize="bodyXs" [Icon]="icon" labelText="bodyXs"></UiIconButton>
        <UiIconButton fontSize="bodyS" [Icon]="icon" labelText="bodyS"></UiIconButton>
      </div>
    `,
  }),
};

// Estados
export const Compact: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <UiIconButton [compact]="true" [Icon]="icon" labelText="compact"></UiIconButton>
        <UiIconButton [compact]="false" [Icon]="icon" labelText="normal"></UiIconButton>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="flex flex-wrap gap-2 p-4">
        <UiIconButton [disabled]="true" [Icon]="icon" labelText="primary"></UiIconButton>
        <UiIconButton variant="secondary" [disabled]="true" [Icon]="icon" labelText="secondary"></UiIconButton>
        <UiIconButton variant="tertiary" [disabled]="true" [Icon]="icon" labelText="tertiary"></UiIconButton>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="flex flex-wrap gap-2 p-4">
        <UiIconButton [isLoading]="true" [Icon]="icon" labelText="primary"></UiIconButton>
        <UiIconButton variant="secondary" [isLoading]="true" [Icon]="icon" labelText="secondary"></UiIconButton>
        <UiIconButton variant="tertiary" [isLoading]="true" [Icon]="icon" labelText="tertiary"></UiIconButton>
      </div>
    `,
  }),
};

// Diferentes íconos
export const WithDifferentIcons: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <UiIconButton [Icon]="iconInfo" labelText="info"></UiIconButton>
        <UiIconButton variant="primary" styleType="success" [Icon]="iconCheck" labelText="check"></UiIconButton>
        <UiIconButton variant="primary" styleType="danger" [Icon]="iconClose" labelText="close"></UiIconButton>
        <UiIconButton variant="secondary" [Icon]="iconEdit" labelText="edit"></UiIconButton>
        <UiIconButton variant="secondary" styleType="danger" [Icon]="iconTrash" labelText="delete"></UiIconButton>
      </div>
    `,
    props: {
      iconInfo: IconInfoComponent,
      iconCheck: IconCheckComponent,
      iconClose: IconCloseCircleComponent,
      iconEdit: IconEditPencilComponent,
      iconTrash: IconTrashLightComponent,
    },
  }),
};

// Timeout
export const WithTimeout: Story = {
  args: { timeout: 5000 },
  render: (args) => ({
    props: { ...args, icon: IconInfoComponent },
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

// Tooltip
export const WithTooltip: Story = {
  args: { tooltip: "Más información" },
  render: (args) => ({
    props: { ...args, icon: IconInfoComponent },
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
    props: { icon: IconInfoComponent },
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

export const TooltipNoClipping: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="p-12 space-y-4">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          El tooltip se monta en <code>body</code> vía CDK Overlay. No queda
          recortado por el contenedor con <code>overflow:hidden</code>.
        </p>
        <div class="overflow-hidden w-40 h-16 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          <UiIconButton
            tooltip="Sale del contenedor padre"
            [Icon]="icon"
            labelText="info"
          ></UiIconButton>
        </div>
      </div>
    `,
  }),
};

export const TooltipOnDarkBg: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="dark bg-gray-900 rounded-lg p-12 flex flex-wrap items-center gap-4">
        <UiIconButton tooltipVariant="light" tooltip="Light variant" [Icon]="icon" labelText="light"></UiIconButton>
        <UiIconButton tooltipVariant="dark" tooltip="Dark variant" [Icon]="icon" labelText="dark"></UiIconButton>
        <UiIconButton tooltipVariant="info" tooltip="Info variant" [Icon]="icon" labelText="info"></UiIconButton>
        <UiIconButton tooltipVariant="success" tooltip="Success variant" [Icon]="icon" labelText="success"></UiIconButton>
        <UiIconButton tooltipVariant="warning" tooltip="Warning variant" [Icon]="icon" labelText="warning"></UiIconButton>
        <UiIconButton tooltipVariant="error" tooltip="Error variant" [Icon]="icon" labelText="error"></UiIconButton>
      </div>
    `,
  }),
};

// Width
export const WithExplicitWidth: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="flex flex-wrap items-center gap-2 p-4">
        <UiIconButton width="48px" [Icon]="icon" labelText="48px"></UiIconButton>
        <UiIconButton width="64px" [Icon]="icon" labelText="64px"></UiIconButton>
        <UiIconButton [Icon]="icon" labelText="default (square)"></UiIconButton>
      </div>
    `,
  }),
};

// As link
export const AsLink: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
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

// DarkMode
export const DarkMode: Story = {
  render: () => ({
    props: { icon: IconInfoComponent },
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg space-y-4">
        <div class="space-y-2">
          <p class="text-xs text-gray-400">Primary</p>
          <div class="flex flex-wrap gap-2">
            <UiIconButton variant="primary" [Icon]="icon" labelText="default"></UiIconButton>
            <UiIconButton variant="primary" styleType="danger" [Icon]="icon" labelText="danger"></UiIconButton>
            <UiIconButton variant="primary" styleType="warning" [Icon]="icon" labelText="warning"></UiIconButton>
            <UiIconButton variant="primary" styleType="success" [Icon]="icon" labelText="success"></UiIconButton>
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-xs text-gray-400">Secondary</p>
          <div class="flex flex-wrap gap-2">
            <UiIconButton variant="secondary" [Icon]="icon" labelText="default"></UiIconButton>
            <UiIconButton variant="secondary" styleType="danger" [Icon]="icon" labelText="danger"></UiIconButton>
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-xs text-gray-400">Tertiary</p>
          <div class="flex flex-wrap gap-2">
            <UiIconButton variant="tertiary" [Icon]="icon" labelText="default"></UiIconButton>
            <UiIconButton variant="tertiary" [disabled]="true" [Icon]="icon" labelText="disabled"></UiIconButton>
            <UiIconButton variant="tertiary" [isLoading]="true" [Icon]="icon" labelText="loading"></UiIconButton>
          </div>
        </div>
      </div>
    `,
  }),
};

// ThemeSwitch
export const WithThemeSwitch: Story = {
  render: () => ({
    props: {
      iconInfo: IconInfoComponent,
      iconCheck: IconCheckComponent,
      iconEdit: IconEditPencilComponent,
      iconTrash: IconTrashLightComponent,
    },
    template: `
      <div class="flex flex-col items-start gap-6 p-6">
        <CommonThemeToggle variant="subtle" size="md"></CommonThemeToggle>

        <div class="space-y-3">
          <div class="flex flex-wrap gap-2">
            <UiIconButton [Icon]="iconInfo" labelText="info"></UiIconButton>
            <UiIconButton variant="secondary" [Icon]="iconEdit" labelText="edit"></UiIconButton>
            <UiIconButton variant="tertiary" [Icon]="iconCheck" labelText="check"></UiIconButton>
          </div>
          <div class="flex flex-wrap gap-2">
            <UiIconButton [disabled]="true" [Icon]="iconInfo" labelText="disabled"></UiIconButton>
            <UiIconButton [isLoading]="true" [Icon]="iconInfo" labelText="loading"></UiIconButton>
            <UiIconButton variant="secondary" styleType="danger" [Icon]="iconTrash" labelText="delete"></UiIconButton>
          </div>
          <div class="flex flex-wrap gap-2">
            <UiIconButton
              [Icon]="iconInfo"
              tooltip="Guardar"
              labelText="with tooltip"
            ></UiIconButton>
            <UiIconButton
              [Icon]="iconInfo"
              [timeout]="5000"
              labelText="with timeout"
            ></UiIconButton>
          </div>
        </div>
      </div>
    `,
  }),
};