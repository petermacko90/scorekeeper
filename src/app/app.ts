import { Component, signal } from '@angular/core';
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
    players: [{ name: 'Player 1', score: [null] }],
  });

  scorekeeperForm = form(this.scorekeeperModel);

  calculateSum(score: Score): number {
    const sum = score.reduce((acc, curr) => {
      return (acc ?? 0) + (curr ?? 0);
    }, 0);
    return sum ?? 0;
  }

  addPlayer() {
    const rounds = this.scorekeeperForm.players[0].score.length;
    const playerCount = this.scorekeeperForm.players.length;

    this.scorekeeperModel.update((data) => {
      return {
        players: [
          ...data.players,
          {
            name: `Player ${playerCount + 1}`,
            score: new Array(rounds).fill(null),
          },
        ],
      };
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

  scoreChange(index: number) {
    const rounds = this.scorekeeperForm.players[0].score.length;
    if (index + 1 === rounds) {
      this.addRound();
    }
  }
}
