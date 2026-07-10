import { Component, ElementRef, inject, signal } from '@angular/core';
import { Dialog } from '../dialog/dialog';
import { ActionsPositionService } from '../actions/actions-positions.service';
import { ActionsPosition, actionsPositions, Theme, themes } from '../models/models';
import { Button } from '../button/button';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from '../theme/theme.service';
import { Select } from '../select/select';

@Component({
  selector: 'sk-settings',
  templateUrl: './settings.html',
  imports: [Dialog, Button, Select],
})
export class Settings {
  private actions = inject(ActionsPositionService);
  private storage = inject(StorageService);
  private themeService = inject(ThemeService);

  dialogRef: ElementRef<HTMLDialogElement> = inject(ElementRef);

  position = signal<ActionsPosition>(this.actions.position());
  positionOptions = actionsPositions as ActionsPosition[];

  theme = signal<Theme>(this.storage.loadTheme());
  themeOptions = themes as Theme[];

  changeActionsPosition(position: ActionsPosition) {
    this.actions.setPosition(position);
  }

  changeTheme(theme: Theme) {
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
