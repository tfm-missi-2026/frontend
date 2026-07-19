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
  templateUrl: "./item-form-modal.component.html",
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