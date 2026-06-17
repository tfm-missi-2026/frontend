import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';
import { IconMoonComponent, IconSunComponent } from '@shared/icons';

@Component({
  selector: 'app-theme-toggle-button',
  templateUrl: './theme-toggle-button.component.html',
  imports: [CommonModule, IconMoonComponent, IconSunComponent]
})
export class ThemeToggleButtonComponent {

  theme$;

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
