import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiVideoComponent, VideoRatio } from "@shared/ui/video";

const SAMPLE_VIDEO = "https://www.youtube.com/embed/dQw4w9WgXcQ";

const RATIOS: VideoRatio[] = ["1:1", "4:3", "16:9", "21:9"];

const meta: Meta<UiVideoComponent> = {
  title: "Shared/Video",
  component: UiVideoComponent,
  decorators: [moduleMetadata({ imports: [UiVideoComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    src: { control: "text" },
    ratio: {
      control: "select",
      options: RATIOS,
    },
    title: { control: "text" },
    className: { control: "text" },
  },
  args: {
    src: SAMPLE_VIDEO,
    ratio: "16:9",
    title: "Embedded Video",
    className: "",
  },
};

export default meta;

type Story = StoryObj<UiVideoComponent>;

// Default
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-3xl">
        <UiVideo
          [src]="src"
          [ratio]="ratio"
          [title]="title"
          [className]="className"
        />
      </div>
    `,
  }),
};

// Cada ratio
export const Ratio1x1: Story = {
  args: { ratio: "1:1", title: "1:1 (square)" },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-md">
        <UiVideo
          [src]="src"
          [ratio]="ratio"
          [title]="title"
        />
      </div>
    `,
  }),
};

export const Ratio4x3: Story = {
  args: { ratio: "4:3", title: "4:3" },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-2xl">
        <UiVideo
          [src]="src"
          [ratio]="ratio"
          [title]="title"
        />
      </div>
    `,
  }),
};

export const Ratio16x9: Story = {
  args: { ratio: "16:9", title: "16:9 (video)" },
};

export const Ratio21x9: Story = {
  args: { ratio: "21:9", title: "21:9 (cinema)" },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-4xl">
        <UiVideo
          [src]="src"
          [ratio]="ratio"
          [title]="title"
        />
      </div>
    `,
  }),
};

// Galería de los 4 ratios
export const AllRatios: Story = {
  render: () => ({
    template: `
      <div class="space-y-6 max-w-4xl">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            ratio="1:1"
          </h3>
          <div class="max-w-sm">
            <UiVideo
              src="${SAMPLE_VIDEO}"
              ratio="1:1"
              title="1:1 (square)"
            />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            ratio="4:3"
          </h3>
          <div class="max-w-xl">
            <UiVideo
              src="${SAMPLE_VIDEO}"
              ratio="4:3"
              title="4:3"
            />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            ratio="16:9" (default)
          </h3>
          <div class="max-w-2xl">
            <UiVideo
              src="${SAMPLE_VIDEO}"
              ratio="16:9"
              title="16:9 (video)"
            />
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            ratio="21:9"
          </h3>
          <div class="max-w-3xl">
            <UiVideo
              src="${SAMPLE_VIDEO}"
              ratio="21:9"
              title="21:9 (cinema)"
            />
          </div>
        </div>
      </div>
    `,
  }),
};

// Con className extra
export const WithCustomClassName: Story = {
  args: {
    ratio: "16:9",
    className: "shadow-lg max-w-md",
    title: "With shadow",
  },
  render: (args) => ({
    props: args,
    template: `
      <UiVideo
        [src]="src"
        [ratio]="ratio"
        [title]="title"
        [className]="className"
      />
    `,
  }),
};
