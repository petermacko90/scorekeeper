import { Component, inject, model, output, viewChild } from '@angular/core';
import { Button } from '../button/button';
import { StateService } from '../state/state.service';
import { UndoService } from '../state/undo.service';
import { ActionsPosition } from '../models/models';
import { StorageService } from '../storage/storage.service';
import { Notes } from '../notes/notes';
import { ActionsPositionService } from './actions-positions.service';

@Component({
  selector: 'sk-actions',
  imports: [Button, Notes],
  templateUrl: './actions.html',
  styleUrl: './actions.css',
})
export class Actions {
  state = inject(StateService);
  storage = inject(StorageService);
  undoService = inject(UndoService);
  actions = inject(ActionsPositionService);

  isEditMode = model.required<boolean>();

  playerAdded = output<void>();
  roundAdded = output<void>();

  notes = viewChild.required(Notes);

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

  changeActionsPosition($event: Event) {
    const value = ($event.target as HTMLSelectElement).value as ActionsPosition;
    this.actions.setPosition(value);
  }

  isActionsPositionVertical(): boolean {
    return this.actions.position() === 'left' || this.actions.position() === 'right';
  }

  openNotes() {
    this.notes().dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.showModal();
  }

  undo() {
    this.state.setState(this.undoService.getPrevState()!);
    this.undoService.clearPrevState();
  }
}
