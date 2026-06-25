import type { Meta, StoryObj } from "@storybook/angular";
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideRouter } from "@angular/router";

import { UiAvatarComponent } from "@shared/ui/avatar";
import { UiSurfaceComponent } from "@shared/ui/surface";

const SAMPLE_SRC = "/images/user/user-01.jpg";

const meta: Meta<UiAvatarComponent> = {
  title: "Shared/Avatar",
  component: UiAvatarComponent,
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({
      imports: [UiAvatarComponent, UiSurfaceComponent],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large", "xlarge", "xxlarge"],
    },
    status: {
      control: "select",
      options: ["none", "online", "offline", "busy"],
    },
  },
  args: {
    src: SAMPLE_SRC,
    alt: "User Avatar",
    size: "medium",
    status: "none",
  },
};

export default meta;

type Story = StoryObj<UiAvatarComponent>;

// Interactive — avatar único bindeado a los controles del meta
export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `
      <UiSurface className="max-w-2xl">
        <UiAvatar
          [src]="src"
          [alt]="alt"
          [size]="size"
          [status]="status"
        />
      </UiSurface>
    `,
  }),
};

// AllSizes — un UiAvatar independiente por cada size, con status online
export const AllSizes: Story = {
  render: () => ({
    props: {
      avatars: [
        { id: "xsmall", size: "xsmall" },
        { id: "small", size: "small" },
        { id: "medium", size: "medium" },
        { id: "large", size: "large" },
        { id: "xlarge", size: "xlarge" },
        { id: "xxlarge", size: "xxlarge" },
      ],
    },
    template: `
      <UiSurface className="max-w-2xl">
        <div class="flex flex-wrap items-end gap-6">
          @for (avatar of avatars; track avatar.id) {
            <div class="flex flex-col items-center gap-1">
              <UiAvatar
                src="${SAMPLE_SRC}"
                [size]="avatar.size"
                status="online"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ avatar.size }}
              </span>
            </div>
          }
        </div>
      </UiSurface>
    `,
  }),
};

// Dark — los 4 estados forzados a tema oscuro vía clase .dark en el contenedor
export const Dark: Story = {
  render: () => ({
    props: {
      avatars: [
        { id: "online", status: "online" },
        { id: "offline", status: "offline" },
        { id: "busy", status: "busy" },
        { id: "none", status: "none" },
      ],
    },
    template: `
      <UiSurface variant="neutral" className="dark bg-gray-900 max-w-2xl">
        <div class="flex flex-wrap items-center gap-6">
          @for (avatar of avatars; track avatar.id) {
            <div class="flex flex-col items-center gap-1">
              <UiAvatar
                src="${SAMPLE_SRC}"
                size="large"
                [status]="avatar.status"
              />
              <span class="text-xs text-gray-400">
                {{ avatar.status }}
              </span>
            </div>
          }
        </div>
      </UiSurface>
    `,
  }),
};