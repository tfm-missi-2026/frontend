/**
 * Public API del `UiSelect`.
 *
 * Select con búsqueda, async, creatable, clearable, single/multi,
 * error, disabled/readOnly, etc. Implementa `ControlValueAccessor`,
 * por lo que se puede usar con `[(ngModel)]`, `formControl` y
 * `formControlName`.
 */
export { UiSelectComponent } from './select.component';
export type {
  SelectOption,
  LoadOptionsFn,
  MessageFn,
  SelectValue,
} from './select.interface';
