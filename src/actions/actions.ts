import { Component, inject, output, viewChild } from '@angular/core';
import { Button } from '../button/button';
import { StateService } from '../state/state.service';
import { Notes } from '../notes/notes';
import { ActionsPositionService } from './actions-positions.service';
import { Settings } from '../settings/settings';
import { EditModeService } from './edit-mode.service';

@Component({
  selector: 'sk-actions',
  imports: [Button, Notes, Settings],
  templateUrl: './actions.html',
  styleUrl: './actions.css',
})
export class Actions {
  state = inject(StateService);
  editMode = inject(EditModeService);
  private actions = inject(ActionsPositionService);

  playerAdded = output<void>();
  roundAdded = output<void>();

  private notes = viewChild.required(Notes);
  private settings = viewChild.required(Settings);

  addPlayer() {
    this.state.addPlayer();
    this.playerAdded.emit();
  }

  addRound() {
    this.state.addRound();
    this.roundAdded.emit();
  }

  isActionsPositionVertical(): boolean {
    return this.actions.position() === 'left' || this.actions.position() === 'right';
  }

  openNotes() {
    this.notes().dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.showModal();
  }

  openSettings() {
    this.settings().dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.showModal();
  }
}
