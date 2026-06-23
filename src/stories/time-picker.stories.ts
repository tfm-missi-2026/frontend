import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

import { UiTimePickerComponent } from "@shared/ui/time-picker";

const meta: Meta<UiTimePickerComponent> = {
  title: "Shared/TimePicker",
  component: UiTimePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiTimePickerComponent,
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
    time24hr: { control: "boolean" },
    minuteIncrement: { control: { type: "number", min: 1, max: 30 } },
    defaultTime: { control: "text" },
    dateFormat: { control: "text" },
    width: { control: "text" },
    legend: { control: "text" },
    valueChange: { action: "valueChange" },
    blurEvt: { action: "blurEvt" },
    focusEvt: { action: "focusEvt" },
  },
  args: {
    id: "demo-time",
    labelText: "Hora",
    placeholder: "HH:mm",
    time24hr: false,
    minuteIncrement: 1,
    dateFormat: "H:i",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <UiTimePicker
          [id]="id"
          [labelText]="labelText"
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [errorMessage]="errorMessage"
          [tooltip]="tooltip"
          [time24hr]="time24hr"
          [minuteIncrement]="minuteIncrement"
          [defaultTime]="defaultTime"
          [dateFormat]="dateFormat"
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

type Story = StoryObj<UiTimePickerComponent>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true, value: "14:30" },
};

export const WithError: Story = {
  args: { errorMessage: "Hora inválida" },
};

export const WithTooltip: Story = {
  args: { tooltip: "Selecciona una hora entre las 9 y las 18." },
};

export const Time24hr: Story = {
  args: { time24hr: true, placeholder: "HH:mm (24h)" },
};

export const MinuteIncrement: Story = {
  args: { minuteIncrement: 15 },
};

export const WithDefaultTime: Story = {
  args: { defaultTime: "09:00" },
};

export const WithLegend: Story = {
  args: { legend: "Zona horaria: GMT-3 (Buenos Aires)." },
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
          <UiTimePicker
            formControlName="start"
            labelText="Desde"
          ></UiTimePicker>
          <UiTimePicker
            formControlName="end"
            labelText="Hasta"
            time24hr="true"
          ></UiTimePicker>
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
        <UiTimePicker
          [id]="id"
          [labelText]="labelText"
          [time24hr]="time24hr"
        />
      </div>
    `,
  }),
};
