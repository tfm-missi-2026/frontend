import { UserProfileMetaCardComponent } from "@shared/user-profile";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

const meta: Meta<UserProfileMetaCardComponent> = {
  title: "UserProfile/MetaCard",
  component: UserProfileMetaCardComponent,
  decorators: [moduleMetadata({ imports: [UserProfileMetaCardComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<UserProfileMetaCardComponent>;

export const Default: Story = {};

export const InContainer: Story = {
  render: () => ({
    template: `
      <div style="max-width: 720px; margin: 0 auto;">
        <UserProfileMetaCard />
      </div>
    `,
  }),
};
