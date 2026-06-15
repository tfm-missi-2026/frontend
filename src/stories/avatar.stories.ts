import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiAvatarComponent, UiAvatarTextComponent } from "@shared/ui/avatar";

const SAMPLE_SRC = "/images/user/user-01.jpg";

const SIZES = [
  "xsmall",
  "small",
  "medium",
  "large",
  "xlarge",
  "xxlarge",
] as const;

const SAMPLE_NAMES = [
  "Ada Lovelace",
  "Grace Hopper",
  "Linus Torvalds",
  "Margaret Hamilton",
  "Alan Turing",
  "Dennis Ritchie",
];

const meta: Meta<UiAvatarComponent> = {
  title: "Shared/Avatar",
  component: UiAvatarComponent,
  decorators: [
    moduleMetadata({ imports: [UiAvatarComponent, UiAvatarTextComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    size: {
      control: "select",
      options: [...SIZES],
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

// Default
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6">
        <UiAvatar
          [src]="src"
          [alt]="alt"
          [size]="size"
          [status]="status"
        />
      </div>
    `,
  }),
};

// Tamaños
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          Tamaños disponibles
        </h3>
        <div class="flex flex-wrap items-end gap-6 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatar src="${SAMPLE_SRC}" size="xsmall" />
            <span class="text-[10px]">xsmall</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatar src="${SAMPLE_SRC}" size="small" />
            <span class="text-[10px]">small</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatar src="${SAMPLE_SRC}" size="medium" />
            <span class="text-[10px]">medium</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatar src="${SAMPLE_SRC}" size="large" />
            <span class="text-[10px]">large</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatar src="${SAMPLE_SRC}" size="xlarge" />
            <span class="text-[10px]">xlarge</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatar src="${SAMPLE_SRC}" size="xxlarge" />
            <span class="text-[10px]">xxlarge</span>
          </div>
        </div>
      </div>
    `,
  }),
};

// Estado online
export const WithOnlineStatus: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          status="online"
        </h3>
        <div class="flex flex-wrap items-center gap-5 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <UiAvatar src="${SAMPLE_SRC}" size="xsmall" status="online" />
          <UiAvatar src="${SAMPLE_SRC}" size="small" status="online" />
          <UiAvatar src="${SAMPLE_SRC}" size="medium" status="online" />
          <UiAvatar src="${SAMPLE_SRC}" size="large" status="online" />
          <UiAvatar src="${SAMPLE_SRC}" size="xlarge" status="online" />
          <UiAvatar src="${SAMPLE_SRC}" size="xxlarge" status="online" />
        </div>
      </div>
    `,
  }),
};

// Estado offline
export const WithOfflineStatus: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          status="offline"
        </h3>
        <div class="flex flex-wrap items-center gap-5 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <UiAvatar src="${SAMPLE_SRC}" size="xsmall" status="offline" />
          <UiAvatar src="${SAMPLE_SRC}" size="small" status="offline" />
          <UiAvatar src="${SAMPLE_SRC}" size="medium" status="offline" />
          <UiAvatar src="${SAMPLE_SRC}" size="large" status="offline" />
          <UiAvatar src="${SAMPLE_SRC}" size="xlarge" status="offline" />
          <UiAvatar src="${SAMPLE_SRC}" size="xxlarge" status="offline" />
        </div>
      </div>
    `,
  }),
};

// Estado busy
export const WithBusyStatus: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          status="busy"
        </h3>
        <div class="flex flex-wrap items-center gap-5 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <UiAvatar src="${SAMPLE_SRC}" size="xsmall" status="busy" />
          <UiAvatar src="${SAMPLE_SRC}" size="small" status="busy" />
          <UiAvatar src="${SAMPLE_SRC}" size="medium" status="busy" />
          <UiAvatar src="${SAMPLE_SRC}" size="large" status="busy" />
          <UiAvatar src="${SAMPLE_SRC}" size="xlarge" status="busy" />
          <UiAvatar src="${SAMPLE_SRC}" size="xxlarge" status="busy" />
        </div>
      </div>
    `,
  }),
};

// Todos los estados juntos
export const AllStatuses: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-6">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            online / offline / busy / none
          </h3>
          <div class="flex flex-wrap items-center gap-5 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
            <UiAvatar src="${SAMPLE_SRC}" size="large" status="online" />
            <UiAvatar src="${SAMPLE_SRC}" size="large" status="offline" />
            <UiAvatar src="${SAMPLE_SRC}" size="large" status="busy" />
            <UiAvatar src="${SAMPLE_SRC}" size="large" status="none" />
          </div>
        </div>
      </div>
    `,
  }),
};

// AvatarText
export const AvatarTextGallery: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          UiAvatarText — iniciales derivadas del nombre
        </h3>
        <div class="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatarText name="Ada Lovelace" />
            <span class="text-[10px]">Ada Lovelace</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatarText name="Grace Hopper" />
            <span class="text-[10px]">Grace Hopper</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatarText name="Linus Torvalds" />
            <span class="text-[10px]">Linus Torvalds</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatarText name="Margaret Hamilton" />
            <span class="text-[10px]">Margaret Hamilton</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatarText name="Alan Turing" />
            <span class="text-[10px]">Alan Turing</span>
          </div>
          <div class="flex flex-col items-center gap-1 text-gray-500">
            <UiAvatarText name="Dennis Ritchie" />
            <span class="text-[10px]">Dennis Ritchie</span>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
          El color de fondo se calcula con un hash estable del nombre, así
          la misma persona siempre obtiene la misma paleta.
        </p>
      </div>
    `,
  }),
};

// AvatarText con className extra
export const AvatarTextWithClassName: Story = {
  render: () => ({
    template: `
      <div class="p-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
          UiAvatarText con className adicional
        </h3>
        <div class="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/3">
          <UiAvatarText name="Ada Lovelace" className="shadow-md ring-2 ring-brand-300" />
          <UiAvatarText name="Grace Hopper" className="shadow-md ring-2 ring-pink-300" />
        </div>
      </div>
    `,
  }),
};
