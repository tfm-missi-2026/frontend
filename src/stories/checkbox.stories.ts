import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiCheckboxComponent } from "@shared/ui/input/checkbox/checkbox.component";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle/theme-toggle.component";

const meta: Meta<UiCheckboxComponent> = {
  title: "Shared/Checkbox",
  component: UiCheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [UiCheckboxComponent, CommonThemeToggleComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    className: { control: "text" },
    id: { control: "text" },
    checkedChange: { action: "checkedChange" },
  },
  args: {
    label: "Aceptar términos y condiciones",
    checked: false,
    disabled: false,
    id: "checkbox-default",
  },
};

export default meta;

type Story = StoryObj<UiCheckboxComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-2">
        <UiCheckbox
          [label]="label"
          [checked]="checked"
          [disabled]="disabled"
          [id]="id"
          (checkedChange)="checkedChange($event)"
        />
      </div>
    `,
  }),
};

export const CheckedStates: Story = {
  render: () => ({
    template: `
      <div class="p-2 space-y-4">
        <UiCheckbox label="Sin marcar" [checked]="false" id="c1" />
        <UiCheckbox label="Marcado" [checked]="true" id="c2" />
      </div>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div class="p-2 space-y-4">
        <UiCheckbox label="Disabled sin marcar" [disabled]="true" />
        <UiCheckbox label="Disabled marcado" [disabled]="true" [checked]="true" />
      </div>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <div class="p-2 space-y-3">
        <p class="text-sm font-semibold">Notificaciones</p>
        <UiCheckbox label="Email" id="g1" />
        <UiCheckbox label="Push" id="g2" />
        <UiCheckbox label="SMS" id="g3" />
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    props: { checked: false },
    template: `
      <div class="p-2 space-y-3">
        <UiCheckbox
          label="Checkbox interactivo"
          [checked]="checked"
          (checkedChange)="checked = $event"
        />
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Estado: {{ checked }}
        </p>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg space-y-4">
        <UiCheckbox label="Default en dark mode" />
        <UiCheckbox label="Marcado en dark mode" [checked]="true" />
        <UiCheckbox label="Disabled en dark mode" [disabled]="true" />
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
          <UiCheckbox label="Email notifications" />
          <UiCheckbox label="Push notifications" [checked]="true" />
          <UiCheckbox label="SMS notifications" [disabled]="true" />
        </div>
      </div>
    `,
  }),
};