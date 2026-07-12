import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";

import { IconChevronDownComponent } from "@shared/icons";
import { UiFormLabelComponent } from "@shared/ui/form-label/form-label.component";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { getFocusStyling } from "@utils/styling";
import type { CountryCode, PhoneSelectPosition } from "./phone-input.types";

/**
 * `UiPhoneInput`
 * --------------
 * Input de teléfono con selector de código de país.
 *
 * Capacidades:
 *  - Lista de países configurable vía `countries` (`{ code, label }`).
 *  - Posición del selector: `start` (default) o `end`.
 *  - `placeholder` configurable para el campo de número.
 *  - `disabled` / `readOnly`.
 *  - `valueChange` emite el número concatenado `<código> <número>`.
 *  - `phoneChange` emite solo el número (sin código).
 *  - `ControlValueAccessor` para integración con `ngModel` / `formControl`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiPhoneInput",
  standalone: true,
  imports: [
    IconChevronDownComponent,
    UiFormLabelComponent,
    UiLabelComponent,
  ],
  templateUrl: "./phone-input.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiPhoneInputComponent),
      multi: true,
    },
  ],
})
export class UiPhoneInputComponent
  implements ControlValueAccessor, OnInit
{
  readonly id = input<string | undefined>(undefined);
  readonly labelText = input<string | undefined>(undefined);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readOnly = input<boolean>(false);
  readonly tooltip = input<string | undefined>(undefined);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly countries = input<CountryCode[]>([]);
  readonly placeholder = input<string>("+1 (555) 000-0000");
  readonly selectPosition = input<PhoneSelectPosition>("start");
  readonly width = input<string | undefined>(undefined);
  readonly legend = input<string | undefined>(undefined);
  readonly className = input<string>("");

  readonly phoneChange = output<string>();
  readonly valueChange = output<string>();
  readonly blurEvt = output<void>();

  readonly selectEl =
    viewChild.required<ElementRef<HTMLSelectElement>>("selectEl");
  readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>("inputEl");

  readonly selectedCountry = signal<string>("");
  readonly phoneNumber = signal<string>("");

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  ngOnInit(): void {
    const list = this.countries();
    if (list.length > 0) {
      const first = list[0];
      this.selectedCountry.set(first.code);
      this.phoneNumber.set(first.label);
    }
  }

  handleCountryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCountry.set(value);
    const country = this.countries().find((c) => c.code === value);
    this.phoneNumber.set(country?.label ?? "");
    this.emitValue();
  }

  handlePhoneNumberChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.phoneNumber.set(value);
    this.emitValue();
  }

  onBlurHandler(): void {
    this.onTouchedFn();
    this.blurEvt.emit();
  }

  private emitValue(): void {
    const full = `${this.selectedCountry()} ${this.phoneNumber()}`.trim();
    this.onChangeFn(full);
    this.valueChange.emit(full);
    this.phoneChange.emit(this.phoneNumber());
  }

  writeValue(value: string | null | undefined): void {
    if (!value) return;
    const idx = value.indexOf(" ");
    if (idx < 0) {
      this.selectedCountry.set(value);
      this.phoneNumber.set("");
    } else {
      this.selectedCountry.set(value.slice(0, idx));
      this.phoneNumber.set(value.slice(idx + 1));
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const sel = this.selectEl()?.nativeElement;
    const inp = this.inputEl()?.nativeElement;
    if (sel) sel.disabled = isDisabled;
    if (inp) inp.disabled = isDisabled;
  }

  readonly hasError = computed<boolean>(() => !!this.errorMessage());
  readonly isEffectivelyDisabled = computed<boolean>(
    () => this.disabled() || this.readOnly(),
  );

  readonly outerClasses = computed<string>(() =>
    [
      "flex flex-col gap-1 w-full font-outfit",
      this.className(),
      this.width() ?? "",
    ]
      .filter(Boolean)
      .join(" "),
  );

  readonly selectClasses = computed<string>(() => {
    const pos = this.selectPosition();
    const isStart = pos === "start";
    return [
      "appearance-none bg-none border-0 h-10 py-0 pl-3 pr-8 leading-tight text-gray-700 dark:text-gray-400",
      "focus:outline-hidden",
      isStart
        ? "rounded-l-lg border-r border-gray-200 dark:border-gray-800"
        : "rounded-r-lg border-l border-gray-200 dark:border-gray-800",
      this.isEffectivelyDisabled() ? "cursor-not-allowed opacity-60" : "",
    ]
      .filter(Boolean)
      .join(" ");
  });

  readonly inputClasses = computed<string>(() => {
    const pos = this.selectPosition();
    return [
      "h-11 w-full rounded-lg border bg-transparent py-3 px-4 text-sm text-gray-800 shadow-theme-xs",
      "placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10",
      "dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800",
      this.hasError() ? "border-error-500" : "border-gray-300",
      this.isEffectivelyDisabled()
        ? "bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
        : "",
      pos === "start" ? "pl-20" : "pr-20",
    ]
      .filter(Boolean)
      .join(" ");
  });

  readonly selectWrapperClasses = computed<string>(() =>
    this.selectPosition() === "start" ? "absolute left-0" : "absolute right-0",
  );

  readonly containerClasses = computed<string>(() =>
    [
      "relative flex h-10",
      getFocusStyling("within"),
      "rounded-lg border border-solid",
      "bg-white dark:bg-gray-900",
      this.isEffectivelyDisabled() || this.readOnly()
        ? "bg-gray-50 border-gray-300"
        : this.hasError()
          ? "border-error-500"
          : "border-gray-300",
    ]
      .filter(Boolean)
      .join(" "),
  );
}