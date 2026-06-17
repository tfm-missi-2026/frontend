import type { Meta, StoryObj } from "@storybook/angular";
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { provideRouter } from "@angular/router";

import { UiLinkComponent } from "@shared/ui/link";
import {
  IconChevronRightComponent,
  IconEditLightComponent,
  IconExternalLinkComponent,
  IconInfoCircleComponent,
  IconPlusComponent,
  IconTrashLightComponent,
} from "@shared/ui/icon";

const meta: Meta<UiLinkComponent> = {
  title: "Shared/Link",
  component: UiLinkComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
    moduleMetadata({
      imports: [
        CommonModule,
        IconExternalLinkComponent,
        IconInfoCircleComponent,
        IconChevronRightComponent,
        IconEditLightComponent,
        IconPlusComponent,
        IconTrashLightComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    to: { control: "text" },
    href: { control: "text" },
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "subtle", "unstyled"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    underline: {
      control: "select",
      options: ["hover", "always", "none"],
    },
    disabled: { control: "boolean" },
    target: { control: "text" },
    rel: { control: "text" },
    labelText: { control: "text" },
    className: { control: "text" },
  },
  args: {
    to: "/profile",
    href: undefined,
    variant: "primary",
    size: "md",
    underline: "hover",
    disabled: false,
    target: undefined,
    rel: undefined,
    className: "",
  },
  render: (args) => ({
    props: args,
    template: `
      <span class="p-6 inline-block bg-white dark:bg-gray-900 min-h-20">
        <UiLink
          [to]="to"
          [href]="href"
          [variant]="variant"
          [size]="size"
          [underline]="underline"
          [disabled]="disabled"
          [target]="target"
          [rel]="rel"
          [labelText]="labelText"
          [className]="className"
        >
          {{ labelText || 'Mi perfil' }}
        </UiLink>
      </span>
    `,
  }),
};

export default meta;

type Story = StoryObj<UiLinkComponent>;

// Default — link interno (routerLink)
export const Default: Story = {};

// Variantes de color
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Danger: Story = { args: { variant: "danger" } };
export const Subtle: Story = { args: { variant: "subtle" } };
export const Unstyled: Story = { args: { variant: "unstyled" } };

// Tamaños
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };

// Subrayado
export const HoverUnderline: Story = { args: { underline: "hover" } };
export const AlwaysUnderline: Story = { args: { underline: "always" } };
export const NoUnderline: Story = { args: { underline: "none" } };

// Link externo
export const External: Story = {
  args: {
    href: "https://angular.dev",
    target: "_blank",
    leftIcon: IconExternalLinkComponent,
    labelText: "Angular docs",
  },
};

export const ExternalRightIcon: Story = {
  args: {
    href: "https://tailwindcss.com",
    target: "_blank",
    rightIcon: IconExternalLinkComponent,
    labelText: "Tailwind CSS",
  },
};

// Disabled
export const Disabled: Story = {
  args: { disabled: true, labelText: "No navegable" },
};

export const DisabledWithIcon: Story = {
  args: {
    disabled: true,
    leftIcon: IconInfoCircleComponent,
    labelText: "No navegable con ícono",
  },
};

// Con íconos
export const WithLeftIcon: Story = {
  args: {
    to: "/docs",
    leftIcon: IconChevronRightComponent,
    labelText: "Continuar leyendo",
  },
};

export const WithEditIcon: Story = {
  args: {
    to: "/edit",
    leftIcon: IconEditLightComponent,
    variant: "secondary",
    labelText: "Editar perfil",
  },
};

export const WithRightIcon: Story = {
  args: {
    to: "/new",
    rightIcon: IconPlusComponent,
    variant: "subtle",
    labelText: "Crear nuevo",
  },
};

export const WithTrashIcon: Story = {
  args: {
    to: "/delete",
    leftIcon: IconTrashLightComponent,
    variant: "danger",
    labelText: "Eliminar",
  },
};

// Custom HTML (necesita render por el slot con HTML arbitrario)
export const CustomHtml: Story = {
  render: () => ({
    template: `
      <div class="p-6 flex flex-col items-start gap-3 bg-white dark:bg-gray-900 min-h-40">
        <UiLink to="/docs" className="inline-flex items-center gap-2">
          <span class="font-semibold">Docs</span>
          <span class="px-1.5 py-0.5 text-xs rounded bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            v21
          </span>
        </UiLink>

        <UiLink to="/changelog" underline="always">
          <em>Changelog</em> &middot; <small>última versión</small>
        </UiLink>
      </div>
    `,
  }),
};

// Caso real — lista con links
export const InList: Story = {
  render: () => ({
    template: `
      <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
        <li class="py-3 px-4 flex items-center justify-between">
          <span class="text-sm text-gray-700 dark:text-gray-200">Documentación</span>
          <UiLink to="/docs" [rightIcon]="chevronIcon" variant="primary">
            Abrir
          </UiLink>
        </li>
        <li class="py-3 px-4 flex items-center justify-between">
          <span class="text-sm text-gray-700 dark:text-gray-200">Angular (externo)</span>
          <UiLink
            href="https://angular.dev"
            target="_blank"
            [leftIcon]="externalIcon"
            variant="subtle"
          >
            Visitar
          </UiLink>
        </li>
        <li class="py-3 px-4 flex items-center justify-between">
          <span class="text-sm text-gray-700 dark:text-gray-200">Soporte</span>
          <UiLink to="/support" variant="danger" [leftIcon]="trashIcon">
            Reportar problema
          </UiLink>
        </li>
      </ul>
    `,
    props: {
      chevronIcon: IconChevronRightComponent,
      externalIcon: IconExternalLinkComponent,
      trashIcon: IconTrashLightComponent,
    },
  }),
};
