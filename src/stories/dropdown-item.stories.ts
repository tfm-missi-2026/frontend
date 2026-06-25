import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import {
  UiDropdownComponent,
  UiDropdownItemComponent,
} from "@shared/ui/dropdown";

@Component({
  selector: "DropdownItemHost",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiDropdownComponent,
    UiDropdownItemComponent,
  ],
  template: `
    <div class="p-6 min-h-100">
      <div class="relative inline-block">
        <button
          type="button"
          class="dropdown-toggle h-11 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          (click)="toggle()"
        >
          Acciones
        </button>

        <UiDropdown
          [isOpen]="open()"
          (close)="open.set(false)"
          className="w-56 p-2"
        >
          <UiDropdownItem
            [tag]="tag"
            [to]="to"
            [baseClassName]="baseClassName"
            [className]="className"
            [disabled]="disabled"
            (itemClick)="onItem()"
          >
            {{ label }}
          </UiDropdownItem>
        </UiDropdown>
      </div>
    </div>
  `,
})
class DropdownItemHostComponent {
  readonly open = signal(false);
  tag: "button" | "a" = "button";
  to: string | undefined;
  baseClassName =
    "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  className = "";
  disabled = false;
  label = "Acción";
  clicked = 0;

  toggle(): void {
    this.open.set(!this.open());
  }
  onItem(): void {
    this.clicked += 1;
  }
}

const meta: Meta<UiDropdownItemComponent> = {
  title: "Shared/DropdownItem",
  component: UiDropdownItemComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        RouterModule,
        UiDropdownComponent,
        UiDropdownItemComponent,
        DropdownItemHostComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    tag: {
      control: "select",
      options: ["button", "a"],
    },
    to: { control: "text" },
    baseClassName: { control: "text" },
    className: { control: "text" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
  },
  args: {
    tag: "button",
    to: undefined,
    baseClassName:
      "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    className: "",
    disabled: false,
    type: "button",
  },
};

export default meta;

type Story = StoryObj<UiDropdownItemComponent>;

// Default — renderiza un <button>
export const AsButton: Story = {
  render: (args) => ({
    props: { ...args, label: "Acción" },
    template: `<DropdownItemHost [tag]="tag" [baseClassName]="baseClassName" [label]="label" />`,
  }),
};

// Renderiza un <a routerLink>
export const AsLink: Story = {
  args: {
    tag: "a",
    to: "/profile",
  },
  render: (args) => ({
    props: { ...args, label: "Mi perfil" },
    template: `<DropdownItemHost [tag]="tag" [to]="to" [label]="label" />`,
  }),
};

// Item deshabilitado
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => ({
    props: { ...args, label: "Deshabilitado" },
    template: `<DropdownItemHost [disabled]="disabled" [label]="label" />`,
  }),
};

// Con clases personalizadas
export const CustomClass: Story = {
  args: {
    className: "text-error-500 font-semibold",
  },
  render: (args) => ({
    props: { ...args, label: "Eliminar" },
    template: `<DropdownItemHost [className]="className" [label]="label" />`,
  }),
};
