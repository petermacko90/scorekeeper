import { inject, Injectable } from '@angular/core';
import { ScorekeeperFormModel } from '../state/state.model';
import { ActionsPosition, actionsPositions, Theme, themes } from '../settings/settings.model';
import { LocalStorage } from './localStorage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage = inject(LocalStorage).getLocalStorage();

  private readonly stateKey = 'scorekeeper';
  private readonly actionsPositionKey = 'skActionsPosition';
  private readonly themeKey = 'skTheme';

  save(state: ScorekeeperFormModel) {
    try {
      this.storage.setItem(this.stateKey, JSON.stringify(state));
    } catch (error) {
      console.error('StorageService.save error', error);
    }
  }

  load(): ScorekeeperFormModel | null {
    try {
      const state = this.storage.getItem(this.stateKey);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('StorageService.load error', error);
      return null;
    }
  }

  saveActionsPosition(actionsPosition: ActionsPosition) {
    try {
      this.storage.setItem(this.actionsPositionKey, actionsPosition);
    } catch (error) {
      console.error('StorageService.saveActionsPosition error', error);
    }
  }

  loadActionsPosition(): ActionsPosition | null {
    try {
      const actionsPosition = this.storage.getItem(this.actionsPositionKey);
      if (actionsPosition === null) return null;
      if (this.isActionsPosition(actionsPosition)) return actionsPosition;
      this.storage.removeItem(this.actionsPositionKey);
      return null;
    } catch (error) {
      console.error('StorageService.loadActionsPosition error', error);
      return null;
    }
  }

  private isActionsPosition(input: string): input is ActionsPosition {
    return actionsPositions.includes(input as any);
  }

  saveTheme(theme: Theme) {
    try {
      this.storage.setItem(this.themeKey, theme);
    } catch (error) {
      console.error('StorageService.saveTheme error', error);
    }
  }

  loadTheme(): Theme {
    try {
      const theme = this.storage.getItem(this.themeKey);
      if (theme === null) return 'system';
      if (this.isTheme(theme)) return theme;
      this.deleteTheme();
      return 'system';
    } catch (error) {
      console.error('StorageService.loadTheme error', error);
      return 'system';
    }
  }

  deleteTheme() {
    try {
      this.storage.removeItem(this.themeKey);
    } catch (error) {
      console.error('StorageService.deleteTheme error', error);
    }
  }

  private isTheme(input: string): input is Theme {
    return themes.includes(input as any);
  }
}
