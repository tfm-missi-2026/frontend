import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { FlexComponent } from '@ui/flex/flex';
import { FormLabelComponent } from '@ui/form-label/form-label';
import { LabelComponent } from '@ui/label/label';
import { ColorType } from '@styles/types/colors';
import { FontWeightType } from '@styles/types/typography';
import { getFocusStyling } from '@utils/styling';

import { ValidationErrorIconComponent } from './validation-error-icon';
import {
  horizontalPaddingNumber,
  inputHeight,
} from './common';

/**
 * `Input`
 * -------
 * Input de texto con label, iconos, prefix/sufix, error y contador.
 * Réplica Angular del `Input` del proyecto React (styled-components).
 *
 * Capacidades:
 *  - Label integrable vía `<FormLabel>` (asterisco `*` automático).
 *  - Tooltip junto al label.
 *  - Iconos izquierda/derecha como **componentes Angular** (`Type<unknown>`)
 *    que se renderizan con `*ngComponentOutlet`.
 *  - Prefix / sufix en línea (`Label` con `color="textAction"`).
 *  - Estado de error: borde rojo + `<ValidationErrorIcon>` a la derecha.
 *  - Estado `disabled` / `readOnly`: cambio de color de fondo y borde.
 *  - Contador `N/maxLength` debajo del input, alineado según `legend`.
 *  - `ControlValueAccessor` para integración con `ngModel` / `formControl`.
 *  - Debounce opcional en `valueChange` cuando el input es no-controlado.
 *  - Método público `focus()` para exponer el `focus` del `<input>`.
 *
 * Convención de outputs (Angular):
 *  - `onChange` (React)  → `valueChange`
 *  - `onEnterKey` (React) → `enterKey`
 *  - `onKeyDown` (React)  → `keyDown`
 */
@Component({
  selector: 'Input',
  standalone: true,
  imports: [
    CommonModule,
    FlexComponent,
    FormLabelComponent,
    LabelComponent,
    ValidationErrorIconComponent,
  ],
  templateUrl: './input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  @Input() id?: string;
  @Input() name?: string;
  @Input() labelText?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() tooltip?: string;
  @Input() errorMessage?: string;
  @Input() readOnly = false;
  @Input() placeholder?: string;
  @Input() leftIcon?: Type<unknown>;
  @Input() rightIcon?: Type<unknown>;
  @Input() prefix?: string;
  @Input() sufix?: string;
  @Input() flex?: string;
  @Input() maxLength?: number;
  @Input() debounceTime?: number;
  @Input() width?: string;
  @Input() legend?: string;
  @Input() type = 'text';
  @Input() autocomplete?: string;
  @Input() className = '';

  /** Valor controlado. Se sincroniza vía `ControlValueAccessor`. */
  @Input() value?: string | number;

  // ---------------------------------------------------------------------------
  // Outputs
  // ---------------------------------------------------------------------------

  @Output() valueChange = new EventEmitter<string>();
  @Output() enterKey = new EventEmitter<KeyboardEvent>();
  @Output() keyDown = new EventEmitter<KeyboardEvent>();
  @Output() blurEvt = new EventEmitter<void>();
  @Output() focusEvt = new EventEmitter<void>();

  // ---------------------------------------------------------------------------
  // ViewChild / estado interno
  // ---------------------------------------------------------------------------

  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  /** Valor interno (lo que ve el `<input>`). Se sincroniza con `value`. */
  internalValue = '';

  /** Contador de caracteres actual (para `maxLength`). */
  charCount = 0;

  private timer?: ReturnType<typeof setTimeout>;
  private cdr = inject(ChangeDetectorRef);
  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  ngOnInit(): void {
    this.syncFromValue();
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  // ---------------------------------------------------------------------------
  // API pública
  // ---------------------------------------------------------------------------

  /**
   * Foco programático en el `<input>`.
   * (Se llama `focusInput` para no chocar con el `Output() focusEvt`.)
   */
  focusInput(): void {
    this.inputEl?.nativeElement.focus();
  }

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  writeValue(value: string | number | null | undefined): void {
    this.value = value ?? '';
    this.syncFromValue();
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const next = target.value;
    this.internalValue = next;
    this.charCount = next.length;

    if (this.debounceTime && this.debounceTime > 0) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.value = next;
        this.valueChange.emit(next);
        this.onChangeFn(next);
      }, this.debounceTime);
    } else {
      this.value = next;
      this.valueChange.emit(next);
      this.onChangeFn(next);
    }
  }

  onKeyDownHandler(event: KeyboardEvent): void {
    this.keyDown.emit(event);
    if (event.key === 'Enter' || event.keyCode === 13) {
      this.enterKey.emit(event);
    }
  }

  onFocusHandler(): void {
    this.focusEvt.emit();
  }

  onBlurHandler(): void {
    this.onTouchedFn();
    this.blurEvt.emit();
  }

  // ---------------------------------------------------------------------------
  // Helpers privados
  // ---------------------------------------------------------------------------

  private syncFromValue(): void {
    this.internalValue = this.value?.toString() ?? '';
    this.charCount = this.internalValue.length;
  }

  // ---------------------------------------------------------------------------
  // Getters de presentación
  // ---------------------------------------------------------------------------

  get hasLeftIcon(): boolean {
    return !!this.leftIcon;
  }

  get hasRightIcon(): boolean {
    return !!this.rightIcon;
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get isEffectivelyDisabled(): boolean {
    return this.disabled;
  }

  /** Clases del contenedor exterior (`StyledControlContainer`). */
  get outerClasses(): string {
    return [
      'flex flex-col gap-1 w-full font-outfit',
      this.className,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get outerStyles(): Record<string, string> {
    return {
      flex: this.flex ?? '',
      width: this.width ?? '',
    };
  }

  /** Clases del `StyledInputContainer` (el "frame" del input). */
  get containerClasses(): string {
    const baseLayout = [
      'flex items-center gap-2 w-full rounded-lg border border-solid',
      'bg-white dark:bg-gray-900',
      this.isEffectivelyDisabled || this.readOnly
        ? 'bg-gray-50 border-gray-300'
        : this.hasError
          ? 'border-error-500'
          : 'border-gray-300',
      getFocusStyling('within'),
    ];
    return baseLayout.join(' ');
  }

  get containerStyles(): Record<string, string> {
    return {
      height: inputHeight,
      'font-size': `var(--text-theme-sm)` /* fallback */,
      'padding-left': this.hasLeftIcon ? '0' : `${horizontalPaddingNumber}px`,
      'padding-right': this.hasRightIcon ? '0' : `${horizontalPaddingNumber}px`,
    };
  }

  /** Clases del `<input>` real (`StyledInput`). */
  get inputClasses(): string {
    return [
      'flex-1 w-full border-0 outline-0 bg-transparent',
      'text-sm text-gray-800 dark:text-white',
      'font-normal leading-5',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      'read-only:text-gray-500',
      'disabled:text-gray-300',
    ].join(' ');
  }

  /** Color efectivo de los iconos en función del estado. */
  get iconColor(): string {
    if (this.hasError) return 'var(--color-error-500)';
    if (this.isEffectivelyDisabled || this.readOnly) return 'var(--color-gray-300)';
    return 'var(--color-gray-500)';
  }

  /** Inputs por defecto para los iconos (componente externo). */
  get leftIconInputs(): Record<string, unknown> {
    return { color: this.iconColor, size: 16 };
  }

  get rightIconInputs(): Record<string, unknown> {
    return this.leftIconInputs;
  }

  /** Color del contador `N/maxLength` (cambia a `textAction` al alcanzar el límite). */
  get charCountColor(): ColorType {
    const limit = this.maxLength ?? Infinity;
    return this.charCount < limit ? 'textWeakest' : 'textAction';
  }

  /** Texto del contador. */
  get charCountText(): string {
    return `${this.charCount}/${this.maxLength ?? 0}`;
  }

  /** Pesos para `legend` y char count (alineado con la convención de typography). */
  readonly charCountWeight: FontWeightType = 'regular';
  readonly legendWeight: FontWeightType = 'regular';

  /** Justify del footer según la combinación `legend` + `maxLength`. */
  get footerJustifyContent(): string {
    const hasLegend = !!this.legend;
    const hasMax = !!this.maxLength;
    if (hasLegend && hasMax) return 'space-between';
    if (hasLegend) return 'flex-start';
    return 'flex-end';
  }
}
