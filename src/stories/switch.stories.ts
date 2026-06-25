import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { UiSwitchComponent } from "@shared/ui/switch";

const meta: Meta<UiSwitchComponent> = {
  title: "Shared/Switch",
  component: UiSwitchComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, UiSwitchComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    color: { control: "select", options: ["brand", "gray"] },
    className: { control: "text" },
    checkedChange: { action: "checkedChange" },
  },
  args: {
    label: "Notificaciones",
    checked: false,
    disabled: false,
    color: "brand",
  },
  render: (args) => ({
    props: args,
    template: `
      <UiSwitch
        [label]="label"
        [checked]="checked"
        [disabled]="disabled"
        [color]="color"
        [className]="className"
        (checkedChange)="checkedChange($event)"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<UiSwitchComponent>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const Gray: Story = {
  args: { color: "gray", checked: true, label: "Modo monocromo" },
};

export const WithoutLabel: Story = {
  args: { label: undefined },
};

export const Group: Story = {
  render: () => ({
    template: `
      <div class="p-2 space-y-3 max-w-xs">
        <UiSwitch
          label="Email notifications"
          [checked]="email"
          (checkedChange)="email = $event"
        />
        <UiSwitch
          label="Push notifications"
          [checked]="push"
          (checkedChange)="push = $event"
        />
        <UiSwitch
          label="SMS notifications"
          [checked]="sms"
          (checkedChange)="sms = $event"
        />
        <UiSwitch
          label="Marketing (disabled)"
          [disabled]="true"
        />
        <pre class="text-xs">email={{ email }} push={{ push }} sms={{ sms }}</pre>
      </div>
    `,
    props: { email: true, push: false, sms: true },
  }),
};

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3 bg-gray-900 text-white rounded-lg max-w-sm">
        <UiSwitch label="Unchecked dark" />
        <UiSwitch label="Checked dark" [checked]="true" />
        <UiSwitch label="Disabled dark" [disabled]="true" />
      </div>
    `,
  }),
};
