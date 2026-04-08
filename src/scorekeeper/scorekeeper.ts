import { Component, computed, effect, ElementRef, inject, OnInit, signal } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../storage/storage.service';
import { ScorekeeperFormModel } from './models';
import { RemoveButton } from '../remove-button/remove-button';
import { Button } from '../button/button';

@Component({
  selector: 'sk-scorekeeper',
  imports: [FormField, RemoveButton, Button],
  templateUrl: './scorekeeper.html',
  styleUrl: './scorekeeper.css',
})
export class Scorekeeper implements OnInit {
  private storage = inject(StorageService);

  private readonly initialState: ScorekeeperFormModel = {
    players: [{ id: uuidv4(), name: '', score: [null] }],
  };

  private scorekeeperModel = signal<ScorekeeperFormModel>(this.initialState);

  scorekeeperForm = form(this.scorekeeperModel, (schemaPath) => {
    debounce(schemaPath.players, 300);
  });

  private roundsNumber = computed(() => this.scorekeeperForm.players[0].score.length);
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

  isEditMode = signal<boolean>(false);

  private lastPlayerRef: ElementRef<HTMLInputElement> = inject(ElementRef);
  private lastRoundRef: ElementRef<HTMLTableRowElement> = inject(ElementRef);

  constructor() {
    effect(() => {
      this.storage.save(this.scorekeeperModel());
    });
  }

  ngOnInit(): void {
    this.loadState();
  }

  private loadState() {
    const state = this.storage.load();
    if (state === null) return;
    this.scorekeeperModel.set(state);
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

    setTimeout(() => {
      this.lastPlayerRef.nativeElement
        .querySelector<HTMLInputElement>('th:last-child>input')
        ?.focus();
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

    setTimeout(() => {
      this.lastRoundRef.nativeElement.querySelector('tbody>tr:last-child')?.scrollIntoView();
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

  toggleEditMode() {
    this.isEditMode.update((value) => !value);
  }

  reset() {
    if (this.isInitialState()) return;
    if (confirm('Are you sure you want to reset the scoreboard?')) {
      this.scorekeeperForm().reset(this.initialState);
    }
  }

  getPlayerName(index: number): string {
    return this.scorekeeperModel().players[index].name || this.getDefaultPlayerName(index);
  }

  getDefaultPlayerName(index: number): string {
    return `Player ${index + 1}`;
  }

  scoreChange(event: KeyboardEvent, index: number) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowUp', 'ArrowDown'];
    if (index + 1 === this.roundsNumber() && allowedKeys.includes(event.key)) {
      this.addRound();
    }
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
