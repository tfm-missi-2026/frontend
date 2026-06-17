import type { Meta, StoryObj } from "@storybook/angular";
import { UiCheckboxComponent } from "@shared/ui/input/checkbox/checkbox.component";

const meta: Meta<UiCheckboxComponent> = {
  title: "Shared/Checkbox",
  component: UiCheckboxComponent,
  tags: ["autodocs"],

  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    className: { control: "text" },
    id: { control: "text" },
    checkedChange: { action: "checkedChange" },
  },
};

export default meta;

type Story = StoryObj<UiCheckboxComponent>;

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
    checked: false,
    disabled: false,
    id: "checkbox-default",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6">
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
      <div class="p-6 space-y-4">
        <UiCheckbox label="Unchecked" [checked]="false" id="c1" />
        <UiCheckbox label="Checked" [checked]="true" id="c2" />
      </div>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-4">
        <UiCheckbox label="Disabled unchecked" [disabled]="true" />
        <UiCheckbox label="Disabled checked" [disabled]="true" [checked]="true" />
      </div>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        <p class="text-sm font-semibold">Select options</p>

        <UiCheckbox label="Email notifications" id="g1" />
        <UiCheckbox label="Push notifications" id="g2" />
        <UiCheckbox label="SMS notifications" id="g3" />
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        <UiCheckbox
          label="Interactive checkbox"
          [checked]="checked"
          (checkedChange)="checked = $event"
        />

        <p class="text-sm text-gray-600">
          Value: {{ checked }}
        </p>
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-4 bg-gray-900 text-white rounded-lg">
        <UiCheckbox label="Dark mode checkbox" />
        <UiCheckbox label="Checked dark mode" [checked]="true" />
        <UiCheckbox label="Disabled dark mode" [disabled]="true" />
      </div>
    `,
  }),
};
