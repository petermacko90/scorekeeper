import { Component, ElementRef, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';

type Score = Array<number | null>;

interface PlayerFormModel {
  name: string;
  score: Score;
}

interface ScorekeeperFormModel {
  players: PlayerFormModel[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormField],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  scorekeeperModel = signal<ScorekeeperFormModel>({
    players: [{ name: '', score: [null] }],
  });

  scorekeeperForm = form(this.scorekeeperModel);

  elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);

  calculateSum(score: Score): number {
    const sum = score.reduce((acc, curr) => {
      return (acc ?? 0) + (curr ?? 0);
    }, 0);
    return sum ?? 0;
  }

  addPlayer() {
    const rounds = this.scorekeeperForm.players[0].score.length;

    this.scorekeeperModel.update((data) => {
      return {
        players: [
          ...data.players,
          {
            name: '',
            score: new Array(rounds).fill(null),
          },
        ],
      };
    });

    setTimeout(() => {
      this.elementRef.nativeElement.querySelector<HTMLInputElement>('th:last-child>input')?.focus();
    });
  }

  addRound() {
    this.scorekeeperModel.update((data) => {
      return {
        players: data.players.map((player) => {
          return {
            ...player,
            score: [...player.score, null],
          };
        }),
      };
    });
  }

  scoreChange(event: KeyboardEvent, index: number) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowUp', 'ArrowDown'];
    const rounds = this.scorekeeperForm.players[0].score.length;
    if (index + 1 === rounds && allowedKeys.includes(event.key)) {
      this.addRound();
    }
  }
}
