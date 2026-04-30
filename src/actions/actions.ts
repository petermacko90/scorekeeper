import { Component, inject, model, output, viewChild } from '@angular/core';
import { Button } from '../button/button';
import { StateService } from '../state/state.service';
import { UndoService } from '../state/undo.service';
import { ActionsPosition } from '../models/models';
import { StorageService } from '../storage/storage.service';
import { Notes } from '../notes/notes';

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

  isEditMode = model.required<boolean>();
  actionsPosition = model.required<ActionsPosition>();

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
    this.actionsPosition.set(value);
    this.storage.saveActionsPosition(value);
  }

  isActionsPositionVertical(): boolean {
    return this.actionsPosition() === 'left' || this.actionsPosition() === 'right';
  }

  openNotes() {
    this.notes().dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.showModal();
  }

  undo() {
    this.state.setState(this.undoService.getPrevState()!);
    this.undoService.clearPrevState();
  }
}
