import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { UiRadioComponent } from "@shared/ui/radio";

const meta: Meta<UiRadioComponent> = {
  title: "Shared/Radio",
  component: UiRadioComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, UiRadioComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    value: { control: "text" },
    checked: { control: "boolean" },
    label: { control: "text" },
    size: { control: "select", options: ["md", "sm"] },
    disabled: { control: "boolean" },
    className: { control: "text" },
    valueChange: { action: "valueChange" },
  },
  args: {
    id: "demo-radio",
    name: "group",
    value: "opt-1",
    label: "Opción 1",
    size: "md",
    checked: false,
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <UiRadio
        [id]="id"
        [name]="name"
        [value]="value"
        [checked]="checked"
        [label]="label"
        [size]="size"
        [disabled]="disabled"
        [className]="className"
        (valueChange)="valueChange($event)"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<UiRadioComponent>;

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

export const SmallSize: Story = {
  args: { size: "sm", label: "Opción pequeña" },
};

export const WithoutLabel: Story = {
  args: { label: undefined },
};

export const Group: Story = {
  render: () => ({
    template: `
      <div class="p-2 space-y-3">
        <p class="text-sm font-semibold">Selecciona un framework</p>
        <UiRadio id="r-angular" name="framework" value="angular" label="Angular" [checked]="selected === 'angular'" (valueChange)="selected = $event" />
        <UiRadio id="r-react" name="framework" value="react" label="React" [checked]="selected === 'react'" (valueChange)="selected = $event" />
        <UiRadio id="r-vue" name="framework" value="vue" label="Vue" [checked]="selected === 'vue'" (valueChange)="selected = $event" />
        <UiRadio id="r-svelte" name="framework" value="svelte" label="Svelte" [checked]="selected === 'svelte'" (valueChange)="selected = $event" />
        <p class="text-xs text-gray-600">Seleccionado: {{ selected }}</p>
      </div>
    `,
    props: { selected: "angular" },
  }),
};

export const GroupSmall: Story = {
  render: () => ({
    template: `
      <div class="p-2 space-y-2">
        <UiRadio size="sm" id="s-1" name="sm-group" value="1" label="Uno" [checked]="n === '1'" (valueChange)="n = $event" />
        <UiRadio size="sm" id="s-2" name="sm-group" value="2" label="Dos" [checked]="n === '2'" (valueChange)="n = $event" />
        <UiRadio size="sm" id="s-3" name="sm-group" value="3" label="Tres" [checked]="n === '3'" (valueChange)="n = $event" />
      </div>
    `,
    props: { n: "1" },
  }),
};

export const GroupWithDisabled: Story = {
  render: () => ({
    template: `
      <div class="p-2 space-y-3">
        <UiRadio name="plan" value="free" label="Free" [checked]="true" />
        <UiRadio name="plan" value="pro" label="Pro" />
        <UiRadio name="plan" value="enterprise" label="Enterprise" [disabled]="true" />
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3 bg-gray-900 text-white rounded-lg">
        <UiRadio name="dark-group" value="opt-1" label="Unchecked dark" />
        <UiRadio name="dark-group" value="opt-2" label="Checked dark" [checked]="true" />
        <UiRadio name="dark-group" value="opt-3" label="Disabled dark" [disabled]="true" />
      </div>
    `,
  }),
};
