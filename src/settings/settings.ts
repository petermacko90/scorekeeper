import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { Dialog } from '../dialog/dialog';
import { ActionsPositionService } from '../actions/actions-positions.service';
import { ActionsPosition, actionsPositions, Theme, themes } from './settings.model';
import { Button } from '../button/button';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from '../theme/theme.service';
import { Select } from '../select/select';
import { form } from '@angular/forms/signals';
import { SettingsData } from './settings.model';

@Component({
  selector: 'sk-settings',
  templateUrl: './settings.html',
  imports: [Dialog, Button, Select],
})
export class Settings implements OnInit {
  protected actions = inject(ActionsPositionService);
  protected storage = inject(StorageService);
  protected themeService = inject(ThemeService);

  dialogRef: ElementRef<HTMLDialogElement> = inject(ElementRef);

  positionOptions = actionsPositions as ActionsPosition[];
  themeOptions = themes as Theme[];

  protected settingsModel = signal<SettingsData>({
    theme: 'system',
    actionsPosition: 'top',
  });

  settingsForm = form(this.settingsModel);

  ngOnInit(): void {
    this.loadData();
  }

  protected loadData() {
    this.settingsModel.set({
      theme: this.storage.loadTheme(),
      actionsPosition: this.actions.position(),
    });
  }

  changeActionsPosition(position: ActionsPosition) {
    this.settingsForm.actionsPosition().value.set(position);
    this.actions.setPosition(position);
  }

  changeTheme(theme: Theme) {
    this.settingsForm.theme().value.set(theme);
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
