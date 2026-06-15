import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
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
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import {
  IconCheckComponent,
  IconChevronDownComponent,
  IconValidationErrorComponent,
  IconXComponent,
} from "@shared/ui/icon";
import {
  LoadOptionsFn,
  MessageFn,
  SelectOption,
  SelectValue,
} from "./select.interface";

/**
 * `UiSelect`
 * ----------
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
  ],
  templateUrl: "./select.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  // Inputs

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

  /** Texto del label. */
  readonly labelText = input<string>("");
  /** Tooltip mostrado al lado del label. */
  readonly tooltip = input<string | undefined>(undefined);
  /** Mensaje de error (colorea el borde y muestra un ícono). */
  readonly errorMessage = input<string | undefined>(undefined);
  /** Si `true`, el menú se abre con focus automático en el input. */
  readonly autoFocus = input<boolean>(false);
  /** Tiempo de debounce para el modo async (ms). */
  readonly debounceMs = input<number>(300);

  // Outputs

  readonly selectionChange = output<unknown>();
  readonly menuOpenChange = output<boolean>();
  readonly searchChange = output<string>();
  readonly createOption = output<SelectOption>();
  readonly blur = output<void>();
  readonly focus = output<void>();

  // Estado interno

  readonly searchInputRef =
    viewChild<ElementRef<HTMLInputElement>>("searchInputRef");
  readonly rootRef = viewChild<ElementRef<HTMLElement>>("rootRef");

  /** Valor crudo (puede ser primitivo, array u objeto opción). */
  value: unknown = null;

  /** Texto de búsqueda inmediato (lo que ve el input). */
  searchInput = "";

  /** Texto de búsqueda debounced (usado para filtrar y emitir). */
  search = "";

  /** Estado interno del menú (cuando no se controla con `menuIsOpen`). */
  private readonly _internalOpen = signal(false);

  /** Estado interno de carga (para `loadOptions` async). */
  internalLoading = false;

  /** Índice de la opción enfocada en el menú. */
  focusedIndex = -1;

  /**
   * Override interno de `options()` (para `createFromInput` y async load).
   * Si está definido, se usa en lugar del input. El input se ignora.
   */
  private readonly _optionsOverride = signal<SelectOption[] | null>(null);

  /**
   * Override interno de `isDisabled()` (para `setDisabledState`).
   * Si está definido, se usa en lugar del input.
   */
  private readonly _isDisabledOverride = signal<boolean | null>(null);

  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;
  private cdr = inject(ChangeDetectorRef);

  // ControlValueAccessor

  private onChangeFn: (value: unknown) => void = () => {};
  private onTouchedFn: () => void = () => {};

  ngOnInit(): void {
    this.searchSub = this.searchSubject
      .pipe(debounceTime(this.debounceMs()), distinctUntilChanged())
      .subscribe((term) => {
        this.search = term;
        this.searchChange.emit(term);
        if (this.async() && this.loadOptions()) {
          void this.runLoadOptions(term);
        }
        this.cdr.markForCheck();
      });

    if (this.async() && this.loadOptions() && this.defaultOptions() === true) {
      void this.runLoadOptions("");
    }
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  // View bindings (computed)

  /** `options` efectivo (override del CVA si está, sino el input). */
  readonly effectiveOptions = computed<SelectOption[]>(
    () => this._optionsOverride() ?? this.options(),
  );

  /** `isDisabled` efectivo (override del CVA si está, sino el input). */
  readonly effectiveIsDisabled = computed<boolean>(
    () => this._isDisabledOverride() ?? this.isDisabled(),
  );

  readonly isOpen = computed<boolean>(() =>
    this.menuIsOpen() !== undefined
      ? !!this.menuIsOpen()
      : this._internalOpen(),
  );

  readonly showLoading = computed<boolean>(
    () => this.isLoading() || this.internalLoading,
  );

  readonly filteredOptions = computed<SelectOption[]>(() => {
    if (this.async()) return this.effectiveOptions();
    const term = this.searchInput?.trim().toLowerCase() ?? "";
    if (!term) return this.effectiveOptions();
    return this.effectiveOptions().filter((opt) =>
      opt.label.toLowerCase().includes(term),
    );
  });

  readonly selectedOptions = computed<SelectOption[]>(() => {
    if (!this.isMulti()) return [];
    const arr = Array.isArray(this.value) ? this.value : [];
    return this.effectiveOptions().filter((o) =>
      (arr as (string | number)[]).includes(o.value as string | number),
    );
  });

  readonly selectedOption = computed<SelectOption | null>(() => {
    if (this.isMulti()) return null;
    if (
      this.value &&
      typeof this.value === "object" &&
      "label" in (this.value as object)
    ) {
      return this.value as SelectOption;
    }
    return this.effectiveOptions().find((o) => o.value === this.value) ?? null;
  });

  readonly displayLabel = computed<string>(
    () => this.selectedOption()?.label ?? "",
  );

  readonly hasValue = computed<boolean>(() => {
    if (this.isMulti())
      return Array.isArray(this.value) && this.value.length > 0;
    return this.value !== null && this.value !== undefined && this.value !== "";
  });

  onChange(value: unknown): void {
    this.onChangeFn(value);
  }

  onTouched(): void {
    this.onTouchedFn();
  }

  // ---------------------------------------------------------------------------
  // Helpers de UI
  // ---------------------------------------------------------------------------

  resolveMessage(msg: MessageFn | string | undefined): string {
    if (!msg) return "";
    return typeof msg === "function" ? (msg as MessageFn)() : (msg as string);
  }

  isSelected(option: SelectOption): boolean {
    if (this.isMulti()) {
      const arr = Array.isArray(this.value) ? this.value : [];
      return (arr as (string | number)[]).includes(
        option.value as string | number,
      );
    }
    if (this.value && typeof this.value === "object") {
      return (this.value as SelectOption).value === option.value;
    }
    return this.value === option.value;
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

  trackByValue = (_: number, opt: SelectOption): unknown => opt.value;

  // Interacción

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
    this.searchInput = value;
    if (!this.isOpen()) this.setOpen(true);
    this.searchSubject.next(value);
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
          this.searchInput.trim() &&
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
      case "Backspace":
        if (
          this.isMulti() &&
          !this.searchInput &&
          Array.isArray(this.value) &&
          this.value.length > 0
        ) {
          this.removeAt(this.value.length - 1);
        }
        break;
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

  // Selección

  selectOption(option: SelectOption, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isOptionDisabledFn(option)) return;

    if (this.isMulti()) {
      const arr = Array.isArray(this.value) ? [...this.value] : [];
      const idx = (arr as (string | number)[]).indexOf(
        option.value as string | number,
      );
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        (arr as (string | number)[]).push(option.value as string | number);
      }
      this.value = arr;
      this.onChangeFn(this.value);
      this.selectionChange.emit(this.value);
      this.searchInput = "";
      this.search = "";
      this.searchSubject.next("");
    } else {
      this.value = option.value;
      this.onChangeFn(this.value);
      this.selectionChange.emit(this.value);
      this.searchInput = "";
      this.search = "";
      this.searchSubject.next("");
      if (this.closeOnSelect()) this.setOpen(false);
    }
  }

  removeAt(index: number, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!Array.isArray(this.value)) return;
    const arr = [...this.value];
    arr.splice(index, 1);
    this.value = arr;
    this.onChangeFn(this.value);
    this.selectionChange.emit(this.value);
  }

  clearValue(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.effectiveIsDisabled() || this.readOnly()) return;
    this.value = this.isMulti() ? [] : null;
    this.searchInput = "";
    this.search = "";
    this.searchSubject.next("");
    this.onChangeFn(this.value);
    this.selectionChange.emit(this.value);
  }

  createFromInput(): void {
    const label = this.searchInput.trim();
    if (!label) return;
    const newOption: SelectOption = { value: label, label };
    this._optionsOverride.set([...this.effectiveOptions(), newOption]);
    this.createOption.emit(newOption);
    this.selectOption(newOption);
  }

  // Async

  private async runLoadOptions(term: string): Promise<void> {
    const fn = this.loadOptions();
    if (!fn) return;
    this.internalLoading = true;
    this.cdr.markForCheck();
    try {
      const result = await fn(term);
      this._optionsOverride.set(result ?? []);
      this.focusedIndex = (result ?? []).length > 0 ? 0 : -1;
    } catch {
      this._optionsOverride.set([]);
    } finally {
      this.internalLoading = false;
      this.cdr.markForCheck();
    }
  }

  // ControlValueAccessor

  writeValue(value: SelectValue): void {
    if (this.isMulti()) {
      this.value = Array.isArray(value) ? value : [];
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      this.value = (value as SelectOption).value;
    } else {
      this.value = value ?? null;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabledOverride.set(isDisabled);
    this.cdr.markForCheck();
  }

  // Click-outside

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const root = this.rootRef()?.nativeElement;
    if (!root) return;
    if (!root.contains(event.target as Node)) {
      this.setOpen(false);
    }
  }
}
