import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

import { UiPhoneInputComponent } from "@shared/ui/phone-input";
import type { CountryCode } from "@shared/ui/phone-input";

const countries: CountryCode[] = [
  { code: "+1", label: "(555) 000-0000" },
  { code: "+34", label: "600 000 000" },
  { code: "+52", label: "55 0000 0000" },
  { code: "+54", label: "11 0000 0000" },
  { code: "+55", label: "11 90000-0000" },
  { code: "+57", label: "300 000 0000" },
  { code: "+58", label: "412-0000000" },
];

const meta: Meta<UiPhoneInputComponent> = {
  title: "Shared/PhoneInput",
  component: UiPhoneInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiPhoneInputComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    id: { control: "text" },
    labelText: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    errorMessage: { control: "text" },
    tooltip: { control: "text" },
    countries: { control: "object" },
    placeholder: { control: "text" },
    selectPosition: { control: "select", options: ["start", "end"] },
    width: { control: "text" },
    legend: { control: "text" },
    phoneChange: { action: "phoneChange" },
    valueChange: { action: "valueChange" },
    blurEvt: { action: "blurEvt" },
  },
  args: {
    id: "demo-phone",
    labelText: "Teléfono",
    placeholder: "Ingresa tu número",
    countries,
    selectPosition: "start",
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="max-w-sm">
        <UiPhoneInput
          [id]="id"
          [labelText]="labelText"
          [required]="required"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [errorMessage]="errorMessage"
          [tooltip]="tooltip"
          [countries]="countries"
          [placeholder]="placeholder"
          [selectPosition]="selectPosition"
          [width]="width"
          [legend]="legend"
          (phoneChange)="phoneChange($event)"
          (valueChange)="valueChange($event)"
          (blurEvt)="blurEvt($event)"
        />
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<UiPhoneInputComponent>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  render: (args) => {
    const phone = new FormControl<string>("+54 11 5555 5555");
    return {
      props: { ...args, phone },
      template: `
        <div class="max-w-sm">
          <UiPhoneInput
            [id]="id"
            [labelText]="labelText"
            [formControl]="phone"
            [readOnly]="true"
            [countries]="countries"
            [selectPosition]="selectPosition"
          ></UiPhoneInput>
        </div>
      `,
    };
  },
};

export const WithError: Story = {
  args: { errorMessage: "Número inválido" },
};

export const WithTooltip: Story = {
  args: { tooltip: "Incluye el código de país." },
};

export const SelectAtEnd: Story = {
  args: { selectPosition: "end" },
};

export const CustomCountries: Story = {
  args: {
    countries: [
      { code: "+1", label: "(555) 000-0000" },
      { code: "+44", label: "7700 000000" },
    ],
    labelText: "Custom countries",
  },
};

export const ReactiveFormExample: Story = {
  render: () => {
    const form = new FormGroup({
      phone: new FormControl<string>(""),
    });
    return {
      props: { form, countries },
      template: `
        <form [formGroup]="form" class="max-w-sm space-y-3">
          <UiPhoneInput
            formControlName="phone"
            labelText="Teléfono de contacto"
            [countries]="countries"
          ></UiPhoneInput>
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
        <UiPhoneInput
          [id]="id"
          [labelText]="labelText"
          [countries]="countries"
        />
      </div>
    `,
  }),
};
