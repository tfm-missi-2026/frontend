import type { Meta, StoryObj } from "@storybook/angular";
import { applicationConfig, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { provideRouter } from "@angular/router";

import { UiCardComponent } from "@shared/ui/card";
import { UiLinkComponent } from "@shared/ui/link";
import { UiButtonComponent } from "@shared/ui/button";
import { UiIconButtonComponent } from "@shared/ui/icon-button";
import { UiBadgeComponent } from "@shared/ui/badge";
import { UiImageComponent } from "@shared/ui/image";
import { UiAvatarComponent } from "@shared/ui/avatar";
import { UiSeparatorComponent } from "@shared/ui/separator";
import {
  IconArrowRightComponent,
  IconBoxComponent,
  IconLinkComponent,
  IconPlusComponent,
  IconCheckComponent,
} from "@shared/icons";

const meta: Meta<UiCardComponent> = {
  title: "Shared/Card",
  component: UiCardComponent,
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
    moduleMetadata({
      imports: [
        CommonModule,
        UiCardComponent,
        UiLinkComponent,
        UiButtonComponent,
        UiIconButtonComponent,
        UiBadgeComponent,
        UiImageComponent,
        UiAvatarComponent,
        UiSeparatorComponent,
        IconBoxComponent,
        IconArrowRightComponent,
        IconLinkComponent,
        IconPlusComponent,
        IconCheckComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "elevated", "flat"],
    },
    className: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    badge: { control: "text" },
    badgeColor: {
      control: "select",
      options: [
        "primary",
        "success",
        "error",
        "warning",
        "info",
        "light",
        "dark",
      ],
    },
    badgeVariant: {
      control: "select",
      options: ["light", "solid"],
    },
    divider: { control: "boolean" },
  },
  args: {
    padding: "md",
    variant: "default",
    className: "max-w-sm",
    title: "Card title",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    badge: "",
    badgeColor: "primary",
    badgeVariant: "light",
    divider: false,
  },
};

export default meta;

type Story = StoryObj<UiCardComponent>;

// ===========================================================================
// Default
// ===========================================================================
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
        [badge]="badge"
        [badgeColor]="badgeColor"
        [badgeVariant]="badgeVariant"
        [divider]="divider"
      />
    `,
  }),
};

// ===========================================================================
// Variantes de padding
// ===========================================================================
export const PaddingNone: Story = { args: { padding: "none" } };
export const PaddingSm: Story = { args: { padding: "sm" } };
export const PaddingMd: Story = { args: { padding: "md" } };
export const PaddingLg: Story = { args: { padding: "lg" } };

// ===========================================================================
// Variantes visuales
// ===========================================================================
export const VariantDefault: Story = { args: { variant: "default" } };
export const VariantElevated: Story = { args: { variant: "elevated" } };
export const VariantFlat: Story = { args: { variant: "flat" } };

// ===========================================================================
// title y description: casos de uso
// ===========================================================================

// Solo description (sin title): la cabecera también se renderiza
export const WithDescriptionOnly: Story = {
  args: {
    title: "",
    description: "Solo descripción, sin título en la cabecera.",
  },
  render: (args) => ({
    props: args,
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
      />
    `,
  }),
};

// ===========================================================================
// Composición con otros componentes del design system
// ===========================================================================

// Card con badge integrado en la cabecera del propio componente
export const WithBadge: Story = {
  args: {
    title: "Pro Plan",
    description: "Acceso completo a todas las funciones premium del producto.",
    badge: "Popular",
    badgeColor: "primary",
    badgeVariant: "solid",
  },
  render: (args) => ({
    props: args,
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
        [badge]="badge"
        [badgeColor]="badgeColor"
        [badgeVariant]="badgeVariant"
      />
    `,
  }),
};

// Card con badge y divisor entre cabecera y contenido
export const WithBadgeAndDivider: Story = {
  args: {
    title: "Tarea completada",
    description: "El reporte mensual se generó correctamente.",
    badge: "Listo",
    badgeColor: "success",
    divider: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
        [badge]="badge"
        [badgeColor]="badgeColor"
        [divider]="divider"
      >
        <div class="text-sm text-gray-600 dark:text-gray-300">
          <p>Generado el 16 de junio de 2026</p>
          <p class="mt-1">12 páginas · 2.4 MB</p>
        </div>
      </UiCard>
    `,
  }),
};

// Card con badge "error" sólido + divisor
export const WithErrorBadge: Story = {
  args: {
    title: "Acción requerida",
    description: "Hay 3 facturas pendientes de revisión.",
    badge: "Urgente",
    badgeColor: "error",
    badgeVariant: "solid",
    divider: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
        [badge]="badge"
        [badgeColor]="badgeColor"
        [badgeVariant]="badgeVariant"
        [divider]="divider"
      />
    `,
  }),
};

// User profile card: avatar + title/description + acciones
export const UserProfile: Story = {
  args: {
    title: "Ada Lovelace",
    description: "Senior Frontend Engineer · Madrid, España",
  },
  render: (args) => ({
    props: { ...args, plusIcon: IconPlusComponent },
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
      >
        <div class="mt-4 flex items-center gap-3">
          <UiAvatar
            src="/images/user/user-01.jpg"
            alt="Ada Lovelace"
            size="medium"
            status="online"
          />
          <div class="flex-1 text-sm text-gray-500 dark:text-gray-400">
            Se unió en marzo de 2024
          </div>
        </div>
        <UiSeparator className="my-4"></UiSeparator>
        <div class="flex items-center gap-2">
          <UiButton label="Seguir" size="sm" [LeftIcon]="plusIcon"></UiButton>
          <UiButton label="Mensaje" variant="secondary" size="sm"></UiButton>
          <span class="flex-1"></span>
          <UiIconButton
            [Icon]="plusIcon"
            variant="tertiary"
            size="sm"
            ariaLabel="Agregar"
          ></UiIconButton>
        </div>
      </UiCard>
    `,
  }),
};

// Product card: imagen + badge overlay + title/description + button
export const ProductCard: Story = {
  args: {
    title: "Auriculares Noise-Cancel",
    description: "Cancelación activa de ruido y 30h de batería.",
  },
  render: (args) => ({
    props: { ...args, arrowRight: IconArrowRightComponent },
    template: `
      <UiCard
        padding="none"
        [variant]="variant"
        [className]="className + ' overflow-hidden'"
        [title]="title"
        [description]="description"
      >
        <div class="relative">
          <UiImage
            src="/images/cards/card-01.png"
            alt="Auriculares"
            [bordered]="false"
            rounded="none"
            className="h-48"
            height="h-48"
            width="w-full"
          />
          <div class="absolute left-3 top-3">
            <UiBadge color="error" variant="solid" size="sm">-20%</UiBadge>
          </div>
        </div>
        <div class="p-5 sm:p-6">
          <div class="mt-2 flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-800 dark:text-white/90">
              $159
              <span class="ml-2 text-sm font-medium text-gray-400 line-through">
                $199
              </span>
            </span>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <UiButton
              label="Comprar"
              size="sm"
              [RightIcon]="arrowRight"
              className="flex-1"
            ></UiButton>
          </div>
        </div>
      </UiCard>
    `,
  }),
};

// Card con ícono de marca + title/description + link "Read more"
export const WithReadMore: Story = {
  args: {
    title: "Card title",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
  render: (args) => ({
    props: { ...args, arrowRight: IconArrowRightComponent },
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
      >
        <UiLink
          to="/"
          variant="primary"
          size="sm"
          underline="none"
          [rightIcon]="arrowRight"
          className="mt-4 inline-flex items-center gap-1"
        >
          Read more
        </UiLink>
      </UiCard>
    `,
  }),
};

// Card con link tipo "Card link"
export const WithCardLink: Story = {
  args: {
    title: "Card title",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
  render: (args) => ({
    props: { ...args, linkIcon: IconLinkComponent },
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
      >
        <UiLink
          to="/"
          variant="primary"
          size="sm"
          underline="none"
          [leftIcon]="linkIcon"
          className="mt-4 inline-flex items-center gap-1"
        >
          Card link
        </UiLink>
      </UiCard>
    `,
  }),
};

// Card con ícono decorativo y title/description del componente
export const WithIcon: Story = {
  args: {
    title: "Card title",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
  render: (args) => ({
    props: args,
    template: `
      <UiCard
        [padding]="padding"
        [variant]="variant"
        [className]="className"
        [title]="title"
        [description]="description"
      >
        <div class="mb-5 flex h-14 max-w-14 items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500 dark:bg-brand-500/10">
          <IconBox [size]="28" />
        </div>
      </UiCard>
    `,
  }),
};

// Card horizontal: imagen a un lado + title/description + acciones
export const Horizontal: Story = {
  args: {
    title: "Card title",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  },
  render: (args) => ({
    props: { ...args, arrowRight: IconArrowRightComponent },
    template: `
      <UiCard
        padding="none"
        className="max-w-2xl"
        variant="default"
        [title]="title"
        [description]="description"
      >
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6 p-5">
          <UiImage
            src="/images/cards/card-01.png"
            alt="card"
            rounded="lg"
            [bordered]="false"
            className="shrink-0"
            width="sm:w-40"
            height="h-32"
          />
          <div class="flex-1">
            <UiLink
              to="/"
              variant="primary"
              size="sm"
              underline="none"
              [rightIcon]="arrowRight"
              className="mt-4 inline-flex items-center gap-1"
            >
              Read more
            </UiLink>
          </div>
        </div>
      </UiCard>
    `,
  }),
};

// Grid de cards combinando varias composiciones
export const Grid: Story = {
  render: () => ({
    template: `
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <UiCard
          title="Con ícono"
          description="Card con ícono decorativo y cabecera del propio componente."
        >
          <div class="mb-3 flex h-14 max-w-14 items-center justify-center rounded-[10.5px] bg-brand-50 text-brand-500 dark:bg-brand-500/10">
            <IconBox [size]="28" />
          </div>
        </UiCard>
        <UiCard
          variant="elevated"
          title="Con badge"
          description="Lenguaje consistente en toda la grid."
        >
          <div class="mt-2">
            <UiBadge color="primary" size="sm">Nuevo</UiBadge>
          </div>
        </UiCard>
        <UiCard
          variant="flat"
          title="Minimalista"
          description="Solo la cabecera y el padding del card."
        />
      </div>
    `,
  }),
};
