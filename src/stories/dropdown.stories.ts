import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UiDropdownComponent, UiDropdownItemComponent } from "@shared/ui/dropdown";

@Component({
  selector: "DropdownDefaultHost",
  standalone: true,
  imports: [CommonModule, UiDropdownComponent, UiDropdownItemComponent],
  template: `
    <div class="p-6 min-h-100">
      <div class="relative inline-block">
        <button
          type="button"
          class="dropdown-toggle h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          (click)="toggle()"
        >
          {{ open() ? "Cerrar" : "Abrir" }} dropdown
        </button>

        <UiDropdown
          [isOpen]="open()"
          (close)="open.set(false)"
          className="w-56 p-2"
        >
          <UiDropdownItem (itemClick)="open.set(false)">
            Editar
          </UiDropdownItem>
          <UiDropdownItem (itemClick)="open.set(false)">
            Duplicar
          </UiDropdownItem>
          <UiDropdownItem (itemClick)="open.set(false)">
            Eliminar
          </UiDropdownItem>
        </UiDropdown>
      </div>
    </div>
  `,
})
class DropdownDefaultHostComponent {
  readonly open = signal(false);
  toggle(): void {
    this.open.set(!this.open());
  }
}

@Component({
  selector: "DropdownWithLinksHost",
  standalone: true,
  imports: [CommonModule, UiDropdownComponent, UiDropdownItemComponent],
  template: `
    <div class="p-6 min-h-100">
      <div class="relative inline-block">
        <button
          type="button"
          class="dropdown-toggle h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          (click)="toggle()"
        >
          Cuenta
        </button>

        <UiDropdown
          [isOpen]="open()"
          (close)="open.set(false)"
          className="w-56 p-2"
        >
          <UiDropdownItem to="/profile" (itemClick)="open.set(false)">
            Mi perfil
          </UiDropdownItem>
          <UiDropdownItem to="/settings" (itemClick)="open.set(false)">
            Configuración
          </UiDropdownItem>
          <UiDropdownItem to="/logout" (itemClick)="open.set(false)">
            Cerrar sesión
          </UiDropdownItem>
        </UiDropdown>
      </div>
    </div>
  `,
})
class DropdownWithLinksHostComponent {
  readonly open = signal(false);
  toggle(): void {
    this.open.set(!this.open());
  }
}

@Component({
  selector: "DropdownAlignmentHost",
  standalone: true,
  imports: [CommonModule, UiDropdownComponent, UiDropdownItemComponent],
  template: `
    <div class="p-6 min-h-100 flex flex-wrap items-start gap-6">
      <div class="relative inline-block">
        <button
          type="button"
          class="dropdown-toggle h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          (click)="openLeft.set(!openLeft())"
        >
          align="left"
        </button>
        <UiDropdown
          [isOpen]="openLeft()"
          (close)="openLeft.set(false)"
          align="left"
          className="w-56 p-2"
        >
          <UiDropdownItem (itemClick)="openLeft.set(false)">
            Acción A
          </UiDropdownItem>
          <UiDropdownItem (itemClick)="openLeft.set(false)">
            Acción B
          </UiDropdownItem>
        </UiDropdown>
      </div>

      <div class="relative inline-block">
        <button
          type="button"
          class="dropdown-toggle h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          (click)="openCenter.set(!openCenter())"
        >
          align="center"
        </button>
        <UiDropdown
          [isOpen]="openCenter()"
          (close)="openCenter.set(false)"
          align="center"
          className="w-56 p-2"
        >
          <UiDropdownItem (itemClick)="openCenter.set(false)">
            Acción A
          </UiDropdownItem>
          <UiDropdownItem (itemClick)="openCenter.set(false)">
            Acción B
          </UiDropdownItem>
        </UiDropdown>
      </div>

      <div class="relative inline-block">
        <button
          type="button"
          class="dropdown-toggle h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          (click)="openRight.set(!openRight())"
        >
          align="right"
        </button>
        <UiDropdown
          [isOpen]="openRight()"
          (close)="openRight.set(false)"
          align="right"
          className="w-56 p-2"
        >
          <UiDropdownItem (itemClick)="openRight.set(false)">
            Acción A
          </UiDropdownItem>
          <UiDropdownItem (itemClick)="openRight.set(false)">
            Acción B
          </UiDropdownItem>
        </UiDropdown>
      </div>
    </div>
  `,
})
class DropdownAlignmentHostComponent {
  readonly openLeft = signal(false);
  readonly openCenter = signal(false);
  readonly openRight = signal(false);
}

const meta: Meta<UiDropdownComponent> = {
  title: "Shared/Dropdown",
  component: UiDropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        UiDropdownComponent,
        UiDropdownItemComponent,
        DropdownDefaultHostComponent,
        DropdownWithLinksHostComponent,
        DropdownAlignmentHostComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    isOpen: { control: "boolean" },
    className: { control: "text" },
    align: {
      control: "select",
      options: ["right", "left", "center"],
    },
    closeOnEscape: { control: "boolean" },
    closeOnOutsideClick: { control: "boolean" },
    triggerSelector: { control: "text" },
  },
  args: {
    isOpen: false,
    className: "w-56 p-2",
    align: "right",
    closeOnEscape: true,
    closeOnOutsideClick: true,
    triggerSelector: ".dropdown-toggle",
  },
};

export default meta;

type Story = StoryObj<UiDropdownComponent>;

// Default — botón como trigger + items como acciones
export const Default: Story = {
  render: () => ({
    template: `<DropdownDefaultHost />`,
  }),
};

// Items como links (router)
export const WithLinks: Story = {
  render: () => ({
    template: `<DropdownWithLinksHost />`,
  }),
};

// Variantes de alineación
export const Alignments: Story = {
  render: () => ({
    template: `<DropdownAlignmentHost />`,
  }),
};
