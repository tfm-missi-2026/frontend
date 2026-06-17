import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { IconMoonComponent, IconSunComponent } from '@shared/icons';


@Component({
  selector: 'app-theme-toggle-two',
  imports: [IconMoonComponent, IconSunComponent],
  templateUrl: './theme-toggle-two.component.html',
  styles: ``
})
export class ThemeToggleTwoComponent {

  theme$;

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
