import { Injectable } from '@angular/core';
import { Theme, admin, user } from 'src/assets/theme/theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private active: Theme = user;
  private availableThemes: Theme[] = [user, admin];

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  isDarkTheme(): boolean {
    return this.active.name === user.name;
  }

  setUserTheme(): void {
    this.setActiveTheme(user);
  }

  setAdminTheme(): void {
    this.setActiveTheme(admin);
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;
    document.documentElement.setAttribute('data-theme', theme.name);
  }
}
