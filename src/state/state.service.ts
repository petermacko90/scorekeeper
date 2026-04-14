import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ScorekeeperFormModel } from '../scorekeeper/models';
import { debounce, form } from '@angular/forms/signals';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class StateService {
  private storage = inject(StorageService);

  private readonly initialState: ScorekeeperFormModel = {
    players: [{ id: uuidv4(), name: '', score: [null] }],
  };

  private scorekeeperModel = signal<ScorekeeperFormModel>(this.initialState);

  scorekeeperForm = form(this.scorekeeperModel, (schemaPath) => {
    debounce(schemaPath.players, 300);
  });

  roundsNumber = computed(() => this.scorekeeperForm.players[0].score.length);
  playersNumber = computed(() => this.scorekeeperForm.players.length);

  sums = computed(() => {
    return this.scorekeeperForm
      .players()
      .value()
      .map((player) => {
        const sum = player.score.reduce((acc, curr) => {
          return (acc ?? 0) + (curr ?? 0);
        }, 0);
        return sum ?? 0;
      });
  });

  loadState() {
    const state = this.storage.load();
    if (state === null) return;
    this.scorekeeperModel.set(state);
  }

  saveState() {
    effect(() => {
      this.storage.save(this.scorekeeperModel());
    });
  }

  addPlayer() {
    this.scorekeeperModel.update((data) => {
      return {
        players: [
          ...data.players,
          {
            id: uuidv4(),
            name: '',
            score: new Array(this.roundsNumber()).fill(null),
          },
        ],
      };
    });
  }

  removePlayer(index: number) {
    if (confirm(`Are you sure you want to remove player "${this.getPlayerName(index)}"?`)) {
      this.scorekeeperModel.update((data) => {
        return {
          players: [...data.players.slice(0, index), ...data.players.slice(index + 1)],
        };
      });
    }
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

  removeRound(index: number) {
    if (confirm(`Are you sure you want to remove the row number ${index + 1}?`)) {
      this.scorekeeperModel.update((data) => {
        return {
          players: data.players.map((player) => {
            return {
              ...player,
              score: [...player.score.slice(0, index), ...player.score.slice(index + 1)],
            };
          }),
        };
      });
    }
  }

  reset() {
    if (this.isInitialState()) return;
    if (confirm('Are you sure you want to reset the scoreboard?')) {
      this.scorekeeperForm().reset(this.initialState);
    }
  }

  private getPlayerName(index: number): string {
    return this.scorekeeperModel().players[index].name || this.getDefaultPlayerName(index);
  }

  getDefaultPlayerName(index: number): string {
    return `Player ${index + 1}`;
  }

  private isInitialState(): boolean {
    return (
      this.scorekeeperModel().players.length === 1 &&
      this.scorekeeperModel().players[0].name === '' &&
      this.scorekeeperModel().players[0].score.length === 1 &&
      this.scorekeeperModel().players[0].score[0] === null
    );
  }
}
