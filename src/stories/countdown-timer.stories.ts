import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { CommonCountdownTimerComponent } from "@shared/common/countdown-timer";

function dateIn(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000);
}

const meta: Meta<CommonCountdownTimerComponent> = {
  title: "Common/Countdown",
  component: CommonCountdownTimerComponent,
  decorators: [
    moduleMetadata({ imports: [CommonCountdownTimerComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    targetDate: { control: "date" },
  },
  args: {
    targetDate: dateIn(7 * 24 * 60 * 60),
  },
  render: (args) => ({
    props: { ...args, target: args.targetDate ?? dateIn(0) },
    template: `<CommonCountdown [targetDate]="target" />`,
  }),
};

export default meta;

type Story = StoryObj<CommonCountdownTimerComponent>;

// 7 días hacia adelante
export const Default: Story = {};

// 1 día hacia adelante
export const OneDay: Story = {
  args: { targetDate: dateIn(24 * 60 * 60) },
};

// 2 horas hacia adelante
export const TwoHours: Story = {
  args: { targetDate: dateIn(2 * 60 * 60) },
};

// Ya expirado: el signal `expired` queda en true
export const Expired: Story = {
  args: { targetDate: dateIn(-60) },
};