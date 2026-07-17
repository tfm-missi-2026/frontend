import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { NgClass } from "@angular/common";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";

import {
  IconCheckComponent,
  IconChevronDownComponent,
  IconValidationErrorComponent,
  IconXComponent,
} from "@shared/icons";
import { UiFieldErrorComponent } from "@shared/ui/field-error";
import { UiFieldValueComponent } from "@shared/ui/field-value";
import { UiFormLabelComponent } from "@shared/ui/form-label";
import { UiSelectChipComponent } from "@shared/ui/select-chip";
import {
  LoadOptionsFn,
  MessageFn,
  SelectOption,
  SelectValue,
} from "./select.types";
import { resolveMessage, trackByValue } from "./select.utils";

/**
 * `UiSelect`
 * Select con búsqueda, async, creatable, clearable, single/multi, error,
 * disabled/readOnly, required, etc.
 *
 * Implementa `ControlValueAccessor` por lo que se puede usar con
 * `[(ngModel)]`, `formControl` y `formControlName`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiSelect",
  standalone: true,
  imports: [
    FormsModule,
    IconCheckComponent,
    IconChevronDownComponent,
    IconValidationErrorComponent,
    IconXComponent,
    UiFieldErrorComponent,
    UiFieldValueComponent,
    UiFormLabelComponent,
    UiSelectChipComponent,
  ],
  templateUrl: "./select.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelectComponent implements ControlValueAccessor {
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input<string>("Seleccionar");
  readonly required = input<boolean>(false);
  readonly name = input<string | undefined>(undefined);
  readonly isMulti = input<boolean>(false);
  readonly inputId = input<string | undefined>(undefined);
  readonly isClearable = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly readOnly = input<boolean>(false);
  readonly searchable = input<boolean>(true);
  readonly isLoading = input<boolean>(false);
  readonly loadingMessage = input<MessageFn | string>(() => "Cargando...");
  readonly noOptionsMessage = input<MessageFn | string>(() => "Sin resultados");
  readonly isOptionDisabled = input<
    ((option: SelectOption) => boolean) | undefined
  >(undefined);
  readonly menuPosition = input<"absolute" | "fixed">("absolute");
  readonly menuIsOpen = input<boolean | undefined>(undefined);
  readonly className = input<string>("");
  readonly tabSelectsValue = input<boolean>(true);
  readonly creatable = input<boolean>(false);
  readonly async = input<boolean>(false);
  readonly loadOptions = input<LoadOptionsFn | undefined>(undefined);
  readonly width = input<string | undefined>(undefined);
  readonly minWidth = input<string | undefined>(undefined);
  readonly closeOnSelect = input<boolean>(true);
  readonly defaultOptions = input<SelectOption[] | boolean | undefined>(
    undefined,
  );

  readonly labelText = input<string>("");
  readonly tooltip = input<string | undefined>(undefined);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly autoFocus = input<boolean>(false);
  readonly debounceMs = input<number>(300);

  readonly selectionChange = output<unknown>();
  readonly menuOpenChange = output<boolean>();
  readonly searchChange = output<string>();
  readonly createOption = output<SelectOption>();
  readonly blur = output<void>();
  readonly focus = output<void>();

  readonly searchInputRef =
    viewChild<ElementRef<HTMLInputElement>>("searchInputRef");
  readonly rootRef = viewChild<ElementRef<HTMLElement>>("rootRef");

  readonly value = signal<unknown>(null);
  readonly searchInput = signal<string>("");
  readonly search = signal<string>("");
  readonly internalLoading = signal<boolean>(false);
  focusedIndex = -1;

  private readonly _internalOpen = signal(false);
  private readonly _optionsOverride = signal<SelectOption[] | null>(null);
  private readonly _isDisabledOverride = signal<boolean | null>(null);
  private readonly _lastDebouncedTerm = signal<string | null>(null);

  private onChangeFn: (value: unknown) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor() {
    effect((onCleanup) => {
      const term = this.searchInput();
      const ms = this.debounceMs();
      const last = this._lastDebouncedTerm();
      if (term === last) return;

      const handle = setTimeout(() => {
        this._lastDebouncedTerm.set(term);
        this.search.set(term);
        this.searchChange.emit(term);
        if (this.async() && this.loadOptions()) {
          void this.runLoadOptions(term);
        }
      }, ms);

      onCleanup(() => clearTimeout(handle));
    });

    effect(() => {
      if (
        this.async() &&
        this.loadOptions() &&
        this.defaultOptions() === true
      ) {
        void this.runLoadOptions("");
      }
    });
  }

  readonly effectiveOptions = computed<SelectOption[]>(
    () => this._optionsOverride() ?? this.options(),
  );

  readonly effectiveIsDisabled = computed<boolean>(
    () => this._isDisabledOverride() ?? this.isDisabled(),
  );

  readonly isOpen = computed<boolean>(() =>
    this.menuIsOpen() !== undefined
      ? !!this.menuIsOpen()
      : this._internalOpen(),
  );

  readonly showLoading = computed<boolean>(
    () => this.isLoading() || this.internalLoading(),
  );

  readonly filteredOptions = computed<SelectOption[]>(() => {
    if (this.async()) return this.effectiveOptions();
    const term = this.searchInput().trim().toLowerCase();
    if (!term) return this.effectiveOptions();
    return this.effectiveOptions().filter((opt) =>
      opt.label.toLowerCase().includes(term),
    );
  });

  readonly selectedOptions = computed<SelectOption[]>(() => {
    if (!this.isMulti()) return [];
    const value = this.value();
    const arr = Array.isArray(value) ? value : [];
    return this.effectiveOptions().filter((o) =>
      (arr as (string | number)[]).includes(o.value as string | number),
    );
  });

  readonly selectedOption = computed<SelectOption | null>(() => {
    if (this.isMulti()) return null;
    const value = this.value();
    if (value && typeof value === "object" && "label" in (value as object)) {
      return value as SelectOption;
    }
    return this.effectiveOptions().find((o) => o.value === value) ?? null;
  });

  readonly displayLabel = computed<string>(
    () => this.selectedOption()?.label ?? "",
  );

  readonly hasValue = computed<boolean>(() => {
    if (this.isMulti()) {
      const v = this.value();
      return Array.isArray(v) && v.length > 0;
    }
    const v = this.value();
    return v !== null && v !== undefined && v !== "";
  });

  readonly widthClass = computed<string>(() => this.width() ?? "w-full");

  readonly minWidthClass = computed<string>(() => {
    const v = this.minWidth();
    return v ? `min-w-[${v}]` : "";
  });

  readonly resolveMessage = resolveMessage;
  readonly trackByValue = trackByValue;

  onChange(value: unknown): void {
    this.onChangeFn(value);
  }

  onTouched(): void {
    this.onTouchedFn();
  }

  isSelected(option: SelectOption): boolean {
    const value = this.value();
    if (this.isMulti()) {
      const arr = Array.isArray(value) ? value : [];
      return (arr as (string | number)[]).includes(
        option.value as string | number,
      );
    }
    if (value && typeof value === "object") {
      return (value as SelectOption).value === option.value;
    }
    return value === option.value;
  }

  isOptionDisabledFn(option: SelectOption): boolean {
    if (option.disabled) return true;
    const fn = this.isOptionDisabled();
    if (fn) {
      try {
        return !!fn(option);
      } catch {
        return false;
      }
    }
    return false;
  }

  onControlClick(): void {
    if (this.effectiveIsDisabled() || this.readOnly()) return;
    this.setOpen(!this.isOpen());
    if (this.isOpen()) {
      queueMicrotask(() => this.searchInputRef()?.nativeElement.focus());
    }
  }

  onInputFocus(): void {
    this.focus.emit();
  }

  onInputBlur(): void {
    this.onTouchedFn();
    this.blur.emit();
  }

  onSearchInput(value: string): void {
    this.searchInput.set(value);
    if (!this.isOpen()) this.setOpen(true);
  }

  setOpen(v: boolean): void {
    if (this.menuIsOpen() !== undefined) return;
    this._internalOpen.set(v);
    this.menuOpenChange.emit(v);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.effectiveIsDisabled() || this.readOnly()) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.setOpen(true);
        this.moveFocus(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.setOpen(true);
        this.moveFocus(-1);
        break;
      case "Enter": {
        event.preventDefault();
        if (
          this.creatable() &&
          this.searchInput().trim() &&
          this.filteredOptions().length === 0
        ) {
          this.createFromInput();
          return;
        }
        const opt = this.filteredOptions()[this.focusedIndex];
        if (opt && !this.isOptionDisabledFn(opt)) {
          this.selectOption(opt);
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        this.setOpen(false);
        break;
      case "Tab":
        if (this.tabSelectsValue() && this.isOpen()) {
          const opt = this.filteredOptions()[this.focusedIndex];
          if (opt && !this.isOptionDisabledFn(opt)) {
            event.preventDefault();
            this.selectOption(opt);
          } else {
            this.setOpen(false);
          }
        } else {
          this.setOpen(false);
        }
        break;
      case "Backspace": {
        const currentValue = this.value();
        if (
          this.isMulti() &&
          !this.searchInput() &&
          Array.isArray(currentValue) &&
          currentValue.length > 0
        ) {
          this.removeAt(currentValue.length - 1);
        }
        break;
      }
    }
  }

  moveFocus(direction: 1 | -1): void {
    const list = this.filteredOptions();
    if (!list.length) {
      this.focusedIndex = -1;
      return;
    }
    let next = this.focusedIndex + direction;
    while (
      next >= 0 &&
      next < list.length &&
      this.isOptionDisabledFn(list[next])
    ) {
      next += direction;
    }
    if (next < 0) next = list.length - 1;
    if (next >= list.length) next = 0;
    this.focusedIndex = next;
  }

  setHoverIndex(index: number): void {
    this.focusedIndex = index;
  }

  selectOption(option: SelectOption, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isOptionDisabledFn(option)) return;

    if (this.isMulti()) {
      const current = this.value();
      const arr = Array.isArray(current) ? [...current] : [];
      const idx = (arr as (string | number)[]).indexOf(
        option.value as string | number,
      );
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        (arr as (string | number)[]).push(option.value as string | number);
      }
      this.value.set(arr);
      this.onChangeFn(arr);
      this.selectionChange.emit(arr);
      this.searchInput.set("");
      this.search.set("");
    } else {
      this.value.set(option.value);
      this.onChangeFn(option.value);
      this.selectionChange.emit(option.value);
      this.searchInput.set("");
      this.search.set("");
      if (this.closeOnSelect()) this.setOpen(false);
    }
  }

  removeAt(index: number, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const current = this.value();
    if (!Array.isArray(current)) return;
    const arr = [...current];
    arr.splice(index, 1);
    this.value.set(arr);
    this.onChangeFn(arr);
    this.selectionChange.emit(arr);
  }

  clearValue(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.effectiveIsDisabled() || this.readOnly()) return;
    this.value.set(this.isMulti() ? [] : null);
    this.searchInput.set("");
    this.search.set("");
    this.onChangeFn(this.value());
    this.selectionChange.emit(this.value());
  }

  createFromInput(): void {
    const label = this.searchInput().trim();
    if (!label) return;
    const newOption: SelectOption = { value: label, label };
    this._optionsOverride.set([...this.effectiveOptions(), newOption]);
    this.createOption.emit(newOption);
    this.selectOption(newOption);
  }

  private async runLoadOptions(term: string): Promise<void> {
    const fn = this.loadOptions();
    if (!fn) return;
    this.internalLoading.set(true);
    try {
      const result = await fn(term);
      this._optionsOverride.set(result ?? []);
      this.focusedIndex = (result ?? []).length > 0 ? 0 : -1;
    } catch {
      this._optionsOverride.set([]);
    } finally {
      this.internalLoading.set(false);
    }
  }

  writeValue(value: SelectValue): void {
    if (this.isMulti()) {
      this.value.set(Array.isArray(value) ? value : []);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      this.value.set((value as SelectOption).value);
    } else {
      this.value.set(value ?? null);
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabledOverride.set(isDisabled);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const root = this.rootRef()?.nativeElement;
    if (!root) return;
    if (!root.contains(event.target as Node)) {
      this.setOpen(false);
    }
  }
}
