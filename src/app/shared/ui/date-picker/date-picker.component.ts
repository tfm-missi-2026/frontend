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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import flatpickr from "flatpickr";

import { IconCalendar24Component } from "@shared/icons";
import { UiFormLabelComponent } from "@shared/ui/form-label/form-label.component";
import { UiLabelComponent } from "@shared/ui/label/label.component";
import { getFocusStyling } from "@utils/styling";
import {
  horizontalPaddingNumber,
  inputHeight,
} from "@shared/ui/input/input/common";
import type { DatePickerMode } from "./types";

/**
 * `UiDatePicker`
 * --------------
 * Date picker del design system, construido sobre `flatpickr`.
 *
 * Capacidades:
 *  - Modos `single`, `multiple` y `range`.
 *  - Label integrable vía `<UiFormLabel>` (asterisco `*` automático).
 *  - Estado `disabled` / `readOnly`.
 *  - Estado de error: borde rojo.
 *  - `ControlValueAccessor` para integración con `ngModel` / `formControl`.
 *  - `min` / `max` opcionales para limitar el rango elegible.
 *
 * API signal-based (Angular 17.1+).
 */
@Component({
  selector: "UiDatePicker",
  standalone: true,
  imports: [IconCalendar24Component, UiFormLabelComponent, UiLabelComponent],
  templateUrl: "./date-picker.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDatePickerComponent),
      multi: true,
    },
  ],
})
export class UiDatePickerComponent
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
  readonly placeholder = input<string>("Seleccionar fecha");
  readonly mode = input<DatePickerMode>("single");
  readonly dateFormat = input<string>("Y-m-d");
  readonly defaultDate = input<string | Date | string[] | Date[] | undefined>(
    undefined,
  );
  readonly min = input<string | Date | undefined>(undefined);
  readonly max = input<string | Date | undefined>(undefined);
  readonly width = input<string | undefined>(undefined);
  readonly legend = input<string | undefined>(undefined);
  readonly className = input<string>("");

  /** Valor controlado (string en single/range start, string[] en multiple/range). */
  readonly value = input<string | string[] | undefined>(undefined);

  readonly valueChange = output<string | string[]>();
  readonly blurEvt = output<void>();
  readonly focusEvt = output<void>();

  readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>("inputEl");

  /** Valor interno (lo que muestra el `<input>`). */
  internalValue = "";

  private flatpickrInstance: flatpickr.Instance | undefined;
  private cdr = inject(ChangeDetectorRef);

  private onChangeFn: (value: string | string[]) => void = () => {};
  private onTouchedFn: () => void = () => {};

  ngAfterViewInit(): void {
    const el = this.inputEl()?.nativeElement;
    if (!el) return;

    this.flatpickrInstance = flatpickr(el, {
      mode: this.mode(),
      static: true,
      monthSelectorType: "static",
      dateFormat: this.dateFormat(),
      defaultDate: this.defaultDate() ?? this.value() ?? undefined,
      minDate: this.min() ?? undefined,
      maxDate: this.max() ?? undefined,
      clickOpens: !this.disabled() && !this.readOnly(),
      onChange: (selectedDates, dateStr) => {
        const next =
          this.mode() === "single" ? dateStr : (dateStr as unknown as string[]);
        this.internalValue = dateStr;
        this.onChangeFn(next);
        this.valueChange.emit(next);
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.flatpickrInstance?.destroy();
  }

  // ControlValueAccessor

  writeValue(value: string | string[] | null | undefined): void {
    if (Array.isArray(value)) {
      this.internalValue = value.join(", ");
    } else {
      this.internalValue = value ?? "";
    }
    this.flatpickrInstance?.setDate(value ?? "", false);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
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

  // Computed styling

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
