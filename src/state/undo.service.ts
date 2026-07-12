import { Injectable, signal } from '@angular/core';
import { ScorekeeperFormModel } from './state.model';

@Injectable({ providedIn: 'root' })
export class UndoService {
  private prevState = signal<ScorekeeperFormModel | null>(null);

  getPrevState(): ScorekeeperFormModel | null {
    return this.prevState();
  }

  setPrevState(state: ScorekeeperFormModel) {
    this.prevState.set(state);
  }

  clearPrevState() {
    this.prevState.set(null);
  }

  isUndoEnabled(): boolean {
    return this.prevState() !== null;
  }
}
