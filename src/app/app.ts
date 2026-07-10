import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { Scoreboard } from '../scoreboard/scoreboard';
import { Actions } from '../actions/actions';
import { ActionsPositionService } from '../actions/actions-positions.service';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [Scoreboard, Actions],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  theme = inject(ThemeService);
  actions = inject(ActionsPositionService);

  isEditMode = signal<boolean>(false);

  scoreboard = viewChild.required(Scoreboard);

  ngOnInit(): void {
    this.theme.changeTheme();
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
