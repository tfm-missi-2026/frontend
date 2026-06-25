import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiGridComponent, GridBreakpoint, GridColumns } from "@shared/ui/grid";
import { UiImageComponent } from "@shared/ui/image";

const BREAKPOINTS: GridBreakpoint[] = ["sm", "md", "lg", "xl", "2xl"];
const COLUMNS: GridColumns[] = [2, 3, 4, 5, 6];

const SAMPLE_IMAGES: Array<{ src: string; alt: string }> = [
  { src: "/images/grid-image/image-01.png", alt: "Imagen 1" },
  { src: "/images/grid-image/image-02.png", alt: "Imagen 2" },
  { src: "/images/grid-image/image-03.png", alt: "Imagen 3" },
  { src: "/images/grid-image/image-04.png", alt: "Imagen 4" },
  { src: "/images/grid-image/image-05.png", alt: "Imagen 5" },
  { src: "/images/grid-image/image-06.png", alt: "Imagen 6" },
];

const meta: Meta<UiGridComponent> = {
  title: "Shared/Grid",
  component: UiGridComponent,
  decorators: [
    moduleMetadata({ imports: [UiGridComponent, UiImageComponent] }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    columns: { control: "select", options: COLUMNS },
    breakpoint: { control: "select", options: BREAKPOINTS },
    gap: { control: "text" },
    ariaLabel: { control: "text" },
    className: { control: "text" },
  },
  args: {
    columns: 2,
    breakpoint: "sm",
    gap: "gap-5",
    ariaLabel: "Galería",
    className: "",
  },
};

export default meta;

type Story = StoryObj<UiGridComponent>;

// Default (2 columnas con UiImage)
export const Default: Story = {
  render: (args) => ({
    props: { ...args, items: SAMPLE_IMAGES.slice(0, 2) },
    template: `
      <UiGrid
        [columns]="columns"
        [breakpoint]="breakpoint"
        [gap]="gap"
        [ariaLabel]="ariaLabel"
        [className]="className"
      >
        @for (item of items; track item.src) {
          <UiImage [src]="item.src" [alt]="item.alt" />
        }
      </UiGrid>
    `,
  }),
};

// Empty / sin hijos
export const Empty: Story = {
  render: (args) => ({
    props: args,
    template: `
      <UiGrid
        [columns]="columns"
        [breakpoint]="breakpoint"
        [gap]="gap"
        [ariaLabel]="ariaLabel"
        [className]="className"
      ></UiGrid>
    `,
  }),
};

// Three columns
export const ThreeColumns: Story = {
  args: { columns: 3 },
  render: (args) => ({
    props: { ...args, items: SAMPLE_IMAGES.slice(0, 3) },
    template: `
      <UiGrid [columns]="columns" ariaLabel="Galería 3 cols">
        @for (item of items; track item.src) {
          <UiImage [src]="item.src" [alt]="item.alt" />
        }
      </UiGrid>
    `,
  }),
};

// Four columns
export const FourColumns: Story = {
  args: { columns: 4 },
  render: (args) => ({
    props: { ...args, items: SAMPLE_IMAGES.slice(0, 4) },
    template: `
      <UiGrid [columns]="columns" ariaLabel="Galería 4 cols">
        @for (item of items; track item.src) {
          <UiImage [src]="item.src" [alt]="item.alt" />
        }
      </UiGrid>
    `,
  }),
};

// Many items
export const ManyItems: Story = {
  args: { columns: 3 },
  render: (args) => ({
    props: { ...args, items: SAMPLE_IMAGES },
    template: `
      <UiGrid [columns]="columns" ariaLabel="Galería completa">
        @for (item of items; track item.src) {
          <UiImage [src]="item.src" [alt]="item.alt" />
        }
      </UiGrid>
    `,
  }),
};

// Single item
export const SingleItem: Story = {
  render: (args) => ({
    props: { ...args, items: SAMPLE_IMAGES.slice(0, 1) },
    template: `
      <UiGrid [columns]="2" ariaLabel="Imagen única">
        @for (item of items; track item.src) {
          <UiImage [src]="item.src" [alt]="item.alt" />
        }
      </UiGrid>
    `,
  }),
};

// Variantes de breakpoint
export const BreakpointVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            breakpoint="sm" (≥640px) — default
          </h3>
          <UiGrid [columns]="2" breakpoint="sm" ariaLabel="sm">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
          </UiGrid>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            breakpoint="md" (≥768px)
          </h3>
          <UiGrid [columns]="3" breakpoint="md" ariaLabel="md">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
            <UiImage src="/images/grid-image/image-03.png" alt="3" />
          </UiGrid>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            breakpoint="xl" (≥1280px)
          </h3>
          <UiGrid [columns]="3" breakpoint="xl" ariaLabel="xl">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
            <UiImage src="/images/grid-image/image-03.png" alt="3" />
          </UiGrid>
        </div>
      </div>
    `,
  }),
};

// Variantes de columns
export const ColumnVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            columns="2"
          </h3>
          <UiGrid [columns]="2" ariaLabel="2 cols">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
            <UiImage src="/images/grid-image/image-03.png" alt="3" />
            <UiImage src="/images/grid-image/image-04.png" alt="4" />
          </UiGrid>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            columns="3"
          </h3>
          <UiGrid [columns]="3" ariaLabel="3 cols">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
            <UiImage src="/images/grid-image/image-03.png" alt="3" />
            <UiImage src="/images/grid-image/image-04.png" alt="4" />
            <UiImage src="/images/grid-image/image-05.png" alt="5" />
            <UiImage src="/images/grid-image/image-06.png" alt="6" />
          </UiGrid>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            columns="6"
          </h3>
          <UiGrid [columns]="6" ariaLabel="6 cols">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
            <UiImage src="/images/grid-image/image-03.png" alt="3" />
            <UiImage src="/images/grid-image/image-04.png" alt="4" />
            <UiImage src="/images/grid-image/image-05.png" alt="5" />
            <UiImage src="/images/grid-image/image-06.png" alt="6" />
          </UiGrid>
        </div>
      </div>
    `,
  }),
};

// Variantes de gap
export const GapVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-8">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            gap="gap-2"
          </h3>
          <UiGrid [columns]="2" gap="gap-2" ariaLabel="gap 2">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
            <UiImage src="/images/grid-image/image-03.png" alt="3" />
            <UiImage src="/images/grid-image/image-04.png" alt="4" />
          </UiGrid>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            gap="gap-5" (default)
          </h3>
          <UiGrid [columns]="2" gap="gap-5" ariaLabel="gap 5">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
            <UiImage src="/images/grid-image/image-03.png" alt="3" />
            <UiImage src="/images/grid-image/image-04.png" alt="4" />
          </UiGrid>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            gap="gap-10"
          </h3>
          <UiGrid [columns]="2" gap="gap-10" ariaLabel="gap 10">
            <UiImage src="/images/grid-image/image-01.png" alt="1" />
            <UiImage src="/images/grid-image/image-02.png" alt="2" />
            <UiImage src="/images/grid-image/image-03.png" alt="3" />
            <UiImage src="/images/grid-image/image-04.png" alt="4" />
          </UiGrid>
        </div>
      </div>
    `,
  }),
};

// Contenido genérico (no imágenes) — el grid es 100% agnóstico
export const GenericContent: Story = {
  render: () => ({
    template: `
      <UiGrid [columns]="3" gap="gap-4" ariaLabel="Cards genéricas">
        <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <h4 class="font-semibold text-gray-800 dark:text-gray-100">Card 1</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            El grid proyecta cualquier contenido via ng-content.
          </p>
        </div>
        <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <h4 class="font-semibold text-gray-800 dark:text-gray-100">Card 2</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Puede ser texto, cards, avatares, etc.
          </p>
        </div>
        <div class="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <h4 class="font-semibold text-gray-800 dark:text-gray-100">Card 3</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            No está acoplado a UiImage.
          </p>
        </div>
      </UiGrid>
    `,
  }),
};

// Disabled (clase para grisar todo el grid)
export const Disabled: Story = {
  args: { className: "opacity-50 pointer-events-none grayscale" },
  render: (args) => ({
    props: { ...args, items: SAMPLE_IMAGES.slice(0, 3) },
    template: `
      <UiGrid
        [columns]="columns"
        [breakpoint]="breakpoint"
        [gap]="gap"
        [ariaLabel]="ariaLabel"
        [className]="className"
      >
        @for (item of items; track item.src) {
          <UiImage [src]="item.src" [alt]="item.alt" />
        }
      </UiGrid>
    `,
  }),
};
