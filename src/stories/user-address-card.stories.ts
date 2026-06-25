import { UserProfileAddressCardComponent } from "@shared/user-profile";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

const meta: Meta<UserProfileAddressCardComponent> = {
  title: "UserProfile/AddressCard",
  component: UserProfileAddressCardComponent,
  decorators: [moduleMetadata({ imports: [UserProfileAddressCardComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<UserProfileAddressCardComponent>;

export const Default: Story = {};

export const InContainer: Story = {
  render: () => ({
    template: `
      <div style="max-width: 960px; margin: 0 auto;">
        <UserProfileAddressCard />
      </div>
    `,
  }),
};
