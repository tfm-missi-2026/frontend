import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from "@angular/forms";

import { UiInputComponent } from "@shared/ui/input/input/input";
import { IconSearchComponent } from "@shared/ui/icon/search-icon";
import { IconEyeComponent } from "@shared/ui/icon/eye-icon";

const meta: Meta<UiInputComponent> = {
  title: "Shared/Input",
  component: UiInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiInputComponent,
        IconSearchComponent,
        IconEyeComponent,
      ],
    }),
  ],
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    labelText: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    placeholder: { control: "text" },
    errorMessage: { control: "text" },
    tooltip: { control: "text" },
    prefix: { control: "text" },
    sufix: { control: "text" },
    maxLength: { control: { type: "number", min: 0 } },
    debounceTime: { control: { type: "number", min: 0 } },
    width: { control: "text" },
    legend: { control: "text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    valueChange: { action: "valueChange" },
    enterKey: { action: "enterKey" },
    keyDown: { action: "keyDown" },
    blurEvt: { action: "blurEvt" },
    focusEvt: { action: "focusEvt" },
  },
  args: {
    id: "demo-input",
    labelText: "Email",
    placeholder: "tu@correo.com",
    type: "text",
  },
};

export default meta;

type Story = StoryObj<UiInputComponent>;

// Default
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

// Validaciones
export const WithError: Story = {
  args: {
    errorMessage: "Este correo no es válido",
    value: "mal-formato",
  },
};

// Tooltip
export const WithTooltip: Story = {
  args: {
    tooltip: "Nunca compartiremos tu correo con terceros.",
  },
};

// Helpers
export const WithLegend: Story = {
  args: {
    legend: "Te enviaremos un código de verificación.",
  },
};

export const WithPrefixSufix: Story = {
  args: {
    labelText: "Precio",
    prefix: "$",
    sufix: "USD",
    placeholder: "0.00",
  },
};

export const WithMaxLength: Story = {
  args: {
    labelText: "Descripción corta",
    maxLength: 50,
    legend: "Máximo 50 caracteres",
  },
};

export const MaxLengthReached: Story = {
  args: {
    labelText: "Descripción corta",
    maxLength: 20,
    value: "Texto de veinte carac",
  },
};

// Iconos
export const WithLeftIcon: Story = {
  args: {
    labelText: "Buscar",
    placeholder: "¿Qué buscas?",
    leftIcon: IconSearchComponent,
  },
};

export const WithRightIcon: Story = {
  args: {
    labelText: "Contraseña",
    type: "password",
    placeholder: "••••••••",
    rightIcon: IconEyeComponent,
  },
};

export const WithBothIcons: Story = {
  args: {
    labelText: "Búsqueda avanzada",
    placeholder: "Buscar…",
    leftIcon: IconSearchComponent,
    rightIcon: IconEyeComponent,
  },
};

export const WithIconAndError: Story = {
  args: {
    labelText: "Búsqueda",
    placeholder: "Buscar…",
    leftIcon: IconSearchComponent,
    errorMessage: "Sin resultados",
  },
};

// Width
export const FixedWidth: Story = {
  args: {
    labelText: "Código postal",
    width: "200px",
    placeholder: "00000",
    maxLength: 5,
  },
};

// Debounce
export const WithDebounce: Story = {
  args: {
    labelText: "Búsqueda con debounce",
    debounceTime: 500,
    leftIcon: IconSearchComponent,
    placeholder: "Escribe para buscar…",
  },
};

// Forms
export const ReactiveFormExample: Story = {
  render: () => {
    const form = new FormGroup({
      email: new FormControl<string>(""),
      password: new FormControl<string>(""),
    });
    return {
      props: { form },
      template: `
        <form [formGroup]="form" class="space-y-3 max-w-sm">
          <UiInput
            formControlName="email"
            labelText="Email"
            type="email"
            placeholder="tu@correo.com"
            [required]="true"
          ></UiInput>
          <UiInput
            formControlName="password"
            labelText="Contraseña"
            type="password"
            placeholder="••••••••"
          ></UiInput>
          <pre class="text-xs">{{ form.value | json }}</pre>
        </form>
      `,
    };
  },
};

export const NgModelExample: Story = {
  render: () => ({
    props: { value: "two-way bound" },
    template: `
      <div class="space-y-2 max-w-sm">
        <UiInput
          [(value)]="value"
          labelText="Two-way binding"
          placeholder="Escribe algo"
        ></UiInput>
        <pre class="text-xs">value = "{{ value }}"</pre>
      </div>
    `,
  }),
};

// Full example
export const FullExample: Story = {
  args: {
    id: "full",
    name: "full",
    labelText: "Nombre completo",
    placeholder: "María González",
    required: true,
    tooltip: "Tal como aparece en tu documento de identidad.",
    prefix: "👤",
    maxLength: 60,
    legend: "Solo letras y espacios.",
  },
};
