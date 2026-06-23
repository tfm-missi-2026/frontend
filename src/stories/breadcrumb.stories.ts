import type { Meta, StoryObj } from "@storybook/angular";
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { provideRouter } from "@angular/router";

import { CommonBreadcrumbComponent } from "@shared/common/page-breadcrumb";
import type {
  CommonBreadcrumbItem,
  CommonBreadcrumbProps,
} from "@shared/common/page-breadcrumb";

const meta: Meta<CommonBreadcrumbComponent> = {
  title: "Common/Breadcrumb",
  component: CommonBreadcrumbComponent,
  decorators: [
    applicationConfig({ providers: [provideRouter([])] }),
    moduleMetadata({ imports: [CommonBreadcrumbComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    items: { control: "object" },
    pageTitle: { control: "text" },
    homeLabel: { control: "text" },
    homeRoute: { control: "text" },
    className: { control: "text" },
  },
  args: {
    items: [],
    pageTitle: "Blank Page",
    homeLabel: "Home",
    homeRoute: "/",
  },
  render: (args: CommonBreadcrumbProps) => ({
    props: args,
    template: `
      <CommonBreadcrumb
        [items]="items"
        [pageTitle]="pageTitle"
        [homeLabel]="homeLabel"
        [homeRoute]="homeRoute"
        [className]="className"
      />
    `,
  }),
};

export default meta;

type Story = StoryObj<CommonBreadcrumbComponent>;

export const Default: Story = {};

// Atajo: solo `pageTitle` genera un trail de 2 segmentos.
export const WithPageTitleShortcut: Story = {
  args: { pageTitle: "Profile" },
};

// Trail completo con múltiples segmentos intermedios.
export const FullTrail: Story = {
  args: {
    items: [
      { label: "Home", route: "/" },
      { label: "Ecommerce", route: "/ecommerce" },
      { label: "Products", route: "/ecommerce/products" },
      { label: "Macbook Pro M4" },
    ] satisfies CommonBreadcrumbItem[],
  },
};

// Un solo segmento custom (sin home).
export const SingleSegment: Story = {
  args: {
    items: [{ label: "Single page" }],
  },
};

// Sin items ni pageTitle: breadcrumb invisible.
export const Empty: Story = {
  args: { items: [], pageTitle: "" },
};

// Home label custom.
export const CustomHomeLabel: Story = {
  args: { pageTitle: "Dashboard", homeLabel: "Inicio" },
};
