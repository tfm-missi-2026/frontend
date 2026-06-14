import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

/**
 * `UiCheckbox`
 * ------------
 * Checkbox accesible del design system. Standalone + OnPush + signal APIs.
 */
@Component({
  selector: 'UiCheckbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox.html',
})
export class UiCheckboxComponent {
  readonly label = input<string | undefined>(undefined);
  readonly checked = input<boolean>(false);
  readonly className = input<string>('');
  readonly id = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);

  readonly checkedChange = output<boolean>();

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
