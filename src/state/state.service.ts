import { computed, effect, inject, Injectable, signal } from '@angular/core';
import isEqual from 'lodash/isEqual';
import { PlayerFormModel, ScorekeeperFormModel } from './state.model';
import { applyEach, debounce, form, schema } from '@angular/forms/signals';
import { StorageService } from '../storage/storage.service';
import { EditModeService } from '../actions/edit-mode.service';

@Injectable({ providedIn: 'root' })
export class StateService {
  private storage = inject(StorageService);
  private editMode = inject(EditModeService);

  static readonly debounceTime = 300;

  private readonly initialState: ScorekeeperFormModel = {
    players: [{ name: 'Player 1', score: [null] }],
    notes: '',
  };

  scorekeeperModel = signal<ScorekeeperFormModel>(this.initialState);

  private playersSchema = schema<PlayerFormModel>((player) => {
    debounce(player.name, 'blur');
    debounce(player.score, StateService.debounceTime);
  });

  scorekeeperForm = form(this.scorekeeperModel, (schemaPath) => {
    applyEach(schemaPath.players, this.playersSchema);
    debounce(schemaPath.notes, StateService.debounceTime);
  });

  private playerCounter = signal<number>(this.storage.loadPlayerCounter());

  roundsNumber = computed(() => this.scorekeeperForm.players[0].score.length);
  playersNumber = computed(() => this.scorekeeperForm.players.length);

  notes = computed(() => this.scorekeeperModel().notes);

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

  private readonly historySize = 10;
  history = signal<ScorekeeperFormModel[]>([]);
  historyCurrentIndex = signal<number>(0);

  setState(state: ScorekeeperFormModel) {
    this.scorekeeperModel.set(state);
  }

  loadState() {
    const state = this.storage.load();
    if (state === null) return;
    this.setState(state);
    this.addToHistory(state);
  }

  saveState() {
    effect(() => {
      this.storage.save(this.scorekeeperModel());
    });
  }

  addPlayer() {
    this.playerCounter.update((counter) => counter + 1);
    this.storage.savePlayerCounter(this.playerCounter());

    this.scorekeeperModel.update((data) => {
      return {
        ...data,
        players: [
          ...data.players,
          {
            name: `Player ${this.playerCounter()}`,
            score: new Array(this.roundsNumber()).fill(null),
          },
        ],
      };
    });

    this.addToHistory(this.scorekeeperModel());
  }

  removePlayer(index: number) {
    if (this.playersNumber() === 1) {
      this.reset();
      this.editMode.toggleEditMode();
    } else {
      this.scorekeeperModel.update((data) => {
        return {
          ...data,
          players: data.players.toSpliced(index, 1),
        };
      });
    }

    this.addToHistory(this.scorekeeperModel());
  }

  addRound(shouldAddToHistory = true) {
    this.scorekeeperModel.update((data) => {
      return {
        ...data,
        players: data.players.map((player) => {
          return {
            ...player,
            score: [...player.score, null],
          };
        }),
      };
    });

    if (shouldAddToHistory) {
      this.addToHistory(this.scorekeeperModel());
    }
  }

  removeRound(index: number) {
    this.scorekeeperModel.update((data) => {
      return {
        ...data,
        players: data.players.map((player) => {
          return {
            ...player,
            score: player.score.toSpliced(index, 1),
          };
        }),
      };
    });

    this.addToHistory(this.scorekeeperModel());
  }

  reset() {
    this.playerCounter.set(1);
    this.storage.savePlayerCounter(this.playerCounter());
    this.scorekeeperForm().reset(this.initialState);

    this.addToHistory(this.scorekeeperModel());
  }

  isInitialState(): boolean {
    return (
      this.scorekeeperModel().players.length === 1 &&
      this.scorekeeperModel().players[0].name === 'Player 1' &&
      this.scorekeeperModel().players[0].score.length === 1 &&
      this.scorekeeperModel().players[0].score[0] === null &&
      this.scorekeeperModel().notes === ''
    );
  }

  addToHistory(newState?: ScorekeeperFormModel) {
    setTimeout(
      () => {
        const stateToAdd = newState ?? this.scorekeeperModel();
        const lastEntry = this.history().at(length - 1);
        if (isEqual(stateToAdd, lastEntry)) return;

        const sliceStartIndex = this.history().length >= this.historySize ? 1 : 0;

        this.history.update((state) => [
          ...state.slice(sliceStartIndex, this.historyCurrentIndex() + 1),
          stateToAdd,
        ]);

        this.historyCurrentIndex.set(this.history().length - 1);
      },
      newState ? 0 : StateService.debounceTime + 50,
    );
  }

  isUndoEnabled(): boolean {
    return this.history().length >= 2 && this.historyCurrentIndex() >= 1;
  }

  undo() {
    if (!this.isUndoEnabled()) {
      return;
    }

    this.historyCurrentIndex.update((index) => index - 1);
    this.setState(this.history().at(this.historyCurrentIndex())!);
  }

  isRedoEnabled(): boolean {
    return (
      this.history().length !== this.historyCurrentIndex() + 1 &&
      this.history().at(this.historyCurrentIndex() + 1) !== undefined
    );
  }

  redo() {
    if (!this.isRedoEnabled()) {
      return;
    }

    this.historyCurrentIndex.update((index) => index + 1);
    this.setState(this.history().at(this.historyCurrentIndex())!);
  }
}
