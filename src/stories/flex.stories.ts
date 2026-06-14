import type { Meta, StoryObj } from '@storybook/angular';
import { UiFlexComponent } from '@ui/flex/flex';

const meta: Meta<UiFlexComponent> = {
  title: 'Shared/Flex',
  component: UiFlexComponent,

  tags: ['autodocs'],

  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column'],
    },

    justifyContent: {
      control: 'select',
      options: [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },

    alignItems: {
      control: 'select',
      options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
    },

    gap: {
      control: 'text',
    },

    flex: {
      control: 'text',
    },

    overflow: {
      control: 'select',
      options: ['visible', 'hidden', 'scroll', 'auto'],
    },

    noWrap: {
      control: 'boolean',
    },

    shrinkable: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<UiFlexComponent>;

export const Default: Story = {
  args: {
    direction: 'row',
    gap: '16px',
  },

  render: (args) => ({
    props: args,

    template: `
      <UiFlex
        [direction]="direction"
        [justifyContent]="justifyContent"
        [alignItems]="alignItems"
        [gap]="gap"
        [flex]="flex"
        [overflow]="overflow"
        [noWrap]="noWrap"
        [shrinkable]="shrinkable"
      >
        <div class="bg-red-500 text-white p-4 rounded-xl">
          Item 1
        </div>

        <div class="bg-blue-500 text-white p-4 rounded-xl">
          Item 2
        </div>

        <div class="bg-green-500 text-white p-4 rounded-xl">
          Item 3
        </div>
      </UiFlex>
    `,
  }),
};

export const Column: Story = {
  args: {
    direction: 'row',
    gap: '12px',
  },

  render: (args) => ({
    props: args,

    template: `
      <UiFlex
        [direction]="direction"
        [gap]="gap"
      >
        <div class="bg-purple-500 text-white p-4 rounded-xl">
          Uno
        </div>

        <div class="bg-pink-500 text-white p-4 rounded-xl">
          Dos
        </div>

        <div class="bg-orange-500 text-white p-4 rounded-xl">
          Tres
        </div>
      </UiFlex>
    `,
  }),
};

export const Centered: Story = {
  args: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
  },

  render: (args) => ({
    props: args,

    template: `
      <div class="h-64 border rounded-xl">
        <UiFlex
          class="h-full"
          [justifyContent]="justifyContent"
          [alignItems]="alignItems"
          [gap]="gap"
        >
          <div class="bg-cyan-500 text-white p-4 rounded-xl">
            A
          </div>

          <div class="bg-emerald-500 text-white p-4 rounded-xl">
            B
          </div>
        </UiFlex>
      </div>
    `,
  }),
};

export const NoWrap: Story = {
  args: {
    noWrap: true,
    overflow: 'auto',
    gap: '12px',
  },

  render: (args) => ({
    props: args,

    template: `
      <div class="w-80 border rounded-xl p-2">
        <UiFlex
          [noWrap]="noWrap"
          [overflow]="overflow"
          [gap]="gap"
        >
          <div class="min-w-40 bg-red-500 text-white p-4 rounded-xl">
            Item largo
          </div>

          <div class="min-w-40 bg-blue-500 text-white p-4 rounded-xl">
            Item largo
          </div>

          <div class="min-w-40 bg-green-500 text-white p-4 rounded-xl">
            Item largo
          </div>

          <div class="min-w-40 bg-purple-500 text-white p-4 rounded-xl">
            Item largo
          </div>
        </UiFlex>
      </div>
    `,
  }),
};

export const Shrinkable: Story = {
  args: {
    direction: 'row',
    shrinkable: true,
    gap: '12px',
  },

  render: (args) => ({
    props: args,

    template: `
      <div class="w-96 border rounded-xl p-4">
        <UiFlex
          [direction]="direction"
          [shrinkable]="shrinkable"
          [gap]="gap"
        >
          <div class="bg-indigo-500 text-white p-4 rounded-xl whitespace-nowrap">
            Contenido extremadamente largo que necesita shrink
          </div>

          <div class="bg-rose-500 text-white p-4 rounded-xl">
            Item
          </div>
        </UiFlex>
      </div>
    `,
  }),
};
