import type { Meta, StoryObj } from "@storybook/angular";
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideRouter } from "@angular/router";

import { UiAlertComponent } from "@shared/ui/alert";
import { UiSurfaceComponent } from "@shared/ui/surface";

const meta: Meta<UiAlertComponent> = {
  title: "Shared/Alert",
  component: UiAlertComponent,
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({
      imports: [UiAlertComponent, UiSurfaceComponent],
    }),
  ],
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

// Interactive — alert único bindeado a los controles del meta
export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `
      <UiSurface className="max-w-2xl">
        <UiAlert
          [variant]="variant"
          [title]="title"
          [message]="message"
          [showLink]="showLink"
          [linkHref]="linkHref"
          [linkText]="linkText"
          [className]="className"
        />
      </UiSurface>
    `,
  }),
};

// Light variants — un UiAlert independiente por story
export const Success: Story = {
  render: () => ({
    template: `
      <UiSurface className="max-w-2xl">
        <UiAlert
          variant="success"
          title="Success Message"
          message="Your changes have been saved successfully."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </UiSurface>
    `,
  }),
};

export const Warning: Story = {
  render: () => ({
    template: `
      <UiSurface className="max-w-2xl">
        <UiAlert
          variant="warning"
          title="Warning Message"
          message="Be cautious when performing this action."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </UiSurface>
    `,
  }),
};

export const Error: Story = {
  render: () => ({
    template: `
      <UiSurface className="max-w-2xl">
        <UiAlert
          variant="error"
          title="Error Message"
          message="Something went wrong. Please try again."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </UiSurface>
    `,
  }),
};

export const Info: Story = {
  render: () => ({
    template: `
      <UiSurface className="max-w-2xl">
        <UiAlert
          variant="info"
          title="Info Message"
          message="This is an informational message."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </UiSurface>
    `,
  }),
};

// Dark variants — un UiAlert independiente por story, dentro de UiSurface con clase .dark
export const SuccessDark: Story = {
  render: () => ({
    template: `
      <UiSurface variant="neutral" className="dark bg-gray-900 max-w-2xl">
        <UiAlert
          variant="success"
          title="Success Message"
          message="Your changes have been saved successfully."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </UiSurface>
    `,
  }),
};

export const WarningDark: Story = {
  render: () => ({
    template: `
      <UiSurface variant="neutral" className="dark bg-gray-900 max-w-2xl">
        <UiAlert
          variant="warning"
          title="Warning Message"
          message="Be cautious when performing this action."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </UiSurface>
    `,
  }),
};

export const ErrorDark: Story = {
  render: () => ({
    template: `
      <UiSurface variant="neutral" className="dark bg-gray-900 max-w-2xl">
        <UiAlert
          variant="error"
          title="Error Message"
          message="Something went wrong. Please try again."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </UiSurface>
    `,
  }),
};

export const InfoDark: Story = {
  render: () => ({
    template: `
      <UiSurface variant="neutral" className="dark bg-gray-900 max-w-2xl">
        <UiAlert
          variant="info"
          title="Info Message"
          message="This is an informational message."
          [showLink]="true"
          linkHref="/"
          linkText="Learn more"
        />
      </UiSurface>
    `,
  }),
};