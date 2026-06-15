import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiSelectChipComponent } from "@shared/ui/select-chip";

const meta: Meta<UiSelectChipComponent> = {
  title: "Shared/SelectChip",
  component: UiSelectChipComponent,
  decorators: [moduleMetadata({ imports: [UiSelectChipComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    removeLabel: { control: "text" },
    removeIconSize: { control: "text" },
  },
  args: {
    label: "Angular",
    disabled: false,
    readOnly: false,
    removeLabel: "Quitar",
    removeIconSize: "10",
  },
};

export default meta;

type Story = StoryObj<UiSelectChipComponent>;

// Default
export const Default: Story = {};

// Estados
export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
};

// Long label → truncate
export const LongLabel: Story = {
  args: {
    label: "Un nombre extraordinariamente largo que debería truncarse",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 max-w-48">
        <UiSelectChip
          [label]="label"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [removeLabel]="removeLabel"
        ></UiSelectChip>
      </div>
    `,
  }),
};

// Grupo (uso típico en un UiSelect multi)
export const InAGroup: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-4">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Uso típico en un UiSelect multi
        </h3>
        <div class="flex flex-wrap items-center gap-1.5 p-3 rounded-lg border border-gray-300 dark:border-gray-700 min-h-11">
          <UiSelectChip label="Angular" removeLabel="Quitar Angular" (remove)="onRemove($event)"></UiSelectChip>
          <UiSelectChip label="React" removeLabel="Quitar React" (remove)="onRemove($event)"></UiSelectChip>
          <UiSelectChip label="Vue" removeLabel="Quitar Vue" (remove)="onRemove($event)"></UiSelectChip>
          <UiSelectChip label="Svelte" removeLabel="Quitar Svelte" (remove)="onRemove($event)"></UiSelectChip>
        </div>
      </div>
    `,
    props: {
      onRemove: (e: unknown) => console.log("remove", e),
    },
  }),
};
