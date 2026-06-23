import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

import { UiDatePickerComponent } from "@shared/ui/date-picker";

const meta: Meta<UiDatePickerComponent> = {
  title: "Shared/DatePicker",
  component: UiDatePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiDatePickerComponent,
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
    mode: {
      control: "select",
      options: ["single", "multiple", "range"],
    },
    dateFormat: { control: "text" },
    defaultDate: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    width: { control: "text" },
    legend: { control: "text" },
    valueChange: { action: "valueChange" },
    blurEvt: { action: "blurEvt" },
    focusEvt: { action: "focusEvt" },
  },
  args: {
    id: "demo-date",
    labelText: "Fecha",
    placeholder: "YYYY-MM-DD",
    mode: "single",
    dateFormat: "Y-m-d",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <UiDatePicker
          [id]="id"
          [labelText]="labelText"
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [errorMessage]="errorMessage"
          [tooltip]="tooltip"
          [mode]="mode"
          [dateFormat]="dateFormat"
          [defaultDate]="defaultDate"
          [min]="min"
          [max]="max"
          [width]="width"
          [legend]="legend"
          (valueChange)="valueChange($event)"
          (blurEvt)="blurEvt($event)"
          (focusEvt)="focusEvt($event)"
        />
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<UiDatePickerComponent>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, value: "2026-01-15" },
};

export const WithError: Story = {
  args: { errorMessage: "Fecha inválida" },
};

export const WithTooltip: Story = {
  args: { tooltip: "Selecciona una fecha entre 2020 y 2030." },
};

export const WithMinMax: Story = {
  args: { min: "2026-01-01", max: "2026-12-31" },
};

export const WithDefaultDate: Story = {
  args: { defaultDate: "2026-06-15" },
};

export const MultipleMode: Story = {
  args: { mode: "multiple", placeholder: "Selecciona varias fechas" },
};

export const RangeMode: Story = {
  args: {
    mode: "range",
    placeholder: "Rango de fechas",
    dateFormat: "Y-m-d",
  },
};

export const WithLegend: Story = {
  args: { legend: "Te enviaremos un recordatorio 1 día antes." },
};

export const ReactiveFormExample: Story = {
  render: () => {
    const form = new FormGroup({
      start: new FormControl<string>(""),
      end: new FormControl<string>(""),
    });
    return {
      props: { form },
      template: `
        <form [formGroup]="form" class="max-w-sm space-y-3">
          <UiDatePicker
            formControlName="start"
            labelText="Desde"
            placeholder="YYYY-MM-DD"
          ></UiDatePicker>
          <UiDatePicker
            formControlName="end"
            labelText="Hasta"
            placeholder="YYYY-MM-DD"
          ></UiDatePicker>
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
      <div class="dark bg-gray-900 p-6 rounded-lg max-w-sm">
        <UiDatePicker
          [id]="id"
          [labelText]="labelText"
          [placeholder]="placeholder"
        />
      </div>
    `,
  }),
};
