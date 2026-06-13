import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxComponent } from '@ui/input/checkbox/checkbox';

const meta: Meta<CheckboxComponent> = {
  title: 'Shared/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],

  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    className: { control: 'text' },
    id: { control: 'text' },
    checkedChange: { action: 'checkedChange' },
  },
};

export default meta;

type Story = StoryObj<CheckboxComponent>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    checked: false,
    disabled: false,
    id: 'checkbox-default',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6">
        <Checkbox
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
        <Checkbox label="Unchecked" [checked]="false" id="c1" />
        <Checkbox label="Checked" [checked]="true" id="c2" />
      </div>
    `,
  }),
};

export const DisabledStates: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-4">
        <Checkbox label="Disabled unchecked" [disabled]="true" />
        <Checkbox label="Disabled checked" [disabled]="true" [checked]="true" />
      </div>
    `,
  }),
};

export const Group: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        <p class="text-sm font-semibold">Select options</p>

        <Checkbox label="Email notifications" id="g1" />
        <Checkbox label="Push notifications" id="g2" />
        <Checkbox label="SMS notifications" id="g3" />
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        <Checkbox
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
        <Checkbox label="Dark mode checkbox" />
        <Checkbox label="Checked dark mode" [checked]="true" />
        <Checkbox label="Disabled dark mode" [disabled]="true" />
      </div>
    `,
  }),
};
