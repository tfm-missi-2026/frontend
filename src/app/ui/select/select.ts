import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostListener,
  ElementRef,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  SelectOption,
  SelectValue,
  LoadOptionsFn,
  MessageFn,
} from './select.interface';

/**
 * `SelectAsync`
 * --------------
 * Select con búsqueda, async, creatable, clearable, single/multi, error,
 * disabled/readOnly, required, etc.
 *
 * Implementa `ControlValueAccessor` por lo que se puede usar con
 * `[(ngModel)]`, `formControl` y `formControlName`.
 */
@Component({
  selector: 'SelectAsync',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy
{
  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  /** Lista de opciones a renderizar. */
  @Input() options: SelectOption[] = [];
  /** Texto mostrado cuando no hay selección. */
  @Input() placeholder = 'Seleccionar';
  /** Marca el campo como requerido (asterisco en el label). */
  @Input() required = false;
  /** Nombre del input para formularios nativos. */
  @Input() name?: string;
  /** Habilita selección múltiple. */
  @Input() isMulti = false;
  /** ID del input (útil para asociar label/htmlFor). */
  @Input() inputId?: string;
  /** Habilita el botón para limpiar el valor. */
  @Input() isClearable = false;
  /** Deshabilita el control. */
  @Input() isDisabled = false;
  /** Marca el control como solo lectura. */
  @Input() readOnly = false;
  /** Habilita input de búsqueda dentro del control. */
  @Input() searchable = true;
  /** Estado de carga externo (ej. controlado por el padre). */
  @Input() isLoading = false;
  /** Mensaje mostrado cuando `isLoading` es `true`. */
  @Input() loadingMessage: MessageFn | string = () => 'Cargando...';
  /** Mensaje mostrado cuando no hay opciones disponibles. */
  @Input() noOptionsMessage: MessageFn | string = () => 'Sin resultados';
  /** Función que decide si una opción está deshabilitada. */
  @Input() isOptionDisabled?: (option: SelectOption) => boolean;
  /** Posición CSS del menú. */
  @Input() menuPosition: 'absolute' | 'fixed' = 'absolute';
  /** Estado controlado del menú (si se define, anula el interno). */
  @Input() menuIsOpen?: boolean;
  /** Clases extra para el contenedor raíz. */
  @Input() className = '';
  /** Si `true`, presionar `Tab` selecciona la opción enfocada. */
  @Input() tabSelectsValue = true;
  /** Habilita creación de nuevas opciones. */
  @Input() creatable = false;
  /** Habilita el modo asíncrono (requiere `loadOptions`). */
  @Input() async = false;
  /** Función para cargar opciones en modo asíncrono. */
  @Input() loadOptions?: LoadOptionsFn;
  /** Ancho del contenedor (`width` CSS). */
  @Input() width?: string;
  /** Ancho mínimo del contenedor. */
  @Input() minWidth?: string;
  /** Cierra el menú al seleccionar (en single). */
  @Input() closeOnSelect = true;
  /** Opciones por defecto para el modo async (true = cargar al montar). */
  @Input() defaultOptions?: SelectOption[] | boolean;

  // ---------------------------------------------------------------------------
  // Inputs — extensiones del design system
  // ---------------------------------------------------------------------------

  /** Texto del label. */
  @Input() labelText = '';
  /** Tooltip mostrado al lado del label. */
  @Input() tooltip?: string;
  /** Mensaje de error (colorea el borde y muestra un ícono). */
  @Input() errorMessage?: string;
  /** Si `true`, el menú se abre con focus automático en el input. */
  @Input() autoFocus = false;
  /** Tiempo de debounce para el modo async (ms). */
  @Input() debounceMs = 300;

  // ---------------------------------------------------------------------------
  // Aliases retro-compatibles (estilo Angular clásico)
  // ---------------------------------------------------------------------------

  @Input() set multiple(v: boolean) {
    this.isMulti = v;
  }
  get multiple(): boolean {
    return this.isMulti;
  }

  @Input() set disabled(v: boolean) {
    this.isDisabled = v;
  }
  get disabled(): boolean {
    return this.isDisabled;
  }

  @Input() set loading(v: boolean) {
    this.isLoading = v;
  }
  get loading(): boolean {
    return this.isLoading;
  }

  @Input() set label(v: string) {
    this.labelText = v;
  }
  get label(): string {
    return this.labelText;
  }

  // ---------------------------------------------------------------------------
  // Outputs
  // ---------------------------------------------------------------------------

  @Output() selectionChange = new EventEmitter<any>();
  @Output() menuOpenChange = new EventEmitter<boolean>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() createOption = new EventEmitter<SelectOption>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  // ---------------------------------------------------------------------------
  // Estado interno
  // ---------------------------------------------------------------------------

  @ViewChild('searchInputRef') searchInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('rootRef') rootRef?: ElementRef<HTMLElement>;

  /** Valor crudo (puede ser primitivo, array u objeto opción). */
  value: any = null;

  /** Texto de búsqueda inmediato (lo que ve el input). */
  searchInput = '';

  /** Texto de búsqueda debounced (usado para filtrar y emitir). */
  search = '';

  /** Estado interno del menú (cuando no se controla con `menuIsOpen`). */
  internalOpen = false;

  /** Estado interno de carga (para `loadOptions` async). */
  internalLoading = false;

  /** Índice de la opción enfocada en el menú. */
  focusedIndex = -1;

  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;
  private cdr = inject(ChangeDetectorRef);

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  ngOnInit(): void {
    this.searchSub = this.searchSubject
      .pipe(
        debounceTime(this.debounceMs),
        distinctUntilChanged(),
      )
      .subscribe((term) => {
        this.search = term;
        this.searchChange.emit(term);
        if (this.async && this.loadOptions) {
          void this.runLoadOptions(term);
        }
        this.cdr.markForCheck();
      });

    // Cargar opciones por defecto en modo async
    if (this.async && this.loadOptions && this.defaultOptions === true) {
      void this.runLoadOptions('');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.focusedIndex = this.filteredOptions.length > 0 ? 0 : -1;
    }
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  // ===========================================================================
  // View bindings
  // ===========================================================================

  /** Estado del menú (controlado o interno). */
  get isOpen(): boolean {
    return this.menuIsOpen !== undefined ? !!this.menuIsOpen : this.internalOpen;
  }

  set isOpen(v: boolean) {
    if (this.menuIsOpen !== undefined) return; // controlado, no hacer nada
    this.internalOpen = v;
    this.menuOpenChange.emit(v);
  }

  /** Estado de carga efectivo. */
  get showLoading(): boolean {
    return this.isLoading || this.internalLoading;
  }

  /** Opciones filtradas por la búsqueda actual. */
  get filteredOptions(): SelectOption[] {
    if (this.async) return this.options;
    const term = this.searchInput?.trim().toLowerCase() ?? '';
    if (!term) return this.options;
    return this.options.filter((opt) =>
      opt.label.toLowerCase().includes(term),
    );
  }

  /** Opciones seleccionadas como objetos (modo multi). */
  get selectedOptions(): SelectOption[] {
    if (!this.isMulti) return [];
    const arr = Array.isArray(this.value) ? this.value : [];
    return this.options.filter((o) =>
      (arr as (string | number)[]).includes(o.value as string | number),
    );
  }

  /** Opción seleccionada (modo single). */
  get selectedOption(): SelectOption | null {
    if (this.isMulti) return null;
    if (this.value && typeof this.value === 'object' && 'label' in this.value) {
      return this.value as SelectOption;
    }
    return (
      this.options.find((o) => o.value === this.value) ?? null
    );
  }

  /** Label visible en modo single. */
  get displayLabel(): string {
    return this.selectedOption?.label ?? '';
  }

  /** Determina si hay valor (single o multi). */
  get hasValue(): boolean {
    if (this.isMulti) return Array.isArray(this.value) && this.value.length > 0;
    return this.value !== null && this.value !== undefined && this.value !== '';
  }

  /** Sincroniza el alias de salida `onChange` con la API del `ControlValueAccessor`. */
  onChange(value: any) {
    this.onChangeFn(value);
  }

  /** Sincroniza el alias de salida `onTouched` con la API del `ControlValueAccessor`. */
  onTouched() {
    this.onTouchedFn();
  }

  // ===========================================================================
  // Helpers de UI
  // ===========================================================================

  resolveMessage(msg: MessageFn | string | undefined): string {
    if (!msg) return '';
    return typeof msg === 'function' ? msg() : msg;
  }

  isSelected(option: SelectOption): boolean {
    if (this.isMulti) {
      const arr = Array.isArray(this.value) ? this.value : [];
      return (arr as (string | number)[]).includes(option.value as string | number);
    }
    if (this.value && typeof this.value === 'object') {
      return (this.value as SelectOption).value === option.value;
    }
    return this.value === option.value;
  }

  isOptionDisabledFn(option: SelectOption): boolean {
    if (option.disabled) return true;
    if (this.isOptionDisabled) {
      try {
        return !!this.isOptionDisabled(option);
      } catch {
        return false;
      }
    }
    return false;
  }

  trackByValue = (_: number, opt: SelectOption) => opt.value;

  // ===========================================================================
  // Interacción
  // ===========================================================================

  onControlClick(): void {
    if (this.isDisabled || this.readOnly) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      queueMicrotask(() => this.searchInputRef?.nativeElement.focus());
    }
  }

  onInputFocus(): void {
    this.focus.emit();
  }

  onInputBlur(): void {
    // El cierre del menú se hace en el HostListener del document.
    this.onTouchedFn();
    this.blur.emit();
  }

  onSearchInput(value: string): void {
    this.searchInput = value;
    if (!this.isOpen) this.isOpen = true;
    this.searchSubject.next(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled || this.readOnly) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.isOpen = true;
        this.moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.isOpen = true;
        this.moveFocus(-1);
        break;
      case 'Enter': {
        event.preventDefault();
        if (this.creatable && this.searchInput.trim() && this.filteredOptions.length === 0) {
          this.createFromInput();
          return;
        }
        const opt = this.filteredOptions[this.focusedIndex];
        if (opt && !this.isOptionDisabledFn(opt)) {
          this.selectOption(opt);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        break;
      case 'Tab':
        if (this.tabSelectsValue && this.isOpen) {
          const opt = this.filteredOptions[this.focusedIndex];
          if (opt && !this.isOptionDisabledFn(opt)) {
            event.preventDefault();
            this.selectOption(opt);
          } else {
            this.isOpen = false;
          }
        } else {
          this.isOpen = false;
        }
        break;
      case 'Backspace':
        if (
          this.isMulti &&
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
    const list = this.filteredOptions;
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

  // ---------------------------------------------------------------------------
  // Selección
  // ---------------------------------------------------------------------------

  selectOption(option: SelectOption, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.isOptionDisabledFn(option)) return;

    if (this.isMulti) {
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
      this.searchInput = '';
      this.search = '';
      this.searchSubject.next('');
      // Mantener el menú abierto en multi
    } else {
      this.value = option.value;
      this.onChangeFn(this.value);
      this.selectionChange.emit(this.value);
      this.searchInput = '';
      this.search = '';
      this.searchSubject.next('');
      if (this.closeOnSelect) this.isOpen = false;
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
    if (this.isDisabled || this.readOnly) return;
    this.value = this.isMulti ? [] : null;
    this.searchInput = '';
    this.search = '';
    this.searchSubject.next('');
    this.onChangeFn(this.value);
    this.selectionChange.emit(this.value);
  }

  createFromInput(): void {
    const label = this.searchInput.trim();
    if (!label) return;
    const newOption: SelectOption = {
      value: label,
      label,
    };
    this.options = [...this.options, newOption];
    this.createOption.emit(newOption);
    this.selectOption(newOption);
  }

  // ---------------------------------------------------------------------------
  // Async
  // ---------------------------------------------------------------------------

  private async runLoadOptions(term: string): Promise<void> {
    if (!this.loadOptions) return;
    this.internalLoading = true;
    this.cdr.markForCheck();
    try {
      const result = await this.loadOptions(term);
      this.options = result ?? [];
      this.focusedIndex = this.options.length > 0 ? 0 : -1;
    } catch {
      this.options = [];
    } finally {
      this.internalLoading = false;
      this.cdr.markForCheck();
    }
  }

  // ===========================================================================
  // ControlValueAccessor
  // ===========================================================================

  writeValue(value: SelectValue): void {
    if (this.isMulti) {
      this.value = Array.isArray(value) ? value : [];
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Si llega un objeto-option, lo aceptamos y normalizamos a primitivo
      this.value = (value as SelectOption).value;
    } else {
      this.value = value ?? null;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  // ---------------------------------------------------------------------------
  // Click-outside
  // ---------------------------------------------------------------------------

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const root = this.rootRef?.nativeElement;
    if (!root) return;
    if (!root.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }
}
