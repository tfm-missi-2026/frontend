import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import flatpickr from "flatpickr";

import { IconClockComponent } from "@shared/icons";
import { UiFormLabelComponent } from "@shared/ui/form-label/form-label.component";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { getFocusStyling } from "@utils/styling";
import { horizontalPaddingNumber, inputHeight } from "@shared/ui/input/input/common";

/**
 * `UiTimePicker`
 * --------------
 * Time picker del design system, construido sobre `flatpickr`.
 *
 * Capacidades:
 *  - Formato `HH:mm` por defecto (configurable vía `dateFormat`).
 *  - `time_24hr` opcional para reloj 24 h.
 *  - `minuteIncrement` para granularidad (default 1 min).
 *  - Label integrable vía `<UiFormLabel>` (asterisco `*` automático).
 *  - Estado `disabled` / `readOnly` y mensaje de error.
 *  - `ControlValueAccessor` para integración con `ngModel` / `formControl`.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiTimePicker",
  standalone: true,
  imports: [
    IconClockComponent,
    UiFormLabelComponent,
    UiLabelComponent,
  ],
  templateUrl: "./time-picker.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTimePickerComponent),
      multi: true,
    },
  ],
})
export class UiTimePickerComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor
{
  readonly id = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly labelText = input<string | undefined>(undefined);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readOnly = input<boolean>(false);
  readonly tooltip = input<string | undefined>(undefined);
  readonly errorMessage = input<string | undefined>(undefined);
  readonly placeholder = input<string>("Seleccionar hora");
  readonly dateFormat = input<string>("H:i");
  readonly time24hr = input<boolean>(false);
  readonly minuteIncrement = input<number>(1);
  readonly defaultTime = input<string | Date | undefined>(undefined);
  readonly width = input<string | undefined>(undefined);
  readonly legend = input<string | undefined>(undefined);
  readonly className = input<string>("");

  /** Valor controlado (string `HH:mm` o `H:mm AM/PM` según formato). */
  readonly value = input<string | undefined>(undefined);

  readonly valueChange = output<string>();
  readonly blurEvt = output<void>();
  readonly focusEvt = output<void>();

  readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>("inputEl");

  internalValue = "";

  private flatpickrInstance: flatpickr.Instance | undefined;
  private cdr = inject(ChangeDetectorRef);

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  ngAfterViewInit(): void {
    const el = this.inputEl()?.nativeElement;
    if (!el) return;

    this.flatpickrInstance = flatpickr(el, {
      enableTime: true,
      noCalendar: true,
      dateFormat: this.dateFormat(),
      time_24hr: this.time24hr(),
      minuteIncrement: this.minuteIncrement(),
      defaultDate: this.defaultTime() ?? this.value() ?? undefined,
      clickOpens: !this.disabled() && !this.readOnly(),
      onChange: (_selectedDates, dateStr) => {
        this.internalValue = dateStr;
        this.onChangeFn(dateStr);
        this.valueChange.emit(dateStr);
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.flatpickrInstance?.destroy();
  }

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  writeValue(value: string | null | undefined): void {
    this.internalValue = value ?? "";
    this.flatpickrInstance?.setDate(value ?? "", false);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.flatpickrInstance?.destroy();
    this.cdr.markForCheck();
  }

  onBlurHandler(): void {
    this.onTouchedFn();
    this.blurEvt.emit();
  }

  onFocusHandler(): void {
    this.focusEvt.emit();
  }

  // ---------------------------------------------------------------------------
  // Computed styling
  // ---------------------------------------------------------------------------

  readonly hasError = computed<boolean>(() => !!this.errorMessage());
  readonly isEffectivelyDisabled = computed<boolean>(
    () => this.disabled() || this.readOnly(),
  );

  readonly outerClasses = computed<string>(() =>
    ["flex flex-col gap-1 w-full font-outfit", this.className()]
      .filter(Boolean)
      .join(" "),
  );

  readonly outerStyles = computed<Record<string, string>>(() => ({
    width: this.width() ?? "",
  }));

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
    "padding-left": `${horizontalPaddingNumber}px`,
    "padding-right": `${horizontalPaddingNumber}px`,
  }));

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
}
