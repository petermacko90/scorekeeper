import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { PlayerFormModel, ScorekeeperFormModel } from './state.model';
import { applyEach, debounce, form, schema } from '@angular/forms/signals';
import { StorageService } from '../storage/storage.service';
import { UndoService } from './undo.service';
import { EditModeService } from '../actions/edit-mode.service';

@Injectable({ providedIn: 'root' })
export class StateService {
  private storage = inject(StorageService);
  private undoService = inject(UndoService);
  private editMode = inject(EditModeService);

  private readonly debounceTime = 300;

  private readonly initialState: ScorekeeperFormModel = {
    players: [{ id: uuidv4(), name: '', score: [null] }],
    notes: '',
  };

  private scorekeeperModel = signal<ScorekeeperFormModel>(this.initialState);

  private playersSchema = schema<PlayerFormModel>((player) => {
    debounce(player.name, this.debounceTime);
    debounce(player.score, this.debounceTime);
  });

  scorekeeperForm = form(this.scorekeeperModel, (schemaPath) => {
    applyEach(schemaPath.players, this.playersSchema);
    debounce(schemaPath.notes, this.debounceTime);
  });

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

  setState(state: ScorekeeperFormModel) {
    this.scorekeeperModel.set(state);
  }

  loadState() {
    const state = this.storage.load();
    if (state === null) return;
    this.setState(state);
  }

  saveState() {
    effect(() => {
      this.storage.save(this.scorekeeperModel());
    });
  }

  addPlayer() {
    this.undoService.clearPrevState();

    this.scorekeeperModel.update((data) => {
      return {
        ...data,
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
    this.undoService.setPrevState(this.scorekeeperModel());

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
  }

  addRound() {
    this.undoService.clearPrevState();

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
  }

  removeRound(index: number) {
    this.undoService.setPrevState(this.scorekeeperModel());

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
  }

  reset() {
    this.undoService.setPrevState(this.scorekeeperModel());

    this.scorekeeperForm().reset(this.initialState);
  }

  isInitialState(): boolean {
    return (
      this.scorekeeperModel().players.length === 1 &&
      this.scorekeeperModel().players[0].name === '' &&
      this.scorekeeperModel().players[0].score.length === 1 &&
      this.scorekeeperModel().players[0].score[0] === null &&
      this.scorekeeperModel().notes === ''
    );
  }
}
