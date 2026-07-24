import { Injectable } from '@angular/core';
import { ScorekeeperFormModel } from '../state/state.model';
import { ActionsPosition, actionsPositions, Theme, themes } from '../settings/settings.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly stateKey = 'scorekeeper';
  private readonly actionsPositionKey = 'skActionsPosition';
  private readonly themeKey = 'skTheme';
  private readonly playerCounterKey = 'skPlayerCounter';

  save(state: ScorekeeperFormModel) {
    try {
      localStorage.setItem(this.stateKey, JSON.stringify(state));
    } catch (error) {
      console.error('StorageService.save error', error);
    }
  }

  load(): ScorekeeperFormModel | null {
    try {
      const state = localStorage.getItem(this.stateKey);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('StorageService.load error', error);
      return null;
    }
  }

  saveActionsPosition(actionsPosition: ActionsPosition) {
    try {
      localStorage.setItem(this.actionsPositionKey, actionsPosition);
    } catch (error) {
      console.error('StorageService.saveActionsPosition error', error);
    }
  }

  loadActionsPosition(): ActionsPosition | null {
    try {
      const actionsPosition = localStorage.getItem(this.actionsPositionKey);
      if (actionsPosition === null) return null;
      if (this.isActionsPosition(actionsPosition)) return actionsPosition;
      localStorage.removeItem(this.actionsPositionKey);
      return null;
    } catch (error) {
      console.error('StorageService.loadActionsPosition error', error);
      return 'top';
    }
  }

  private isActionsPosition(input: string): input is ActionsPosition {
    return actionsPositions.includes(input as any);
  }

  saveTheme(theme: Theme) {
    try {
      localStorage.setItem(this.themeKey, theme);
    } catch (error) {
      console.error('StorageService.saveTheme error', error);
    }
  }

  loadTheme(): Theme {
    try {
      const theme = localStorage.getItem(this.themeKey);
      if (theme === null) return 'system';
      if (this.isTheme(theme)) return theme;
      localStorage.removeItem(this.themeKey);
      return 'dark';
    } catch (error) {
      console.error('StorageService.loadTheme error', error);
      return 'dark';
    }
  }

  deleteTheme() {
    try {
      localStorage.removeItem(this.themeKey);
    } catch (error) {
      console.error('StorageService.deleteTheme error', error);
    }
  }

  private isTheme(input: string): input is Theme {
    return themes.includes(input as any);
  }

  savePlayerCounter(counter: number) {
    try {
      localStorage.setItem(this.playerCounterKey, counter.toString());
    } catch (error) {
      console.error('StorageService.savePlayerCounter error', error);
    }
  }

  loadPlayerCounter(): number {
    try {
      const counterString = localStorage.getItem(this.playerCounterKey);
      const counter = Number(counterString);
      if (!Number.isNaN(counter) && Number.isInteger(counter)) {
        return counter;
      }
      localStorage.removeItem(this.playerCounterKey);
      return 1;
    } catch (error) {
      console.error('StorageService.loadPlayerCounter error', error);
      return 1;
    }
  }
}
