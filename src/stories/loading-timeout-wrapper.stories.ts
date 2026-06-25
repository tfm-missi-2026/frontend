import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiLoadingTimeoutWrapperComponent } from "@shared/ui/loading-timeout-wrapper/loading-timeout-wrapper.component";
import { UiButtonComponent } from "@shared/ui/button/button.component";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle/theme-toggle.component";

const meta: Meta<UiLoadingTimeoutWrapperComponent> = {
  title: "Shared/LoadingTimeoutWrapper",
  component: UiLoadingTimeoutWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [
        UiLoadingTimeoutWrapperComponent,
        UiButtonComponent,
        CommonThemeToggleComponent,
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
    transparent: { control: "boolean" },
    fullWidth: { control: "boolean" },
    timeout: { control: { type: "number", min: 0 } },
    className: { control: "text" },
  },
  args: {
    variant: "primary",
    styleType: "default",
    transparent: false,
    fullWidth: false,
  },
};

export default meta;

type Story = StoryObj<UiLoadingTimeoutWrapperComponent>;

export const Default: Story = {
  args: { timeout: 5000 },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <UiLoadingTimeoutWrapper
          [variant]="variant"
          [styleType]="styleType"
          [transparent]="transparent"
          [fullWidth]="fullWidth"
          [timeout]="timeout"
          [className]="className"
        >
          <UiButton
            [variant]="variant"
            [styleType]="styleType"
            label="Botón con timeout"
            [disabled]="true"
          ></UiButton>
        </UiLoadingTimeoutWrapper>
      </div>
    `,
  }),
};

export const NoTimeout: Story = {
  args: { timeout: undefined },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <UiLoadingTimeoutWrapper
          [variant]="variant"
          [styleType]="styleType"
          [transparent]="transparent"
          [fullWidth]="fullWidth"
          [timeout]="timeout"
          [className]="className"
        >
          <UiButton
            [variant]="variant"
            [styleType]="styleType"
            label="Sin progress bar"
          ></UiButton>
        </UiLoadingTimeoutWrapper>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  args: { timeout: 6000 },
  render: (args) => ({
    props: args,
    template: `
      <div class="space-y-4 p-4">
        <div>
          <p class="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Primary</p>
          <div class="flex flex-wrap gap-2">
            <UiLoadingTimeoutWrapper [variant]="'primary'" [styleType]="'default'" [timeout]="timeout">
              <UiButton [variant]="'primary'" label="Default" [disabled]="true"></UiButton>
            </UiLoadingTimeoutWrapper>
            <UiLoadingTimeoutWrapper [variant]="'primary'" [styleType]="'danger'" [timeout]="timeout">
              <UiButton [variant]="'primary'" [styleType]="'danger'" label="Danger" [disabled]="true"></UiButton>
            </UiLoadingTimeoutWrapper>
            <UiLoadingTimeoutWrapper [variant]="'primary'" [styleType]="'warning'" [timeout]="timeout">
              <UiButton [variant]="'primary'" [styleType]="'warning'" label="Warning" [disabled]="true"></UiButton>
            </UiLoadingTimeoutWrapper>
            <UiLoadingTimeoutWrapper [variant]="'primary'" [styleType]="'success'" [timeout]="timeout">
              <UiButton [variant]="'primary'" [styleType]="'success'" label="Success" [disabled]="true"></UiButton>
            </UiLoadingTimeoutWrapper>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Secondary</p>
          <div class="flex flex-wrap gap-2">
            <UiLoadingTimeoutWrapper [variant]="'secondary'" [styleType]="'default'" [timeout]="timeout">
              <UiButton [variant]="'secondary'" label="Default" [disabled]="true"></UiButton>
            </UiLoadingTimeoutWrapper>
            <UiLoadingTimeoutWrapper [variant]="'secondary'" [styleType]="'danger'" [timeout]="timeout">
              <UiButton [variant]="'secondary'" [styleType]="'danger'" label="Danger" [disabled]="true"></UiButton>
            </UiLoadingTimeoutWrapper>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300">Tertiary</p>
          <div class="flex flex-wrap gap-2">
            <UiLoadingTimeoutWrapper [variant]="'tertiary'" [styleType]="'default'" [timeout]="timeout">
              <UiButton [variant]="'tertiary'" label="Default" [disabled]="true"></UiButton>
            </UiLoadingTimeoutWrapper>
            <UiLoadingTimeoutWrapper [variant]="'tertiary'" [styleType]="'success'" [timeout]="timeout">
              <UiButton [variant]="'tertiary'" [styleType]="'success'" label="Success" [disabled]="true"></UiButton>
            </UiLoadingTimeoutWrapper>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ShortTimeout: Story = {
  args: { timeout: 2000 },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="text-xs text-gray-600 dark:text-gray-300 mb-2">Timeout corto (2s):</p>
        <UiLoadingTimeoutWrapper [variant]="variant" [styleType]="styleType" [timeout]="timeout">
          <UiButton [variant]="variant" [styleType]="styleType" label="2 segundos" [disabled]="true"></UiButton>
        </UiLoadingTimeoutWrapper>
      </div>
    `,
  }),
};

export const LongTimeout: Story = {
  args: { timeout: 15000 },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4">
        <p class="text-xs text-gray-600 dark:text-gray-300 mb-2">Timeout largo (15s):</p>
        <UiLoadingTimeoutWrapper [variant]="variant" [styleType]="styleType" [timeout]="timeout">
          <UiButton [variant]="variant" [styleType]="styleType" label="15 segundos" [disabled]="true"></UiButton>
        </UiLoadingTimeoutWrapper>
      </div>
    `,
  }),
};

export const Transparent: Story = {
  args: { timeout: 5000 },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex gap-2">
        <UiLoadingTimeoutWrapper [variant]="'secondary'" [styleType]="'default'" [transparent]="true" [timeout]="timeout">
          <UiButton [variant]="'secondary'" [transparent]="true" label="Secondary transparent" [disabled]="true"></UiButton>
        </UiLoadingTimeoutWrapper>
        <UiLoadingTimeoutWrapper [variant]="'tertiary'" [styleType]="'default'" [transparent]="true" [timeout]="timeout">
          <UiButton [variant]="'tertiary'" [transparent]="true" label="Tertiary transparent" [disabled]="true"></UiButton>
        </UiLoadingTimeoutWrapper>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  args: { timeout: 6000 },
  render: (args) => ({
    props: args,
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg space-y-4">
        <p class="text-xs text-gray-400">Primary</p>
        <div class="flex flex-wrap gap-2">
          <UiLoadingTimeoutWrapper [variant]="'primary'" [styleType]="'default'" [timeout]="timeout">
            <UiButton [variant]="'primary'" label="Default" [disabled]="true"></UiButton>
          </UiLoadingTimeoutWrapper>
          <UiLoadingTimeoutWrapper [variant]="'primary'" [styleType]="'danger'" [timeout]="timeout">
            <UiButton [variant]="'primary'" [styleType]="'danger'" label="Danger" [disabled]="true"></UiButton>
          </UiLoadingTimeoutWrapper>
        </div>
        <p class="text-xs text-gray-400">Secondary</p>
        <div class="flex flex-wrap gap-2">
          <UiLoadingTimeoutWrapper [variant]="'secondary'" [styleType]="'default'" [timeout]="timeout">
            <UiButton [variant]="'secondary'" label="Default" [disabled]="true"></UiButton>
          </UiLoadingTimeoutWrapper>
          <UiLoadingTimeoutWrapper [variant]="'secondary'" [styleType]="'success'" [timeout]="timeout">
            <UiButton [variant]="'secondary'" [styleType]="'success'" label="Success" [disabled]="true"></UiButton>
          </UiLoadingTimeoutWrapper>
        </div>
      </div>
    `,
  }),
};

export const WithThemeSwitch: Story = {
  args: { timeout: 8000 },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-col items-start gap-6 p-6">
        <CommonThemeToggle variant="subtle" size="md"></CommonThemeToggle>

        <div class="flex flex-wrap gap-3">
          <UiLoadingTimeoutWrapper [variant]="'primary'" [timeout]="timeout">
            <UiButton [variant]="'primary'" label="Primary" [disabled]="true"></UiButton>
          </UiLoadingTimeoutWrapper>
          <UiLoadingTimeoutWrapper [variant]="'secondary'" [timeout]="timeout">
            <UiButton [variant]="'secondary'" label="Secondary" [disabled]="true"></UiButton>
          </UiLoadingTimeoutWrapper>
          <UiLoadingTimeoutWrapper [variant]="'tertiary'" [timeout]="timeout">
            <UiButton [variant]="'tertiary'" label="Tertiary" [disabled]="true"></UiButton>
          </UiLoadingTimeoutWrapper>
        </div>
      </div>
    `,
  }),
};