import { Component, ElementRef, inject, signal } from '@angular/core';
import { Dialog } from '../dialog/dialog';
import { ActionsPositionService } from '../actions/actions-positions.service';
import { ActionsPosition, Theme } from '../models/models';
import { Button } from '../button/button';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'sk-settings',
  templateUrl: './settings.html',
  imports: [Dialog, Button],
})
export class Settings {
  private actions = inject(ActionsPositionService);
  private storage = inject(StorageService);
  private themeService = inject(ThemeService);

  dialogRef: ElementRef<HTMLDialogElement> = inject(ElementRef);

  position = signal<ActionsPosition>(this.actions.position());
  theme = signal<Theme>(this.storage.loadTheme());

  changeActionsPosition($event: Event) {
    const position = ($event.target as HTMLSelectElement).value as ActionsPosition;
    this.actions.setPosition(position);
  }

  changeTheme($event: Event) {
    const theme = ($event.target as HTMLSelectElement).value as Theme;
    if (theme === 'system') {
      this.storage.deleteTheme();
    } else {
      this.storage.saveTheme(theme);
    }
    this.themeService.changeTheme();
  }

  close() {
    this.dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.close();
  }
}
