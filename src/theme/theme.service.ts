import { inject, Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  storage = inject(StorageService);

  changeTheme() {
    const theme = this.storage.loadTheme();
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    );
  }
}
