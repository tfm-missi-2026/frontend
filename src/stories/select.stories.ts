// select.stories.ts — SelectAsync (estilo react-select para Angular)

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { SelectComponent } from '@ui/select/select';
import { SelectOption, LoadOptionsFn } from '@ui/select/select.interface';

const options: SelectOption[] = [
  { label: 'Angular', value: 'angular' },
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'NextJS', value: 'nextjs' },
  { label: 'NuxtJS', value: 'nuxtjs' },
];

const meta: Meta<SelectComponent> = {
  title: 'Shared/Select',
  component: SelectComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectComponent],
    }),
  ],
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'object' },
    placeholder: { control: 'text' },
    labelText: { control: 'text' },
    required: { control: 'boolean' },
    isMulti: { control: 'boolean' },
    isClearable: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    searchable: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    creatable: { control: 'boolean' },
    async: { control: 'boolean' },
    errorMessage: { control: 'text' },
    tooltip: { control: 'text' },
    menuIsOpen: { control: 'boolean' },
    tabSelectsValue: { control: 'boolean' },
    closeOnSelect: { control: 'boolean' },
    width: { control: 'text' },
    minWidth: { control: 'text' },
    selectionChange: { action: 'selectionChange' },
    menuOpenChange: { action: 'menuOpenChange' },
    searchChange: { action: 'searchChange' },
    createOption: { action: 'createOption' },
  },
  args: {
    options,
    placeholder: 'Selecciona una opción',
    labelText: 'Tecnologías',
    required: false,
    isMulti: false,
    isClearable: false,
    isDisabled: false,
    readOnly: false,
    searchable: true,
    isLoading: false,
    creatable: false,
    async: false,
    tabSelectsValue: true,
    closeOnSelect: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-87.5 p-6 overflow-visible">
        <SelectAsync
          [options]="options"
          [placeholder]="placeholder"
          [labelText]="labelText"
          [required]="required"
          [isMulti]="isMulti"
          [isClearable]="isClearable"
          [isDisabled]="isDisabled"
          [readOnly]="readOnly"
          [searchable]="searchable"
          [isLoading]="isLoading"
          [creatable]="creatable"
          [async]="async"
          [errorMessage]="errorMessage"
          [tooltip]="tooltip"
          [tabSelectsValue]="tabSelectsValue"
          [closeOnSelect]="closeOnSelect"
          [width]="width"
          [minWidth]="minWidth"
          (selectionChange)="selectionChange($event)"
          (menuOpenChange)="menuOpenChange($event)"
          (searchChange)="searchChange($event)"
          (createOption)="createOption($event)"
        />
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<SelectComponent>;

// ---------------------------------------------------------------------------
// Variantes
// ---------------------------------------------------------------------------

export const Default: Story = {};

export const SingleSelect: Story = {
  args: { isMulti: false },
};

export const MultiSelect: Story = {
  args: { isMulti: true, isClearable: true },
};

export const Searchable: Story = {
  args: { searchable: true },
};

export const MultiSearchable: Story = {
  args: { isMulti: true, searchable: true, isClearable: true },
};

export const Clearable: Story = {
  args: { isClearable: true, isMulti: false },
};

export const Disabled: Story = {
  args: { isDisabled: true, value: 'angular' as any },
  render: (args: any) => ({
    props: args,
    template: `
      <div class="w-87.5 p-6 overflow-visible">
        <SelectAsync
          [options]="options"
          [isDisabled]="isDisabled"
          [value]="'angular'"
        />
      </div>
    `,
  }),
};

export const ReadOnly: Story = {
  args: { readOnly: true, value: 'react' as any },
  render: (args: any) => ({
    props: args,
    template: `
      <div class="w-87.5 p-6 overflow-visible">
        <SelectAsync
          [options]="options"
          [readOnly]="readOnly"
          [value]="'react'"
          [isClearable]="true"
        />
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: { isLoading: true, searchable: true },
  render: (args: any) => ({
    props: args,
    template: `
      <div class="w-87.5 p-6 overflow-visible">
        <SelectAsync
          [options]="options"
          [isLoading]="true"
          [searchable]="true"
        />
      </div>
    `,
  }),
};

export const WithError: Story = {
  args: { errorMessage: 'Este campo es obligatorio' },
};

export const WithTooltip: Story = {
  args: { tooltip: 'Puedes seleccionar varias opciones' },
};

export const Required: Story = {
  args: { required: true, labelText: 'Framework *' },
};

export const Creatable: Story = {
  args: { creatable: true, searchable: true },
  render: (args: any) => ({
    props: args,
    template: `
      <div class="w-87.5 p-6 overflow-visible">
        <SelectAsync
          [options]="options"
          [creatable]="true"
          [searchable]="true"
          (createOption)="createOption($event)"
        />
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Async (loadOptions)
// ---------------------------------------------------------------------------

const allCountries: SelectOption[] = [
  { label: 'Argentina', value: 'ar' },
  { label: 'Brasil', value: 'br' },
  { label: 'Chile', value: 'cl' },
  { label: 'Colombia', value: 'co' },
  { label: 'España', value: 'es' },
  { label: 'México', value: 'mx' },
  { label: 'Perú', value: 'pe' },
  { label: 'Uruguay', value: 'uy' },
];

const loadCountries: LoadOptionsFn = (search: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const term = search.trim().toLowerCase();
      const filtered = term
        ? allCountries.filter((c) => c.label.toLowerCase().includes(term))
        : allCountries;
      resolve(filtered);
    }, 600);
  });
};

export const Async: Story = {
  render: () => {
    const asyncProps = {
      options: [] as SelectOption[],
      async: true,
      loadOptions: loadCountries,
      defaultOptions: true,
      isClearable: true,
      placeholder: 'Busca un país...',
      labelText: 'País',
      loadingMessage: () => 'Buscando...',
      noOptionsMessage: () => 'Sin coincidencias',
    };
    return {
      props: asyncProps,
      template: `
        <div class="w-87.5 p-6 overflow-visible">
          <SelectAsync
            [options]="options"
            [async]="async"
            [loadOptions]="loadOptions"
            [defaultOptions]="defaultOptions"
            [isClearable]="isClearable"
            [placeholder]="placeholder"
            [labelText]="labelText"
            [loadingMessage]="loadingMessage"
            [noOptionsMessage]="noOptionsMessage"
          />
        </div>
      `,
    };
  },
};

export const AsyncCreatable: Story = {
  render: () => {
    const asyncProps = {
      options: allCountries,
      async: true,
      creatable: true,
      loadOptions: loadCountries,
      isClearable: true,
      placeholder: 'Busca o crea un país...',
      labelText: 'País',
    };
    return {
      props: asyncProps,
      template: `
        <div class="w-87.5 p-6 overflow-visible">
          <SelectAsync
            [options]="options"
            [async]="async"
            [creatable]="creatable"
            [loadOptions]="loadOptions"
            [isClearable]="isClearable"
            [placeholder]="placeholder"
            [labelText]="labelText"
            (createOption)="createOption($event)"
          />
        </div>
      `,
    };
  },
};

// ---------------------------------------------------------------------------
// Valores por defecto
// ---------------------------------------------------------------------------

export const WithDefaultValue: Story = {
  render: (args: any) => ({
    props: args,
    template: `
      <div class="w-87.5 p-6 overflow-visible">
        <SelectAsync
          [options]="options"
          [value]="'angular'"
        />
      </div>
    `,
  }),
};

export const MultiDefaultValues: Story = {
  render: (args: any) => ({
    props: args,
    template: `
      <div class="w-87.5 p-6 overflow-visible">
        <SelectAsync
          [options]="options"
          [isMulti]="true"
          [isClearable]="true"
          [value]="['angular', 'react']"
        />
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Reactive forms
// ---------------------------------------------------------------------------

export const ReactiveFormExample: Story = {
  render: () => {
    const form = new FormGroup({
      technology: new FormControl<string[]>(['angular', 'vue']),
    });
    return {
      props: { form, options },
      template: `
        <div class="w-100 p-6 overflow-visible">
          <form [formGroup]="form">
            <SelectAsync
              formControlName="technology"
              [options]="options"
              [isMulti]="true"
              [isClearable]="true"
              [searchable]="true"
              [labelText]="'Frameworks'"
              [placeholder]="'Selecciona tecnologías'"
            />
          </form>

          <div class="mt-6 text-sm">
            <strong>Valor:</strong>
            <pre>{{ form.value | json }}</pre>
          </div>
        </div>
      `,
    };
  },
};

export const ReactiveFormSingle: Story = {
  render: () => {
    const control = new FormControl<string | null>('react');
    return {
      props: { control, options },
      template: `
        <div class="w-100 p-6 overflow-visible">
          <SelectAsync
            [formControl]="control"
            [options]="options"
            [isClearable]="true"
            [labelText]="'Framework favorito'"
            [placeholder]="'Selecciona uno'"
          />

          <div class="mt-6 text-sm">
            <strong>Valor:</strong>
            <pre>{{ control.value | json }}</pre>
          </div>
        </div>
      `,
    };
  },
};

// ---------------------------------------------------------------------------
// Mobile / Many options
// ---------------------------------------------------------------------------

export const MobileView: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: { isMulti: true, searchable: true, isClearable: true },
  render: (args: any) => ({
    props: args,
    template: `
      <div class="w-full p-4 overflow-visible">
        <SelectAsync
          [options]="options"
          [isMulti]="isMulti"
          [searchable]="searchable"
          [isClearable]="isClearable"
        />
      </div>
    `,
  }),
};

export const ManyOptions: Story = {
  render: (args: any) => ({
    props: {
      ...args,
      options: Array.from({ length: 50 }).map((_, i) => ({
        label: 'Option ' + (i + 1),
        value: 'option-' + (i + 1),
      })),
    },
    template: `
      <div class="w-87.5 h-150 p-6 overflow-visible">
        <SelectAsync
          [options]="options"
          [isMulti]="true"
          [searchable]="true"
          [isClearable]="true"
        />
      </div>
    `,
  }),
};

export const DarkMode: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  args: { isMulti: true, isClearable: true, value: ['angular', 'react'] as any },
  render: (args: any) => ({
    props: args,
    template: `
      <div class="dark bg-gray-900 p-6 rounded-lg w-100">
        <SelectAsync
          [options]="options"
          [isMulti]="isMulti"
          [isClearable]="isClearable"
          [value]="value"
          labelText="Frameworks"
        />
      </div>
    `,
  }),
};