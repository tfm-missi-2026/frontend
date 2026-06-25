import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiModalComponent } from "@shared/ui/modal";

@Component({
  selector: "ModalDefaultHost",
  standalone: true,
  imports: [CommonModule, UiModalComponent],
  template: `
    <div class="p-6 min-h-100">
      <button
        (click)="open()"
        class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
      >
        Open Modal
      </button>

      <UiModal
        [isOpen]="isOpen"
        (close)="close()"
        className="max-w-150 p-5 lg:p-10"
      >
        <h4
          class="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90"
        >
          Modal Heading
        </h4>
        <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          euismod est quis mauris lacinia pharetra. Sed a ligula ac odio
          condimentum aliquet a nec nulla. Aliquam bibendum ex sit amet ipsum
          rutrum feugiat ultrices enim quam.
        </p>
        <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          euismod est quis mauris lacinia pharetra. Sed a ligula ac odio.
        </p>
        <div class="flex items-center justify-end w-full gap-3 mt-8">
          <button
            (click)="close()"
            class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
          >
            Close
          </button>
          <button
            (click)="close()"
            class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
          >
            Save Changes
          </button>
        </div>
      </UiModal>
    </div>
  `,
})
class ModalDefaultHostComponent {
  isOpen = false;
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }
}

@Component({
  selector: "ModalCenteredHost",
  standalone: true,
  imports: [CommonModule, UiModalComponent],
  template: `
    <div class="p-6 min-h-100">
      <button
        (click)="open()"
        class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
      >
        Open Modal
      </button>

      <UiModal
        [isOpen]="isOpen"
        (close)="close()"
        className="max-w-126.75 p-6 lg:p-10"
        [showCloseButton]="false"
      >
        <div class="text-center">
          <h4
            class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm"
          >
            All Done! Success Confirmed
          </h4>
          <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque euismod est quis mauris lacinia pharetra.
          </p>

          <div class="flex items-center justify-center w-full gap-3 mt-8">
            <button
              (click)="close()"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
            >
              Close
            </button>
            <button
              (click)="close()"
              class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </UiModal>
    </div>
  `,
})
class ModalCenteredHostComponent {
  isOpen = false;
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }
}

@Component({
  selector: "ModalFullScreenHost",
  standalone: true,
  imports: [CommonModule, UiModalComponent],
  template: `
    <div class="p-6 min-h-100">
      <button
        (click)="open()"
        class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
      >
        Open Modal
      </button>

      <UiModal
        [isOpen]="isOpen"
        (close)="close()"
        [isFullscreen]="true"
        [showCloseButton]="true"
      >
        <div
          class="fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10"
        >
          <div>
            <h4
              class="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90"
            >
              Modal Heading
            </h4>
            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque euismod est quis mauris lacinia pharetra. Sed a
              ligula ac odio condimentum aliquet a nec nulla. Aliquam bibendum
              ex sit amet ipsum rutrum feugiat ultrices enim quam.
            </p>
            <p class="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque euismod est quis mauris lacinia pharetra.
            </p>
          </div>
          <div class="flex items-center justify-end w-full gap-3 mt-8">
            <button
              (click)="close()"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400"
            >
              Close
            </button>
            <button
              (click)="close()"
              class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </UiModal>
    </div>
  `,
})
class ModalFullScreenHostComponent {
  isOpen = false;
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }
}

const meta: Meta<UiModalComponent> = {
  title: "Shared/Modal",
  component: UiModalComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        UiModalComponent,
        ModalDefaultHostComponent,
        ModalCenteredHostComponent,
        ModalFullScreenHostComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    isOpen: { control: "boolean" },
    className: { control: "text" },
    showCloseButton: { control: "boolean" },
    isFullscreen: { control: "boolean" },
  },
  args: {
    isOpen: false,
    className: "",
    showCloseButton: true,
    isFullscreen: false,
  },
};

export default meta;

type Story = StoryObj<UiModalComponent>;

// Default — modal simple con contenido proyectado
export const Default: Story = {
  render: () => ({
    template: `<ModalDefaultHost />`,
  }),
};

// Sin botón de cerrar — el cierre se hace por backdrop o botones internos
export const VerticallyCentered: Story = {
  render: () => ({
    template: `<ModalCenteredHost />`,
  }),
};

// Fullscreen — ocupa toda la pantalla, sin backdrop
export const FullScreen: Story = {
  render: () => ({
    template: `<ModalFullScreenHost />`,
  }),
};

// Render directo controlado por args (útil para los controles de Storybook)
export const Controlled: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="p-6 min-h-100">
        <button
          (click)="isOpen = true"
          class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
        >
          Open
        </button>
        <UiModal
          [isOpen]="isOpen"
          (close)="isOpen = false"
          [className]="className"
          [showCloseButton]="showCloseButton"
          [isFullscreen]="isFullscreen"
        >
          <h4
            class="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90"
          >
            Controlled Modal
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Usá los controles de Storybook para manipular las props.
          </p>
        </UiModal>
      </div>
    `,
  }),
};
