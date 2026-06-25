import {
  ChangeDetectionStrategy,
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

import {
  IconEyeOffComponent,
  IconEyeOpenComponent,
} from "@shared/icons";
import { ColorType, COLOR_CLASSES } from "@styles/types/colors";
import { FontWeightType } from "@styles/types/typography";
import { getFocusStyling } from "@utils/styling";

import { ValidationErrorIconComponent } from "./validation-error-icon.component";
import { horizontalPaddingNumber, inputHeight } from "./common";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { UiFormLabelComponent } from "@shared/ui/form-label/form-label.component";

const SHOW_PASSWORD_LABEL = "Mostrar contraseña";
const HIDE_PASSWORD_LABEL = "Ocultar contraseña";

// Input de texto con label, iconos, prefix/sufix, error y contador. Integra
// `ControlValueAccessor` para `ngModel`/`formControl` y soporta debounce.
@Component({
  selector: "UiInput",
  standalone: true,
  imports: [
    NgComponentOutlet,
    UiFormLabelComponent,
    UiLabelComponent,
    ValidationErrorIconComponent,
  ],
  templateUrl: "./input.component.html",
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
  readonly showPasswordToggle = input<boolean>(false);
  readonly passwordVisibleIcon = input<Type<unknown>>(IconEyeOpenComponent);
  readonly passwordHiddenIcon = input<Type<unknown>>(IconEyeOffComponent);
  readonly value = input<string | number | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly enterKey = output<KeyboardEvent>();
  readonly keyDown = output<KeyboardEvent>();
  readonly blurEvt = output<void>();
  readonly focusEvt = output<void>();
  readonly passwordVisibilityChange = output<boolean>();

  readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>("inputEl");

  readonly internalValue = signal<string>("");
  readonly charCount = signal<number>(0);

  private _formDisabled = signal(false);
  protected readonly _passwordVisible = signal(false);

  readonly isEffectivelyDisabled = computed<boolean>(
    () => this.disabled() || this._formDisabled(),
  );

  private timer?: ReturnType<typeof setTimeout>;
  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  ngOnInit(): void {
    this.syncFromValue();
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  focusInput(): void {
    this.inputEl()?.nativeElement.focus();
  }

  writeValue(value: string | number | null | undefined): void {
    this.setValue(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.setValue(next);

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
    this.setValue(this.value());
  }

  private setValue(value: string | number | null | undefined): void {
    const next = (value ?? "").toString();
    this.internalValue.set(next);
    this.charCount.set(next.length);
  }

  readonly hasLeftIcon = computed<boolean>(() => !!this.leftIcon());
  readonly hasRightIcon = computed<boolean>(() => !!this.rightIcon());
  readonly hasError = computed<boolean>(() => !!this.errorMessage());

  readonly shouldShowPasswordToggle = computed<boolean>(
    () => this.showPasswordToggle() && this.type() === "password",
  );

  readonly effectiveType = computed<string>(() => {
    if (this.shouldShowPasswordToggle()) {
      return this._passwordVisible() ? "text" : "password";
    }
    return this.type();
  });

  readonly currentPasswordIcon = computed<Type<unknown>>(() =>
    this._passwordVisible()
      ? this.passwordVisibleIcon()
      : this.passwordHiddenIcon(),
  );

  readonly currentPasswordToggleLabel = computed<string>(() =>
    this._passwordVisible() ? HIDE_PASSWORD_LABEL : SHOW_PASSWORD_LABEL,
  );

  togglePasswordVisibility(): void {
    if (!this.shouldShowPasswordToggle()) return;
    const next = !this._passwordVisible();
    this._passwordVisible.set(next);
    this.passwordVisibilityChange.emit(next);
  }

  readonly outerClasses = computed<string>(() =>
    ["flex flex-col gap-1 w-full font-outfit", this.className()]
      .filter(Boolean)
      .join(" "),
  );

  readonly outerStyles = computed<Record<string, string>>(() => ({
    flex: this.flex() ?? "",
    width: this.width() ?? "",
  }));

  readonly containerClasses = computed<string>(() => {
    const baseLayout = [
      "flex items-center gap-2 w-full rounded-lg border border-solid",
      "bg-white dark:bg-gray-900",
      this.isEffectivelyDisabled() || this.readOnly()
        ? "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        : this.hasError()
          ? "border-error-500"
          : "border-gray-300 dark:border-gray-700",
      getFocusStyling("within"),
    ];
    return baseLayout.join(" ");
  });

  readonly containerStyles = computed<Record<string, string>>(() => ({
    height: inputHeight,
    "font-size": `var(--text-theme-sm)` /* fallback */,
    "padding-left": this.hasLeftIcon() ? "0" : `${horizontalPaddingNumber}px`,
    "padding-right":
      this.hasRightIcon() || this.shouldShowPasswordToggle()
        ? "0"
        : `${horizontalPaddingNumber}px`,
  }));

  readonly inputClasses = computed<string>(() =>
    [
      "flex-1 w-full border-0 outline-0 bg-transparent",
      "text-sm text-gray-800 dark:text-white/90",
      "font-normal leading-5",
      "placeholder:text-gray-400 dark:placeholder:text-gray-500",
      "read-only:text-gray-500 dark:read-only:text-gray-400",
      "disabled:text-gray-300 dark:disabled:text-gray-600",
    ].join(" "),
  );

  readonly iconColorType = computed<ColorType>(() => {
    if (this.hasError()) return "textError";
    if (this.isEffectivelyDisabled() || this.readOnly()) return "textDisabled";
    return "textWeak";
  });

  readonly iconColorClass = computed<string>(
    () => COLOR_CLASSES[this.iconColorType()],
  );

  readonly leftIconInputs = computed<Record<string, unknown>>(() => ({
    size: 16,
  }));

  readonly rightIconInputs = computed<Record<string, unknown>>(() => ({
    size: 16,
  }));

  readonly charCountColor = computed<ColorType>(() => {
    const limit = this.maxLength() ?? Infinity;
    return this.charCount() < limit ? "textWeakest" : "textAction";
  });

  readonly charCountText = computed<string>(
    () => `${this.charCount()}/${this.maxLength() ?? 0}`,
  );

  readonly charCountWeight: FontWeightType = "regular";
  readonly legendWeight: FontWeightType = "regular";

  readonly footerJustifyClass = computed<string>(() => {
    const hasLegend = !!this.legend();
    const hasMax = !!this.maxLength();
    if (hasLegend && hasMax) return "justify-between";
    if (hasLegend) return "justify-start";
    return "justify-end";
  });
}