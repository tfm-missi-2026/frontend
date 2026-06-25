import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import {
  UiImageComponent,
  ObjectFit,
  RoundedSize,
  ImageLoading,
} from "@shared/ui/image";

const ROUNDEDS: RoundedSize[] = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "full",
];
const OBJECT_FITS: ObjectFit[] = [
  "cover",
  "contain",
  "fill",
  "none",
  "scale-down",
];
const LOADINGS: ImageLoading[] = ["lazy", "eager"];

const meta: Meta<UiImageComponent> = {
  title: "Shared/Image",
  component: UiImageComponent,
  decorators: [moduleMetadata({ imports: [UiImageComponent] })],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    rounded: { control: "select", options: ROUNDEDS },
    bordered: { control: "boolean" },
    objectFit: { control: "select", options: OBJECT_FITS },
    width: { control: "text" },
    height: { control: "text" },
    loading: { control: "select", options: LOADINGS },
    fallbackSrc: { control: "text" },
    className: { control: "text" },
    imageError: { action: "imageError" },
  },
  args: {
    src: "/images/grid-image/image-01.png",
    alt: "Cover",
    rounded: "xl",
    bordered: true,
    objectFit: "cover",
    width: "w-full",
    height: "h-auto",
    loading: "lazy",
    fallbackSrc: "",
    className: "",
  },
};

export default meta;

type Story = StoryObj<UiImageComponent>;

// Default
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-md">
        <UiImage
          [src]="src"
          [alt]="alt"
          [rounded]="rounded"
          [bordered]="bordered"
          [objectFit]="objectFit"
          [width]="width"
          [height]="height"
          [loading]="loading"
          [fallbackSrc]="fallbackSrc"
          [className]="className"
          (imageError)="imageError($event)"
        />
      </div>
    `,
  }),
};

// Empty / sin src → renderiza solo el contenedor con el placeholder
export const WithBrokenSrc: Story = {
  args: { src: "/images/does-not-exist.png", alt: "Imagen rota" },
};

// Loading eager (sin lazy)
export const EagerLoading: Story = {
  args: { loading: "eager" },
};

// Sin borde
export const WithoutBorder: Story = {
  args: { bordered: false },
};

// Variantes de rounded
export const RoundedVariants: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Variantes de <code class="px-1 rounded bg-gray-200 dark:bg-white/10 text-xs">rounded</code>
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="none" rounded="none" />
            <span class="text-xs text-gray-500">none</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="sm" rounded="sm" />
            <span class="text-xs text-gray-500">sm</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="md" rounded="md" />
            <span class="text-xs text-gray-500">md</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="lg" rounded="lg" />
            <span class="text-xs text-gray-500">lg</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="xl" rounded="xl" />
            <span class="text-xs text-gray-500">xl (default)</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="2xl" rounded="2xl" />
            <span class="text-xs text-gray-500">2xl</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="3xl" rounded="3xl" />
            <span class="text-xs text-gray-500">3xl</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="full" rounded="full" />
            <span class="text-xs text-gray-500">full</span>
          </div>
        </div>
      </div>
    `,
  }),
};

// Variantes de object-fit
export const ObjectFitVariants: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Variantes de <code class="px-1 rounded bg-gray-200 dark:bg-white/10 text-xs">objectFit</code>
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Se aplica sobre un contenedor de 240×160 para que el efecto sea visible.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="cover" objectFit="cover" className="w-60 h-40" />
            <span class="text-xs text-gray-500">cover (default)</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="contain" objectFit="contain" className="w-60 h-40" />
            <span class="text-xs text-gray-500">contain</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="fill" objectFit="fill" className="w-60 h-40" />
            <span class="text-xs text-gray-500">fill</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="none" objectFit="none" className="w-60 h-40" />
            <span class="text-xs text-gray-500">none</span>
          </div>
          <div class="space-y-1">
            <UiImage src="/images/grid-image/image-01.png" alt="scale-down" objectFit="scale-down" className="w-60 h-40" />
            <span class="text-xs text-gray-500">scale-down</span>
          </div>
        </div>
      </div>
    `,
  }),
};

// Responsive (mismo componente se adapta al ancho del padre)
export const Responsive: Story = {
  render: () => ({
    template: `
      <div class="p-6 space-y-6">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Mismo componente, distintos contenedores
        </h3>
        <div class="space-y-3">
          <UiImage src="/images/grid-image/image-01.png" alt="Full" className="w-full" />
          <UiImage src="/images/grid-image/image-01.png" alt="Medium" className="w-1/2" />
          <UiImage src="/images/grid-image/image-01.png" alt="Small" className="w-1/4" />
        </div>
      </div>
    `,
  }),
};

// Con fallbackSrc
export const WithFallback: Story = {
  args: {
    src: "/images/does-not-exist.png",
    fallbackSrc: "/images/grid-image/image-02.png",
    alt: "Imagen con fallback",
  },
};

// Disabled (clase para grisar) — el componente no es interactivo pero
// el consumidor puede pasar className para forzar el estado.
export const Disabled: Story = {
  args: {
    className: "opacity-50 pointer-events-none grayscale",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-md">
        <UiImage
          [src]="src"
          [alt]="alt"
          [rounded]="rounded"
          [bordered]="bordered"
          [objectFit]="objectFit"
          [className]="className"
        />
      </div>
    `,
  }),
};
