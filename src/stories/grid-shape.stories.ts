import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { CommonGridShapeComponent } from "@shared/common/grid-shape";

const meta: Meta<CommonGridShapeComponent> = {
  title: "Common/GridShape",
  component: CommonGridShapeComponent,
  decorators: [
    moduleMetadata({ imports: [CommonGridShapeComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    imageSrc: { control: "text" },
  },
  args: {
    imageSrc: "/images/shape/grid-01.svg",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white p-6 dark:bg-gray-900">
        <CommonGridShape [imageSrc]="imageSrc" />
        <div class="relative z-10 max-w-md text-center">
          <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Contenido centrado
          </h1>
          <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
            El fondo decorativo se posiciona en absolute con -z-1 para no
            interferir con la interacción.
          </p>
        </div>
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<CommonGridShapeComponent>;

export const Default: Story = {};

// Variante con un SVG custom (mismo path, distinto archivo en /images/shape).
export const CustomImage: Story = {
  args: { imageSrc: "/images/shape/grid-01.svg" },
};
