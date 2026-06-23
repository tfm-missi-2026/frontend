import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

import { UiFileInputComponent } from "@shared/ui/file-input";

const meta: Meta<UiFileInputComponent> = {
  title: "Shared/FileInput",
  component: UiFileInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiFileInputComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    accept: { control: "text" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    buttonText: { control: "text" },
    ariaLabel: { control: "text" },
    width: { control: "text" },
    className: { control: "text" },
    valueChange: { action: "valueChange" },
    change: { action: "change" },
  },
  args: {
    id: "demo-file",
    buttonText: "Subir archivo",
  },
  render: (args) => ({
    props: args,
    template: `
      <div [style.width]="width || '100%'" [style.maxWidth.px]="320">
        <UiFileInput
          [id]="id"
          [name]="name"
          [accept]="accept"
          [multiple]="multiple"
          [disabled]="disabled"
          [buttonText]="buttonText"
          [ariaLabel]="ariaLabel"
          [width]="width"
          [className]="className"
          (valueChange)="valueChange($event)"
          (change)="change($event)"
        />
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<UiFileInputComponent>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const PdfOnly: Story = {
  args: { accept: ".pdf,application/pdf", buttonText: "Subir PDF" },
};

export const ImagesOnly: Story = {
  args: {
    accept: "image/*",
    buttonText: "Subir imagen",
  },
};

export const Multiple: Story = {
  args: { multiple: true, buttonText: "Subir varios archivos" },
};

export const CustomButtonText: Story = {
  args: { buttonText: "Elegir CV" },
};

export const ReactiveFormExample: Story = {
  render: () => {
    const control = new FormControl<File | null>(null);
    return {
      props: { control },
      template: `
        <form class="max-w-sm space-y-3">
          <UiFileInput
            [formControl]="control"
            accept="image/*"
            buttonText="Subir avatar"
          ></UiFileInput>
          <p class="text-xs">Valor: {{ control.value?.name || '—' }}</p>
        </form>
      `,
    };
  },
};

export const DarkMode: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg max-w-sm">
        <UiFileInput
          [id]="id"
          [buttonText]="buttonText"
        />
      </div>
    `,
  }),
};
