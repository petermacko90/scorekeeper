import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Scoreboard } from '../scoreboard/scoreboard';
import { Actions } from '../actions/actions';
import { ActionsPosition } from '../models/models';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-root',
  imports: [Scoreboard, Actions],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  storage = inject(StorageService);

  isEditMode = signal<boolean>(false);
  actionsPosition = signal<ActionsPosition>('top');

  scoreboard = viewChild.required(Scoreboard);

  ngOnInit(): void {
    this.loadActionsPosition();
  }

  private loadActionsPosition() {
    const position = this.storage.loadActionsPosition();
    if (position !== null) this.actionsPosition.set(position);
  }

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
