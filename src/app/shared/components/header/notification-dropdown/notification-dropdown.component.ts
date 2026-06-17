import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiDropdownComponent, UiDropdownItemComponent } from '@shared/ui/dropdown';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  imports: [CommonModule, RouterModule, UiDropdownComponent, UiDropdownItemComponent]
})
export class NotificationDropdownComponent {
  isOpen = false;
  notifying = true;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.notifying = false;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
