import { UserProfileInfoCardComponent } from "@shared/user-profile";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

const meta: Meta<UserProfileInfoCardComponent> = {
  title: "UserProfile/InfoCard",
  component: UserProfileInfoCardComponent,
  decorators: [moduleMetadata({ imports: [UserProfileInfoCardComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<UserProfileInfoCardComponent>;

export const Default: Story = {};

export const InContainer: Story = {
  render: () => ({
    template: `
      <div style="max-width: 960px; margin: 0 auto;">
        <UserProfileInfoCard />
      </div>
    `,
  }),
};
