import { Component, inject, model, OnInit } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { StateService } from '../state/state.service';
import { RemoveButton } from '../remove-button/remove-button';
import { UndoService } from '../state/undo.service';

@Component({
  selector: 'sk-scoreboard',
  imports: [FormField, RemoveButton],
  templateUrl: './scoreboard.html',
  styleUrl: './scoreboard.css',
})
export class Scoreboard implements OnInit {
  state = inject(StateService);

  undoService = inject(UndoService);

  isEditMode = model<boolean>();

  constructor() {
    this.state.saveState();
  }

  ngOnInit(): void {
    this.state.loadState();
  }

  scoreChange(event: KeyboardEvent, index: number) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowUp', 'ArrowDown'];

    if (index + 1 === this.state.roundsNumber() && allowedKeys.includes(event.key)) {
      this.state.addRound();
      return;
    }

    if (allowedKeys.includes(event.key)) {
      this.undoService.clearPrevState();
    }
  }

  getDefaultPlayerName(index: number): string {
    return `Player ${index + 1}`;
  }
}
