import { Injectable } from '@angular/core';
import { ScorekeeperFormModel } from '../scorekeeper/models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly stateKey = 'scorekeeper';

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
}
