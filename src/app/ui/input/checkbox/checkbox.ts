import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'Checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.html',
})
export class CheckboxComponent {
  @Input() label?: string;
  @Input() checked = false;
  @Input() className = '';
  @Input() id?: string;
  @Input() disabled = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checkedChange.emit(input.checked);
  }
}
