import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UiAlertComponent } from "@shared/ui/alert";
import { UiButtonComponent } from "@shared/ui/button";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFlexComponent } from "@shared/ui/flex";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiGridComponent } from "@shared/ui/grid";
import { UiInputComponent } from "@shared/ui/input";
import { UiLabelComponent } from "@shared/ui/label";
import { UiModalComponent } from "@shared/ui/modal";
import { UiRadioComponent } from "@shared/ui/radio";
import { UiSelectComponent } from "@shared/ui/select";
import { UiTextAreaComponent } from "@shared/ui/text-area";

import {
  CATALOG_GROUP_OPTIONS,
  emptyCatalogItemForm,
  type CatalogItem,
  type CatalogItemFormData,
} from "../../models/catalog-item";

export type ItemFormMode = "create" | "edit";
export type ItemFormSavePayload =
  | { mode: "create"; data: CatalogItemFormData }
  | { mode: "edit"; id: string; data: CatalogItemFormData };

interface ItemFormErrors {
  code?: string;
  name?: string;
  order?: string;
  general?: string;
}

@Component({
  selector: "ItemFormModal",
  standalone: true,
  imports: [
    FormsModule,
    UiAlertComponent,
    UiButtonComponent,
    UiFieldErrorComponent,
    UiFlexComponent,
    UiFormLabelComponent,
    UiGridComponent,
    UiInputComponent,
    UiLabelComponent,
    UiModalComponent,
    UiRadioComponent,
    UiSelectComponent,
    UiTextAreaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <UiModal
      [isOpen]="isOpen()"
      [showCloseButton]="false"
      className="max-w-130 p-6 lg:p-8"
      (close)="onCancel()"
    >
      <UiLabel
        type="HeadingM"
        color="textStrong"
        weight="semibold"
        className="mb-1"
      >
        {{ heading() }}
      </UiLabel>
      <UiLabel type="bodyS" color="textWeak" className="mb-5">
        {{ subheading() }}
      </UiLabel>

      <div class="mb-4">
        <UiFormLabel
          labelText="Grupo"
          [required]="true"
          [labelFor]="'catalog-group'"
          className="mb-2 block"
        />
        <UiSelect
          inputId="catalog-group"
          [options]="groupOptions"
          [searchable]="false"
          [ngModel]="form().groupCode"
          (ngModelChange)="onGroupChange($event)"
        />
      </div>

      <UiGrid [columns]="2" gap="gap-3.5" className="mb-4">
        <div>
          <UiFormLabel
            labelText="Código"
            [required]="true"
            [labelFor]="'catalog-code'"
            className="mb-2 block"
          />
          <UiInput
            id="catalog-code"
            placeholder="p. ej. REU — corto, único"
            [value]="form().code"
            (valueChange)="patch({ code: $event })"
            [errorMessage]="errors().code"
          />
          <UiFieldError
            [message]="errors().code"
            className="mt-1"
          />
        </div>
        <div>
          <UiFormLabel
            labelText="Orden"
            [required]="true"
            [labelFor]="'catalog-order'"
            className="mb-2 block"
          />
          <UiInput
            id="catalog-order"
            type="number"
            placeholder="p. ej. 1"
            [value]="form().order"
            (valueChange)="onOrderChange($event)"
            [errorMessage]="errors().order"
          />
          <UiFieldError
            [message]="errors().order"
            className="mt-1"
          />
        </div>
      </UiGrid>

      <div class="mb-4">
        <UiFormLabel
          labelText="Nombre"
          [required]="true"
          [labelFor]="'catalog-name'"
          className="mb-2 block"
        />
        <UiInput
          id="catalog-name"
          placeholder="p. ej. Reunión"
          [value]="form().name"
          (valueChange)="patch({ name: $event })"
          [errorMessage]="errors().name"
        />
        <UiFieldError [message]="errors().name" className="mt-1" />
      </div>

      <div class="mb-4">
        <UiFormLabel
          labelText="Descripción"
          [labelFor]="'catalog-description'"
          className="mb-2 block"
        />
        <UiTextArea
          id="catalog-description"
          [rows]="2"
          placeholder="Texto de ayuda opcional para el administrador."
          [value]="form().description"
          (valueChange)="patch({ description: $event })"
        />
      </div>

      <div class="mb-4">
        <UiFormLabel
          labelText="Estado"
          [labelFor]="'catalog-status'"
          className="mb-2 block"
        />
        <UiFlex direction="row" alignItems="center" [gap]="16" className="pt-1.5">
          <UiRadio
            name="catalog-status"
            value="Activo"
            [checked]="form().status === 'Activo'"
            label="Activo"
            (valueChange)="patch({ status: 'Activo' })"
          />
          <UiRadio
            name="catalog-status"
            value="Inactivo"
            [checked]="form().status === 'Inactivo'"
            label="Inactivo"
            (valueChange)="patch({ status: 'Inactivo' })"
          />
        </UiFlex>
        <UiLabel type="bodyXs" color="textWeak" className="mt-2 block">
          Los ítems inactivos no aparecen en los desplegables, pero se
          conservan en registros antiguos.
        </UiLabel>
      </div>

      @if (errors().general) {
        <UiAlert
          variant="error"
          [message]="errors().general ?? ''"
          className="mb-4"
        />
      }

      <UiFlex
        direction="row"
        justifyContent="end"
        [gap]="8"
        className="mt-4 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800"
      >
        <UiButton variant="secondary" labelText="Cancelar" (click)="onCancel()" />
        <UiButton variant="primary" labelText="Guardar" (click)="onSave()" />
      </UiFlex>
    </UiModal>
  `,
})
export class ItemFormModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly mode = input<ItemFormMode>("create");
  readonly item = input<CatalogItem | null>(null);

  readonly close = output<void>();
  readonly save = output<ItemFormSavePayload>();

  protected readonly groupOptions = CATALOG_GROUP_OPTIONS;

  protected readonly form = signal<CatalogItemFormData>(emptyCatalogItemForm());
  protected readonly errors = signal<ItemFormErrors>({});

  protected onSave(): void {
    const f = this.form();
    const next: ItemFormErrors = {};
    if (!f.code.trim()) next.code = "El código es obligatorio.";
    if (!f.name.trim()) next.name = "El nombre es obligatorio.";
    if (!f.order || f.order < 1) next.order = "El orden debe ser mayor a 0.";
    if (Object.keys(next).length > 0) {
      this.errors.set(next);
      return;
    }
    this.errors.set({});
    const m = this.mode();
    const it = this.item();
    if (m === "create") {
      this.save.emit({ mode: "create", data: { ...f } });
    } else if (it) {
      this.save.emit({ mode: "edit", id: it.id, data: { ...f } });
    }
  }

  protected readonly heading = computed<string>(() =>
    this.mode() === "create" ? "Nuevo ítem" : "Editar ítem",
  );
  protected readonly subheading = computed<string>(() =>
    "Un ítem pertenece a un grupo y aparece en su desplegable según el orden.",
  );

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (!open) {
        this.errors.set({});
        return;
      }
      const it = this.item();
      const m = this.mode();
      if (m === "edit" && it) {
        this.form.set({
          groupCode: it.groupCode,
          code: it.code,
          name: it.name,
          description: it.description,
          order: it.order,
          status: it.status,
        });
      } else {
        this.form.set(emptyCatalogItemForm());
      }
    });
  }

  protected patch(partial: Partial<CatalogItemFormData>): void {
    this.form.update((f) => ({ ...f, ...partial }));
    this.errors.update((e) => {
      const next = { ...e };
      if (partial.code !== undefined) delete next.code;
      if (partial.name !== undefined) delete next.name;
      if (partial.order !== undefined) delete next.order;
      return next;
    });
  }

  protected onGroupChange(value: unknown): void {
    this.patch({ groupCode: value as CatalogItemFormData["groupCode"] });
  }

  protected onOrderChange(value: string | number | undefined): void {
    const num = typeof value === "number" ? value : parseInt(value ?? "0", 10);
    const safe = Number.isFinite(num) && num > 0 ? num : 0;
    this.patch({ order: safe });
  }

  protected onCancel(): void {
    this.errors.set({});
    this.close.emit();
  }
}