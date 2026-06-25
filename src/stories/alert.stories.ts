import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiAlertComponent } from "@shared/ui/alert";

const meta: Meta<UiAlertComponent> = {
  title: "Shared/Alert",
  component: UiAlertComponent,
  decorators: [moduleMetadata({ imports: [UiAlertComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
    title: { control: "text" },
    message: { control: "text" },
    showLink: { control: "boolean" },
    linkHref: { control: "text" },
    linkText: { control: "text" },
    className: { control: "text" },
  },
  args: {
    variant: "info",
    title: "Heads up!",
    message: "Be cautious when performing this action.",
    showLink: true,
    linkHref: "/",
    linkText: "Learn more",
  },
};

export default meta;

type Story = StoryObj<UiAlertComponent>;

// Default
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-2xl">
        <UiAlert
          [variant]="variant"
          [title]="title"
          [message]="message"
          [showLink]="showLink"
          [linkHref]="linkHref"
          [linkText]="linkText"
        />
      </div>
    `,
  }),
};

// All variants
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 max-w-2xl">
        <UiAlert
          variant="success"
          title="Success Message"
          message="Your changes have been saved successfully."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
        <UiAlert
          variant="warning"
          title="Warning Message"
          message="Be cautious when performing this action."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
        <UiAlert
          variant="error"
          title="Error Message"
          message="Something went wrong. Please try again."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
        <UiAlert
          variant="info"
          title="Info Message"
          message="This is an informational message."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </div>
    `,
  }),
};

// Link
export const WithLink: Story = {
  args: {
    variant: "success",
    showLink: true,
    linkHref: "/docs/getting-started",
    linkText: "Read the docs",
  },
};

export const WithoutLink: Story = {
  args: {
    variant: "warning",
    showLink: false,
  },
};

// Custom
export const MessageOnly: Story = {
  args: {
    variant: "info",
    title: "",
    message: "A short, single-line informational note.",
    showLink: false,
  },
};

export const CustomLink: Story = {
  args: {
    variant: "error",
    title: "Action required",
    message: "You need to verify your email before continuing.",
    showLink: true,
    linkHref: "/auth/verify",
    linkText: "Verify now",
  },
};

// Variants
export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    message: "Operation completed.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    message: "Proceed with caution.",
  },
};

export const Error: Story = {
  args: { variant: "error", title: "Error", message: "Operation failed." },
};

export const Info: Story = {
  args: { variant: "info", title: "Info", message: "Just so you know." },
};
