import { Injectable } from '@angular/core';
import { ActionsPosition, actionsPositions, ScorekeeperFormModel } from '../models/models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly stateKey = 'scorekeeper';
  private readonly actionsPositionKey = 'skActionsPosition';

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
}
