import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiDropdownComponent, UiDropdownItemComponent } from '@shared/ui/dropdown';
import { IconBellComponent, IconCloseLargeComponent } from '@shared/icons';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  templateUrl: './notification-dropdown.component.html',
  imports: [
    CommonModule,
    RouterModule,
    UiDropdownComponent,
    UiDropdownItemComponent,
    IconBellComponent,
    IconCloseLargeComponent,
  ]
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
