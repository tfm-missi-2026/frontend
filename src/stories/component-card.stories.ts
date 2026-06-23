import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { CommonComponentCardComponent } from "@shared/common/component-card";
import { UiButtonComponent } from "@shared/ui/button";
import { IconBoxComponent } from "@shared/icons";

const meta: Meta<CommonComponentCardComponent> = {
  title: "Common/ComponentCard",
  component: CommonComponentCardComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonComponentCardComponent, UiButtonComponent, IconBoxComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    desc: { control: "text" },
    className: { control: "text" },
  },
  args: {
    title: "Default Card",
    desc: "Card con cabecera y divisor integrados.",
    className: "max-w-md",
  },
  render: (args) => ({
    props: args,
    template: `
      <CommonComponentCard
        [title]="title"
        [desc]="desc"
        [className]="className"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Contenido proyectado dentro del card.
        </p>
      </CommonComponentCard>
    `,
  }),
};

export default meta;

type Story = StoryObj<CommonComponentCardComponent>;

export const Default: Story = {};

// Solo título, sin descripción.
export const TitleOnly: Story = {
  args: { title: "Title only", desc: "" },
};

// Sin cabecera, solo el contenido proyectado.
export const ContentOnly: Story = {
  args: { title: "", desc: "" },
  render: (args) => ({
    props: { ...args, boxIcon: IconBoxComponent },
    template: `
      <CommonComponentCard className="max-w-md">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
            <ng-container *ngComponentOutlet="boxIcon"></ng-container>
          </span>
          <div>
            <p class="font-medium text-gray-800 dark:text-white/90">Card with icon</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Useful for empty states</p>
          </div>
        </div>
      </CommonComponentCard>
    `,
  }),
};

// Composición: card showcase con botones (caso de uso real).
export const Showcase: Story = {
  args: {
    title: "Primary Button",
    desc: "Variantes principales del botón primario.",
  },
  render: (args) => ({
    props: args,
    template: `
      <CommonComponentCard [title]="title" [desc]="desc" className="max-w-md">
        <div class="flex flex-wrap gap-3">
          <UiButton variant="primary" label="Default" />
          <UiButton variant="primary" size="sm" label="Small" />
          <UiButton variant="primary" [disabled]="true" label="Disabled" />
        </div>
      </CommonComponentCard>
    `,
  }),
};
