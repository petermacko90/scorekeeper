import { Component, computed, effect, ElementRef, inject, OnInit, signal } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { StorageService } from '../storage/storage.service';
import { ScorekeeperFormModel, Score } from './models';

@Component({
  selector: 'sk-scorekeeper',
  imports: [FormField],
  templateUrl: './scorekeeper.html',
  styleUrl: './scorekeeper.css',
})
export class Scorekeeper implements OnInit {
  private storage = inject(StorageService);

  private readonly initialState: ScorekeeperFormModel = {
    players: [{ name: '', score: [null] }],
  };

  private scorekeeperModel = signal<ScorekeeperFormModel>(this.initialState);

  scorekeeperForm = form(this.scorekeeperModel, (schemaPath) => {
    debounce(schemaPath.players, 300);
  });

  private roundsNumber = computed(() => this.scorekeeperForm.players[0].score.length);

  private elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);

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

  protected calculateSum(score: Score): number {
    const sum = score.reduce((acc, curr) => {
      return (acc ?? 0) + (curr ?? 0);
    }, 0);
    return sum ?? 0;
  }

  addPlayer() {
    this.scorekeeperModel.update((data) => {
      return {
        players: [
          ...data.players,
          {
            name: '',
            score: new Array(this.roundsNumber()).fill(null),
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

  reset() {
    if (this.isInitialState()) return;
    if (confirm('Are you sure you want to reset the scoreboard?')) {
      this.scorekeeperForm().reset(this.initialState);
    }
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
