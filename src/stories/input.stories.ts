// input.stories.ts — Input del design system

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { UiInputComponent } from '@ui/input/input/input';
import { IconProps } from '@ui/icon/icon.interface';
import { Component } from '@angular/core';

/**
 * Icono "search" minimalista para los stories de `leftIcon`/`rightIcon`.
 * Implementa la `IconProps` básica (color + size) que `Input` le pasa
 * vía `*ngComponentOutlet`.
 */
@Component({
  selector: 'SearchIcon',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size || 16"
      [attr.height]="size || 16"
      viewBox="0 0 16 16"
      fill="none"
      [style.color]="color || 'currentColor'"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
      <path
        d="M11 11L14 14"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  `,
})
class SearchIconComponent {
  size?: number | string;
  color?: string;
}

@Component({
  selector: 'EyeIcon',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size || 16"
      [attr.height]="size || 16"
      viewBox="0 0 16 16"
      fill="none"
      [style.color]="color || 'currentColor'"
      aria-hidden="true"
    >
      <path
        d="M1 8C2.5 4.5 5 2.5 8 2.5C11 2.5 13.5 4.5 15 8C13.5 11.5 11 13.5 8 13.5C5 13.5 2.5 11.5 1 8Z"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5" />
    </svg>
  `,
})
class EyeIconComponent {
  size?: number | string;
  color?: string;
}

const meta: Meta<UiInputComponent> = {
  title: 'Shared/Input',
  component: UiInputComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiInputComponent,
        SearchIconComponent,
        EyeIconComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    id: { control: 'text' },
    name: { control: 'text' },
    labelText: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    placeholder: { control: 'text' },
    errorMessage: { control: 'text' },
    tooltip: { control: 'text' },
    prefix: { control: 'text' },
    sufix: { control: 'text' },
    maxLength: { control: { type: 'number', min: 0 } },
    debounceTime: { control: { type: 'number', min: 0 } },
    width: { control: 'text' },
    legend: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    valueChange: { action: 'valueChange' },
    enterKey: { action: 'enterKey' },
    keyDown: { action: 'keyDown' },
    blurEvt: { action: 'blurEvt' },
    focusEvt: { action: 'focusEvt' },
  },
  args: {
    id: 'demo-input',
    labelText: 'Email',
    placeholder: 'tu@correo.com',
    type: 'text',
  },
};

export default meta;

type Story = StoryObj<UiInputComponent>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {};

// ---------------------------------------------------------------------------
// Variantes de estado
// ---------------------------------------------------------------------------

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'No editable' },
};

export const ReadOnly: Story = {
  args: { readOnly: true, value: 'Solo lectura' },
};

export const WithError: Story = {
  args: {
    errorMessage: 'Este correo no es válido',
    value: 'mal-formato',
  },
};

export const WithTooltip: Story = {
  args: {
    tooltip: 'Nunca compartiremos tu correo con terceros.',
  },
};

export const WithLegend: Story = {
  args: {
    legend: 'Te enviaremos un código de verificación.',
  },
};

// ---------------------------------------------------------------------------
// Prefix / sufix
// ---------------------------------------------------------------------------

export const WithPrefixSufix: Story = {
  args: {
    labelText: 'Precio',
    prefix: '$',
    sufix: 'USD',
    placeholder: '0.00',
  },
};

// ---------------------------------------------------------------------------
// Max length / contador
// ---------------------------------------------------------------------------

export const WithMaxLength: Story = {
  args: {
    labelText: 'Descripción corta',
    maxLength: 50,
    legend: 'Máximo 50 caracteres',
  },
};

export const MaxLengthReached: Story = {
  args: {
    labelText: 'Descripción corta',
    maxLength: 20,
    value: 'Texto de veinte carac',
  },
};

// ---------------------------------------------------------------------------
// Iconos
// ---------------------------------------------------------------------------

export const WithLeftIcon: Story = {
  args: {
    labelText: 'Buscar',
    placeholder: '¿Qué buscas?',
    leftIcon: SearchIconComponent,
  },
};

export const WithRightIcon: Story = {
  args: {
    labelText: 'Contraseña',
    type: 'password',
    placeholder: '••••••••',
    rightIcon: EyeIconComponent,
  },
};

export const WithBothIcons: Story = {
  args: {
    labelText: 'Búsqueda avanzada',
    placeholder: 'Buscar…',
    leftIcon: SearchIconComponent,
    rightIcon: EyeIconComponent,
  },
};

export const WithIconAndError: Story = {
  args: {
    labelText: 'Búsqueda',
    placeholder: 'Buscar…',
    leftIcon: SearchIconComponent,
    errorMessage: 'Sin resultados',
  },
};

// ---------------------------------------------------------------------------
// Flex / width
// ---------------------------------------------------------------------------

export const FixedWidth: Story = {
  args: {
    labelText: 'Código postal',
    width: '200px',
    placeholder: '00000',
    maxLength: 5,
  },
};

// ---------------------------------------------------------------------------
// Debounce
// ---------------------------------------------------------------------------

export const WithDebounce: Story = {
  args: {
    labelText: 'Búsqueda con debounce',
    debounceTime: 500,
    leftIcon: SearchIconComponent,
    placeholder: 'Escribe para buscar…',
  },
};

// ---------------------------------------------------------------------------
// Reactive forms
// ---------------------------------------------------------------------------

export const ReactiveFormExample: Story = {
  render: () => {
    const form = new FormGroup({
      email: new FormControl<string>(''),
      password: new FormControl<string>(''),
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

// ---------------------------------------------------------------------------
// NgModel
// ---------------------------------------------------------------------------

export const NgModelExample: Story = {
  render: () => ({
    props: { value: 'two-way bound' },
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

// ---------------------------------------------------------------------------
// All together
// ---------------------------------------------------------------------------

export const FullExample: Story = {
  args: {
    id: 'full',
    name: 'full',
    labelText: 'Nombre completo',
    placeholder: 'María González',
    required: true,
    tooltip: 'Tal como aparece en tu documento de identidad.',
    prefix: '👤',
    maxLength: 60,
    legend: 'Solo letras y espacios.',
  },
};
