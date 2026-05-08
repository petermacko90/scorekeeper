import { Component, inject, signal, viewChild } from '@angular/core';
import { Scoreboard } from '../scoreboard/scoreboard';
import { Actions } from '../actions/actions';
import { StorageService } from '../storage/storage.service';
import { ActionsPositionService } from '../actions/actions-positions.service';

@Component({
  selector: 'app-root',
  imports: [Scoreboard, Actions],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  storage = inject(StorageService);
  actions = inject(ActionsPositionService);

  isEditMode = signal<boolean>(false);

  scoreboard = viewChild.required(Scoreboard);

  focusLastPlayer() {
    setTimeout(() => {
      this.scoreboard()
        .lastPlayerRef.nativeElement.querySelector<HTMLInputElement>('th:last-child>input')
        ?.focus();
    });
  }

  scrollToLastRound() {
    setTimeout(() => {
      this.scoreboard()
        .lastRoundRef.nativeElement.querySelector('tbody>tr:last-child')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }
}
