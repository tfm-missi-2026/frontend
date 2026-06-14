import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  Type,
  viewChild,
} from "@angular/core";
import { NgComponentOutlet } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { UiLabelComponent } from "@ui/label/label";
import { ColorType } from "@styles/types/colors";
import { FontWeightType } from "@styles/types/typography";
import { getFocusStyling } from "@utils/styling";

import { ValidationErrorIconComponent } from "./validation-error-icon";
import { horizontalPaddingNumber, inputHeight } from "./common";
import { UiFlexComponent } from "@ui/flex/flex";
import { UiFormLabelComponent } from "@ui/form-label/form-label";

/**
 * `UiInput`
 * --------
 * Input de texto con label, iconos, prefix/sufix, error y contador.
 *
 * Capacidades:
 *  - Label integrable vía `<UiFormLabel>` (asterisco `*` automático).
 *  - Tooltip junto al label.
 *  - Iconos izquierda/derecha como **componentes Angular** (`Type<unknown>`)
 *    que se renderizan con `*ngComponentOutlet`.
 *  - Prefix / sufix en línea (`UiLabel` con `color="textAction"`).
 *  - Estado de error: borde rojo + `<ValidationErrorIcon>` a la derecha.
 *  - Estado `disabled` / `readOnly`: cambio de color de fondo y borde.
 *  - Contador `N/maxLength` debajo del input, alineado según `legend`.
 *  - `ControlValueAccessor` para integración con `ngModel` / `formControl`.
 *  - Debounce opcional en `valueChange` cuando el input es no-controlado.
 *  - Método público `focusInput()` para exponer el `focus` del `<input>`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiInput",
  standalone: true,
  imports: [
    NgComponentOutlet,
    UiFlexComponent,
    UiFormLabelComponent,
    UiLabelComponent,
    ValidationErrorIconComponent,
  ],
  templateUrl: "./input.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
})
export class UiInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly labelText = input<string | undefined>(undefined);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly tooltip = input<string | undefined>(undefined);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly readOnly = input<boolean>(false);
  readonly placeholder = input<string | undefined>(undefined);
  readonly leftIcon = input<Type<unknown> | undefined>(undefined);
  readonly rightIcon = input<Type<unknown> | undefined>(undefined);
  readonly prefix = input<string | undefined>(undefined);
  readonly sufix = input<string | undefined>(undefined);
  readonly flex = input<string | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);
  readonly debounceTime = input<number | undefined>(undefined);
  readonly width = input<string | undefined>(undefined);
  readonly legend = input<string | undefined>(undefined);
  readonly type = input<string>("text");
  readonly autocomplete = input<string | undefined>(undefined);
  readonly className = input<string>("");
  /** Valor controlado. Se sincroniza vía `ControlValueAccessor`. */
  readonly value = input<string | number | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly enterKey = output<KeyboardEvent>();
  readonly keyDown = output<KeyboardEvent>();
  readonly blurEvt = output<void>();
  readonly focusEvt = output<void>();

  readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>("inputEl");

  /** Valor interno (lo que ve el `<input>`). Se sincroniza con `value`. */
  internalValue = "";

  /** Contador de caracteres actual (para `maxLength`). */
  charCount = 0;

  /**
   * Estado `disabled` que llega desde el `FormControl` (vía
   * `setDisabledState`). No se puede escribir al `disabled` input signal
   * (es read-only), así que se combina con él en un `computed`.
   */
  private _formDisabled = signal(false);

  /** `disabled` efectivo: combina el input y el estado del form. */
  readonly isDisabled = computed<boolean>(
    () => this.disabled() || this._formDisabled(),
  );

  private timer?: ReturnType<typeof setTimeout>;
  private cdr = inject(ChangeDetectorRef);
  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  ngOnInit(): void {
    this.syncFromValue();
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  /**
   * Foco programático en el `<input>`.
   * (Se llama `focusInput` para no chocar con el `Output() focusEvt`.)
   */
  focusInput(): void {
    this.inputEl()?.nativeElement.focus();
  }

  writeValue(value: string | number | null | undefined): void {
    this.internalValue = (value ?? "").toString();
    this.charCount = this.internalValue.length;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const next = target.value;
    this.internalValue = next;
    this.charCount = next.length;

    const debounce = this.debounceTime();
    if (debounce && debounce > 0) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.onChangeFn(next);
        this.valueChange.emit(next);
      }, debounce);
    } else {
      this.onChangeFn(next);
      this.valueChange.emit(next);
    }
  }

  onKeyDownHandler(event: KeyboardEvent): void {
    this.keyDown.emit(event);
    if (event.key === "Enter" || event.keyCode === 13) {
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

  private syncFromValue(): void {
    const v = this.value();
    this.internalValue = v?.toString() ?? "";
    this.charCount = this.internalValue.length;
  }

  readonly hasLeftIcon = computed<boolean>(() => !!this.leftIcon());
  readonly hasRightIcon = computed<boolean>(() => !!this.rightIcon());
  readonly hasError = computed<boolean>(() => !!this.errorMessage());
  readonly isEffectivelyDisabled = computed<boolean>(() => this.disabled());

  /** Clases del contenedor exterior (`StyledControlContainer`). */
  readonly outerClasses = computed<string>(() =>
    ["flex flex-col gap-1 w-full font-outfit", this.className()]
      .filter(Boolean)
      .join(" "),
  );

  readonly outerStyles = computed<Record<string, string>>(() => ({
    flex: this.flex() ?? "",
    width: this.width() ?? "",
  }));

  /** Clases del `StyledInputContainer` (el "frame" del input). */
  readonly containerClasses = computed<string>(() => {
    const baseLayout = [
      "flex items-center gap-2 w-full rounded-lg border border-solid",
      "bg-white dark:bg-gray-900",
      this.isEffectivelyDisabled() || this.readOnly()
        ? "bg-gray-50 border-gray-300"
        : this.hasError()
          ? "border-error-500"
          : "border-gray-300",
      getFocusStyling("within"),
    ];
    return baseLayout.join(" ");
  });

  readonly containerStyles = computed<Record<string, string>>(() => ({
    height: inputHeight,
    "font-size": `var(--text-theme-sm)` /* fallback */,
    "padding-left": this.hasLeftIcon() ? "0" : `${horizontalPaddingNumber}px`,
    "padding-right": this.hasRightIcon() ? "0" : `${horizontalPaddingNumber}px`,
  }));

  /** Clases del `<input>` real (`StyledInput`). */
  readonly inputClasses = computed<string>(() =>
    [
      "flex-1 w-full border-0 outline-0 bg-transparent",
      "text-sm text-gray-800 dark:text-white",
      "font-normal leading-5",
      "placeholder:text-gray-400 dark:placeholder:text-gray-500",
      "read-only:text-gray-500",
      "disabled:text-gray-300",
    ].join(" "),
  );

  /** Color efectivo de los iconos en función del estado. */
  readonly iconColor = computed<string>(() => {
    if (this.hasError()) return "var(--color-error-500)";
    if (this.isEffectivelyDisabled() || this.readOnly())
      return "var(--color-gray-300)";
    return "var(--color-gray-500)";
  });

  /** Inputs por defecto para los iconos (componente externo). */
  readonly leftIconInputs = computed<Record<string, unknown>>(() => ({
    color: this.iconColor(),
    size: 16,
  }));

  readonly rightIconInputs = computed<Record<string, unknown>>(() =>
    this.leftIconInputs(),
  );

  /** Color del contador `N/maxLength` (cambia a `textAction` al alcanzar el límite). */
  readonly charCountColor = computed<ColorType>(() => {
    const limit = this.maxLength() ?? Infinity;
    return this.charCount < limit ? "textWeakest" : "textAction";
  });

  /** Texto del contador. */
  readonly charCountText = computed<string>(
    () => `${this.charCount}/${this.maxLength() ?? 0}`,
  );

  /** Pesos para `legend` y char count (alineado con la convención de typography). */
  readonly charCountWeight: FontWeightType = "regular";
  readonly legendWeight: FontWeightType = "regular";

  /** Justify del footer según la combinación `legend` + `maxLength`. */
  readonly footerJustifyContent = computed<string>(() => {
    const hasLegend = !!this.legend();
    const hasMax = !!this.maxLength();
    if (hasLegend && hasMax) return "space-between";
    if (hasLegend) return "flex-start";
    return "flex-end";
  });
}
