import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

import { UiTextAreaComponent } from "@shared/ui/text-area";

const meta: Meta<UiTextAreaComponent> = {
  title: "Shared/TextArea",
  component: UiTextAreaComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiTextAreaComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    id: { control: "text" },
    labelText: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    errorMessage: { control: "text" },
    tooltip: { control: "text" },
    hint: { control: "text" },
    rows: { control: { type: "number", min: 1, max: 20 } },
    maxLength: { control: { type: "number", min: 0 } },
    legend: { control: "text" },
    width: { control: "text" },
    resize: { control: "select", options: ["none", "vertical", "horizontal", "both"] },
    valueChange: { action: "valueChange" },
    blurEvt: { action: "blurEvt" },
    focusEvt: { action: "focusEvt" },
  },
  args: {
    id: "demo-ta",
    labelText: "Descripción",
    placeholder: "Cuéntanos algo…",
    rows: 4,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-md">
        <UiTextArea
          [id]="id"
          [labelText]="labelText"
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [errorMessage]="errorMessage"
          [tooltip]="tooltip"
          [hint]="hint"
          [rows]="rows"
          [maxLength]="maxLength"
          [legend]="legend"
          [width]="width"
          [resize]="resize"
          (valueChange)="valueChange($event)"
          (blurEvt)="blurEvt($event)"
          (focusEvt)="focusEvt($event)"
        />
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<UiTextAreaComponent>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true, value: "No editable" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, value: "Solo lectura" },
};

export const WithError: Story = {
  args: { errorMessage: "Este campo es obligatorio" },
};

export const WithHint: Story = {
  args: { hint: "Máximo 500 caracteres." },
};

export const WithTooltip: Story = {
  args: { tooltip: "Describe brevemente el propósito de este campo." },
};

export const WithMaxLength: Story = {
  args: {
    maxLength: 200,
    legend: "Hasta 200 caracteres",
    labelText: "Comentarios",
  },
};

export const MaxLengthReached: Story = {
  args: {
    maxLength: 30,
    value: "Texto de treinta caracteres exacto",
  },
};

export const NoResize: Story = {
  args: { resize: "none", labelText: "Tamaño fijo" },
};

export const ReactiveFormExample: Story = {
  render: () => {
    const form = new FormGroup({
      bio: new FormControl<string>(""),
    });
    return {
      props: { form },
      template: `
        <form [formGroup]="form" class="max-w-md space-y-3">
          <UiTextArea
            formControlName="bio"
            labelText="Biografía"
            placeholder="Escribe una breve bio…"
            [rows]="5"
            [maxLength]="280"
            legend="280 caracteres"
          ></UiTextArea>
          <pre class="text-xs">{{ form.value | json }}</pre>
        </form>
      `,
    };
  },
};

export const DarkMode: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg max-w-md">
        <UiTextArea
          [id]="id"
          [labelText]="labelText"
          [rows]="rows"
        />
      </div>
    `,
  }),
};
