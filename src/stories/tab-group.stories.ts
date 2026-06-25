import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { CommonTabGroupComponent } from "@shared/common/tab-group";
import type { CommonTabOption } from "@shared/common/tab-group";

const threeTabs: CommonTabOption[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
];

const meta: Meta<CommonTabGroupComponent> = {
  title: "Common/TabGroup",
  component: CommonTabGroupComponent,
  decorators: [
    moduleMetadata({ imports: [CommonTabGroupComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    tabs: { control: "object" },
    selectedId: { control: "text" },
    fullWidth: { control: "boolean" },
    size: { control: "select", options: ["sm", "md"] },
    ariaLabel: { control: "text" },
    className: { control: "text" },
    selectedChange: { action: "selectedChange" },
  },
  args: {
    tabs: threeTabs,
    fullWidth: true,
    size: "md",
  },
  render: (args) => ({
    props: args,
    template: `
      <CommonTabGroup
        [tabs]="tabs"
        [selectedId]="selectedId"
        [fullWidth]="fullWidth"
        [size]="size"
        [ariaLabel]="ariaLabel"
        [className]="className"
        (selectedChange)="selectedChange($event)"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<CommonTabGroupComponent>;

export const Default: Story = {};

export const TwoTabs: Story = {
  args: {
    tabs: [
      { value: "week", label: "Week" },
      { value: "day", label: "Day" },
    ],
  },
};

export const FourTabs: Story = {
  args: {
    tabs: [
      { value: "d", label: "Day" },
      { value: "w", label: "Week" },
      { value: "m", label: "Month" },
      { value: "y", label: "Year" },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    tabs: [
      { value: "a", label: "Active" },
      { value: "b", label: "Coming soon", disabled: true },
      { value: "c", label: "Active too" },
    ],
  },
};

export const PreSelected: Story = {
  args: { selectedId: "quarterly" },
};

export const SmallSize: Story = {
  args: { size: "sm" },
};

export const ControlledWithExternalState: Story = {
  render: () => ({
    props: {
      tabs: threeTabs,
      current: "monthly",
    },
    template: `
      <div class="space-y-3 max-w-xs">
        <CommonTabGroup
          [tabs]="tabs"
          [selectedId]="current"
          (selectedChange)="current = $event"
        />
        <pre class="text-xs text-gray-600 dark:text-gray-400">current = {{ current }}</pre>
      </div>
    `,
  }),
};