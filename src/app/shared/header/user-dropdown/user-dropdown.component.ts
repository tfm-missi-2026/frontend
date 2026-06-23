import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiDropdownComponent, UiDropdownItemComponent } from '@shared/ui/dropdown';
import {
  IconChevronDownComponent,
  IconInfoCircleBorderComponent,
  IconLogoutComponent,
  IconSettingsComponent,
  IconUserCircleComponent,
} from '@shared/icons';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  templateUrl: './user-dropdown.component.html',
  imports: [
    CommonModule,
    RouterModule,
    UiDropdownComponent,
    UiDropdownItemComponent,
    IconChevronDownComponent,
    IconUserCircleComponent,
    IconSettingsComponent,
    IconInfoCircleBorderComponent,
    IconLogoutComponent,
  ]
})
export class UserDropdownComponent {
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}
