import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { JsonPipe } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";

import { UiInputComponent } from "@shared/ui/input/input/input.component";
import { IconSearchComponent } from "@shared/icons/search-icon";
import { IconEyeComponent } from "@shared/icons/eye-icon";
import { CommonThemeToggleComponent } from "@shared/common/theme-toggle/theme-toggle.component";

const meta: Meta<UiInputComponent> = {
  title: "Shared/Input",
  component: UiInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        JsonPipe,
        ReactiveFormsModule,
        UiInputComponent,
        IconSearchComponent,
        IconEyeComponent,
        CommonThemeToggleComponent,
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
    passwordVisibilityChange: { action: "passwordVisibilityChange" },
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
  args: {
    errorMessage: "Este correo no es válido",
    value: "mal-formato",
  },
};

export const WithTooltip: Story = {
  args: {
    tooltip: "Nunca compartiremos tu correo con terceros.",
  },
};

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

export const PasswordWithToggle: Story = {
  args: {
    labelText: "Contraseña",
    type: "password",
    placeholder: "••••••••",
    showPasswordToggle: true,
  },
};

export const FixedWidth: Story = {
  args: {
    labelText: "Código postal",
    width: "200px",
    placeholder: "00000",
    maxLength: 5,
  },
};

export const WithDebounce: Story = {
  args: {
    labelText: "Búsqueda con debounce",
    debounceTime: 500,
    leftIcon: IconSearchComponent,
    placeholder: "Escribe para buscar…",
  },
};

export const NumberType: Story = {
  args: {
    labelText: "Edad",
    type: "number",
    placeholder: "0",
  },
};

export const EmailType: Story = {
  args: {
    labelText: "Email",
    type: "email",
    placeholder: "tu@correo.com",
    autocomplete: "email",
  },
};

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

export const DarkMode: Story = {
  render: () => ({
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg space-y-4 max-w-sm">
        <UiInput labelText="Default" placeholder="Texto"></UiInput>
        <UiInput labelText="Required" placeholder="Obligatorio" [required]="true"></UiInput>
        <UiInput labelText="Disabled" [disabled]="true" value="No editable"></UiInput>
        <UiInput labelText="Read only" [readOnly]="true" value="Solo lectura"></UiInput>
        <UiInput labelText="Con error" value="mal" errorMessage="Formato inválido"></UiInput>
        <UiInput labelText="Con tooltip" placeholder="Hover el icono" tooltip="Texto de ayuda"></UiInput>
        <UiInput labelText="Password" type="password" [showPasswordToggle]="true"></UiInput>
      </div>
    `,
  }),
};

export const WithThemeSwitch: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col items-start gap-6 p-6">
        <CommonThemeToggle variant="subtle" size="md"></CommonThemeToggle>
        <div class="space-y-3 w-full max-w-sm">
          <UiInput labelText="Email" placeholder="tu@correo.com" [required]="true"></UiInput>
          <UiInput labelText="Contraseña" type="password" placeholder="••••••••" tooltip="Mínimo 8 caracteres"></UiInput>
          <UiInput labelText="Descripción" placeholder="..." [maxLength]="80" legend="Máximo 80 caracteres"></UiInput>
        </div>
      </div>
    `,
  }),
};