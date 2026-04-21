import { Component, inject, model, output } from '@angular/core';
import { Button } from '../button/button';
import { StateService } from '../state/state.service';
import { UndoService } from '../state/undo.service';
import { ActionsPosition } from '../models/models';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'sk-actions',
  imports: [Button],
  templateUrl: './actions.html',
  styleUrl: './actions.css',
})
export class Actions {
  state = inject(StateService);
  storage = inject(StorageService);
  undoService = inject(UndoService);

  isEditMode = model.required<boolean>();
  actionsPosition = model.required<ActionsPosition>();

  playerAdded = output<void>();
  roundAdded = output<void>();

  addPlayer() {
    this.state.addPlayer();
    this.playerAdded.emit();
  }

  addRound() {
    this.state.addRound();
    this.roundAdded.emit();
  }

  toggleEditMode() {
    this.isEditMode.update((value) => !value);
  }

  toggleActionsPosition() {
    const position = this.actionsPosition();
    if (position === 'bottom') {
      this.actionsPosition.set('top');
      this.storage.saveActionsPosition('top');
    } else {
      this.actionsPosition.set('bottom');
      this.storage.saveActionsPosition('bottom');
    }
  }

  undo() {
    this.state.setState(this.undoService.getPrevState()!);
    this.undoService.clearPrevState();
  }
}
