import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiHeaderComponent } from "@shared/ui/header";
import { FontWeightType } from "@styles/types/typography";

const fontWeights: FontWeightType[] = ["regular", "medium", "semibold", "bold"];

const meta: Meta<UiHeaderComponent> = {
  title: "Shared/Header",
  component: UiHeaderComponent,
  decorators: [moduleMetadata({ imports: [UiHeaderComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    level: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5],
    },
    as: {
      control: { type: "select" },
      options: [undefined, 1, 2, 3, 4, 5],
    },
    text: { control: "text" },
    weight: { control: "select", options: [...fontWeights, null] },
    id: { control: "text" },
    className: { control: "text" },
  },
  args: {
    level: 1,
    text: "The quick brown fox",
  },
};

export default meta;

type Story = StoryObj<UiHeaderComponent>;

// Default — h1 con tipografía del design system
export const Default: Story = {};

// Escala tipográfica
export const Scale: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        <UiHeader level="1" text="Heading 1 — 24px / bold"></UiHeader>
        <UiHeader level="2" text="Heading 2 — 20px / semibold"></UiHeader>
        <UiHeader level="3" text="Heading 3 — 18px / semibold"></UiHeader>
        <UiHeader level="4" text="Heading 4 — 16px / semibold"></UiHeader>
        <UiHeader level="5" text="Heading 5 — 14px / semibold"></UiHeader>
      </div>
    `,
  }),
};

// Override del tag
export const AsOverride: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        <p class="text-xs text-gray-500">
          Tipografía de nivel 3 renderizada con la etiqueta h2 (jerarquía visual ≠ semántica).
        </p>
        <UiHeader [level]="3" [as]="2" text="Visual h3 en h2"></UiHeader>
      </div>
    `,
  }),
};

// Pesos
export const FontWeights: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-3">
        @for (w of weights; track w) {
          <div class="flex items-baseline gap-4">
            <span class="w-24 text-xs text-gray-500">{{ w }}</span>
            <UiHeader level="3" text="The quick brown fox" [weight]="w"></UiHeader>
          </div>
        }
      </div>
    `,
    props: { weights: fontWeights },
  }),
};

// Con slot proyectado
export const WithContent: Story = {
  args: { text: undefined, level: 1 },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6">
        <UiHeader [level]="level" [text]="text">
          Bienvenido, <span class="text-brand-500">Marcos</span>
        </UiHeader>
      </div>
    `,
  }),
};
