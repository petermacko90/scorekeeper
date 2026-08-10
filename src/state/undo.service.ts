import { inject, Injectable, signal } from '@angular/core';
import { ScorekeeperFormModel } from './state.model';
import { StateService } from './state.service';

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

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private state = inject(StateService);

  private readonly historySize = 10;

  history = signal<ScorekeeperFormModel[]>([]);

  currentIndex = signal<number>(0);

  addState(newState: ScorekeeperFormModel) {
    const sliceStartIndex = this.history().length >= this.historySize ? 1 : 0;

    this.history.update((state) => [
      ...state.slice(sliceStartIndex, this.currentIndex() + 1),
      newState,
    ]);

    this.currentIndex.set(this.history().length - 1);
  }

  isUndoEnabled(): boolean {
    return this.history().length >= 2;
  }

  undo() {
    if (!this.isUndoEnabled()) {
      return;
    }

    this.currentIndex.update((index) => index - 1);
    this.state.setState(this.history().at(this.currentIndex())!);
  }

  isRedoEnabled(): boolean {
    return (
      this.history().length !== this.currentIndex() + 1 &&
      this.history().at(this.currentIndex() + 1) !== undefined
    );
  }

  redo() {
    if (!this.isRedoEnabled()) {
      return;
    }

    this.currentIndex.update((index) => index + 1);
    this.state.setState(this.history().at(this.currentIndex())!);
  }
}
