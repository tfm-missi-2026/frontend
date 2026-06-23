import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { CommonThemeToggleComponent } from "@shared/common/theme-toggle";
import type {
  CommonThemeToggleSize,
  CommonThemeToggleVariant,
} from "@shared/common/theme-toggle";

const meta: Meta<CommonThemeToggleComponent> = {
  title: "Common/ThemeToggle",
  component: CommonThemeToggleComponent,
  decorators: [
    moduleMetadata({ imports: [CommonThemeToggleComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["subtle", "brand"] satisfies CommonThemeToggleVariant[],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"] satisfies CommonThemeToggleSize[],
    },
    className: { control: "text" },
    ariaLabel: { control: "text" },
  },
  args: {
    variant: "subtle",
    size: "md",
    ariaLabel: "Toggle theme",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-center gap-4">
        <CommonThemeToggle
          [variant]="variant"
          [size]="size"
          [className]="className"
          [ariaLabel]="ariaLabel"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Click para alternar claro/oscuro
        </span>
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<CommonThemeToggleComponent>;

export const Default: Story = {};

export const Brand: Story = {
  args: { variant: "brand" },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex items-center gap-4 rounded-xl bg-brand-950 p-6">
        <CommonThemeToggle [variant]="variant" [size]="size" />
        <span class="text-sm text-white/70">
          Variante brand sobre fondo oscuro (auth layout)
        </span>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-end gap-6">
        <div class="flex flex-col items-center gap-2">
          <CommonThemeToggle size="sm" />
          <span class="text-xs text-gray-500">sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <CommonThemeToggle size="md" />
          <span class="text-xs text-gray-500">md</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <CommonThemeToggle size="lg" />
          <span class="text-xs text-gray-500">lg</span>
        </div>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap items-end gap-8">
        <div class="flex flex-col items-center gap-2">
          <CommonThemeToggle variant="subtle" size="lg" />
          <span class="text-xs text-gray-500">subtle</span>
        </div>
        <div class="flex flex-col items-center gap-2 rounded-xl bg-brand-950 p-6">
          <CommonThemeToggle variant="brand" size="lg" />
          <span class="text-xs text-white/70">brand</span>
        </div>
      </div>
    `,
  }),
};
