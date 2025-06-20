import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>(this.getCurrentTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private getCurrentTheme(): ThemeMode {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Check system preference if no saved theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  private initTheme(): void {
    const theme = this.getCurrentTheme();
    this.setTheme(theme);
  }

  public setTheme(theme: ThemeMode): void {
    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  public toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}