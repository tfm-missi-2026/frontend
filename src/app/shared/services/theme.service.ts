import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const VALID_THEMES = new Set<Theme>(['light', 'dark']);

@Injectable({ providedIn: 'root' })

export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    let saved: Theme = 'light';
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw && VALID_THEMES.has(raw as Theme)) {
          saved = raw as Theme;
        }
      } catch {
        // SecurityError en incognito; cae a 'light'.
      }
    }
    this.setTheme(saved);
  }

  toggleTheme() {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme) {
    this.themeSubject.next(theme);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // QuotaExceededError / SecurityError; ignora.
      }
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-900');
    }
  }
}