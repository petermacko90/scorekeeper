import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { ScorekeeperFormModel } from './state.model';
import { Mocked } from 'vitest';
import { StorageService } from '../storage/storage.service';

describe('StateService', () => {
  describe('load returns null', () => {
    const storageServiceStub: Mocked<StorageService> = {
      load: vi.fn().mockReturnValue(null),
      save: vi.fn(),
    } as unknown as Mocked<StorageService>;

    const initialState: ScorekeeperFormModel = {
      players: [{ name: 'Player 1', score: [null] }],
      notes: '',
      playerCounter: 1,
    };

    let service: StateService;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: StorageService, useValue: storageServiceStub }],
      });

      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    beforeEach(() => {
      service = TestBed.inject(StateService);
    });

    it('should initialize state when storage is empty', () => {
      service.loadState();

      expect(service.scorekeeperModel()).toStrictEqual(initialState);
      expect(service.history()).toStrictEqual([]);
      expect(service.sums()).toStrictEqual([0]);
    });

    it('should add players', async () => {
      service.addPlayer();
      service.addPlayer();
      await vi.runAllTimersAsync();

      expect(service.scorekeeperModel().players[0].name).toBe('Player 1');
      expect(service.scorekeeperModel().players[1].name).toBe('Player 2');
      expect(service.scorekeeperModel().players[2].name).toBe('Player 3');
    });

    it('should reset the state when removing last player', async () => {
      const state: ScorekeeperFormModel = {
        notes: 'abc',
        playerCounter: 1,
        players: [
          {
            name: 'P',
            score: [1, null],
          },
        ],
      };

      service.setState(state);
      service.removePlayer(0);
      await vi.runAllTimersAsync();

      expect(service.scorekeeperModel().notes).toBe('');
      expect(service.scorekeeperModel().playerCounter).toBe(1);
      expect(service.scorekeeperModel().players[0].name).toBe('Player 1');
      expect(service.scorekeeperModel().players[0].score).toStrictEqual([null]);
    });

    it('should remove player', async () => {
      const state: ScorekeeperFormModel = {
        notes: '',
        playerCounter: 3,
        players: [
          {
            name: 'Player 1',
            score: [10, null],
          },
          {
            name: 'Player 2',
            score: [20, null],
          },
          {
            name: 'Player 3',
            score: [30, null],
          },
        ],
      };

      service.setState(state);
      service.removePlayer(1);
      await vi.runAllTimersAsync();

      expect(service.playersNumber()).toBe(2);
      expect(service.scorekeeperModel().players[0].name).toBe('Player 1');
      expect(service.scorekeeperModel().players[1].name).toBe('Player 3');
    });

    it('should add round and add state to history by default', async () => {
      const state: ScorekeeperFormModel = {
        notes: '',
        playerCounter: 2,
        players: [
          { name: 'Player 1', score: [10, null] },
          { name: 'Player 2', score: [20, null] },
        ],
      };

      service.setState(state);
      service.addRound();
      await vi.runAllTimersAsync();

      expect(service.scorekeeperModel().players[0].score).toStrictEqual([10, null, null]);
      expect(service.scorekeeperModel().players[1].score).toStrictEqual([20, null, null]);
      expect(service.history()[0].players[0].score).toStrictEqual([10, null, null]);
      expect(service.history()[0].players[1].score).toStrictEqual([20, null, null]);
    });

    it('should add round and not add to history when shouldAddToHistory is false', async () => {
      const state: ScorekeeperFormModel = {
        notes: '',
        playerCounter: 1,
        players: [{ name: 'Player 1', score: [1] }],
      };

      service.setState(state);
      service.addRound(false);
      await vi.runAllTimersAsync();

      expect(service.scorekeeperModel().players[0].score).toStrictEqual([1, null]);
      expect(service.history()).toStrictEqual([]);
    });

    it('should remove round', async () => {
      const state: ScorekeeperFormModel = {
        notes: '',
        playerCounter: 2,
        players: [
          { name: 'Player 1', score: [10, 20, 30] },
          { name: 'Player 2', score: [15, 25, 35] },
        ],
      };

      service.setState(state);
      service.removeRound(1);
      await vi.runAllTimersAsync();

      expect(service.scorekeeperModel().players[0].score).toStrictEqual([10, 30]);
      expect(service.scorekeeperModel().players[1].score).toStrictEqual([15, 35]);
      expect(service.history()[0].players[0].score).toStrictEqual([10, 30]);
      expect(service.history()[0].players[1].score).toStrictEqual([15, 35]);
    });

    it('should reset to initial state', async () => {
      const state: ScorekeeperFormModel = {
        notes: 'Test',
        playerCounter: 2,
        players: [
          { name: 'Player 1', score: [10, null] },
          { name: 'Player 2', score: [15, null] },
        ],
      };

      service.setState(state);
      service.reset();
      await vi.runAllTimersAsync();

      expect(service.scorekeeperModel().notes).toBe('');
      expect(service.scorekeeperModel().playerCounter).toBe(1);
      expect(service.scorekeeperModel().players.length).toBe(1);
      expect(service.scorekeeperModel().players[0].name).toBe('Player 1');
      expect(service.scorekeeperModel().players[0].score).toStrictEqual([null]);

      expect(service.history()[0].notes).toBe('');
      expect(service.history()[0].playerCounter).toBe(1);
      expect(service.history()[0].players.length).toBe(1);
      expect(service.history()[0].players[0].name).toBe('Player 1');
      expect(service.history()[0].players[0].score).toStrictEqual([null]);

      expect(service.isInitialState()).toBe(true);
    });

    it('should be initial state at load and then not after change', () => {
      service.loadState();
      expect(service.isInitialState()).toBe(true);
      service.addRound();
      expect(service.isInitialState()).toBe(false);
    });

    it('should add to empty history', async () => {
      const newState: ScorekeeperFormModel = {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1],
          },
        ],
        playerCounter: 1,
      };

      service.addToHistory(newState);
      await vi.runAllTimersAsync();

      expect(service.history().length).toBe(1);
      expect(service.historyCurrentIndex()).toBe(0);
      expect(service.history()).toStrictEqual([newState]);
      expect(service.isUndoEnabled()).toBe(false);
      expect(service.isRedoEnabled()).toBe(false);
    });

    it('should keep the history at 10 entries', async () => {
      const oldState: ScorekeeperFormModel[] = [
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2, 3],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2, 3, 4],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2, 3, 4, 5],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2, 3, 4, 5, 6],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2, 3, 4, 5, 6, 7],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2, 3, 4, 5, 6, 7, 8],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            },
          ],
          playerCounter: 1,
        },
      ];

      const newState: ScorekeeperFormModel = {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          },
        ],
        playerCounter: 1,
      };

      service.history.set(oldState);
      service.historyCurrentIndex.set(9);
      service.addToHistory(newState);
      await vi.runAllTimersAsync();

      expect(service.history().length).toBe(10);
      expect(service.historyCurrentIndex()).toBe(9);
      expect(service.history()).toStrictEqual([...oldState.slice(1), newState]);
      expect(service.isUndoEnabled()).toBe(true);
      expect(service.isRedoEnabled()).toBe(false);
    });

    it('should not undo if there are no previous steps in history', () => {
      const state: ScorekeeperFormModel[] = [
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2],
            },
          ],
          playerCounter: 1,
        },
      ];

      service.setState({
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1],
          },
        ],
        playerCounter: 1,
      });
      service.history.set(state);
      service.historyCurrentIndex.set(0);

      expect(service.isUndoEnabled()).toBe(false);

      service.undo();
      expect(service.historyCurrentIndex()).toBe(0);
      const expected: ScorekeeperFormModel = {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1],
          },
        ],
        playerCounter: 1,
      };
      expect(service.scorekeeperModel()).toStrictEqual(expected);
    });

    it('should undo if there are previous steps in history', () => {
      const state: ScorekeeperFormModel[] = [
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2],
            },
          ],
          playerCounter: 1,
        },
      ];

      service.history.set(state);
      service.historyCurrentIndex.set(1);

      expect(service.isUndoEnabled()).toBe(true);

      service.undo();
      expect(service.historyCurrentIndex()).toBe(0);
      const expected: ScorekeeperFormModel = {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1],
          },
        ],
        playerCounter: 1,
      };
      expect(service.scorekeeperModel()).toStrictEqual(expected);
    });

    it('should not redo if historyCurrentIndex is on last entry', () => {
      const state: ScorekeeperFormModel[] = [
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2],
            },
          ],
          playerCounter: 1,
        },
      ];

      service.setState({
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2],
          },
        ],
        playerCounter: 1,
      });
      service.history.set(state);
      service.historyCurrentIndex.set(1);

      expect(service.isRedoEnabled()).toBe(false);

      service.redo();
      expect(service.historyCurrentIndex()).toBe(1);
      const expected: ScorekeeperFormModel = {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2],
          },
        ],
        playerCounter: 1,
      };
      expect(service.scorekeeperModel()).toStrictEqual(expected);
    });

    it('should redo if historyCurrentIndex is not on last entry', () => {
      const state: ScorekeeperFormModel[] = [
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1],
            },
          ],
          playerCounter: 1,
        },
        {
          notes: '',
          players: [
            {
              name: 'Player 1',
              score: [1, 2],
            },
          ],
          playerCounter: 1,
        },
      ];

      service.history.set(state);
      service.historyCurrentIndex.set(0);

      expect(service.isRedoEnabled()).toBe(true);

      service.redo();
      expect(service.historyCurrentIndex()).toBe(1);
      const expected: ScorekeeperFormModel = {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2],
          },
        ],
        playerCounter: 1,
      };
      expect(service.scorekeeperModel()).toStrictEqual(expected);
    });
  });

  describe('load returns non-null state', () => {
    const state: ScorekeeperFormModel = {
      notes: 'This is a test',
      playerCounter: 2,
      players: [
        {
          name: 'Player 1',
          score: [10, 20],
        },
        {
          name: 'Player 2',
          score: [25, null],
        },
      ],
    };

    const storageServiceStub: Mocked<StorageService> = {
      load: vi.fn().mockReturnValue(state),
      save: vi.fn(),
    } as unknown as Mocked<StorageService>;

    let service: StateService;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: StorageService, useValue: storageServiceStub }],
      });

      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    beforeEach(() => {
      service = TestBed.inject(StateService);
    });

    it('should load state from storage', async () => {
      service.loadState();
      await vi.runAllTimersAsync();

      expect(service.scorekeeperModel()).toStrictEqual(state);
      expect(service.history()).toStrictEqual([state]);
      expect(service.roundsNumber()).toBe(2);
      expect(service.playersNumber()).toBe(2);
      expect(service.sums()).toStrictEqual([30, 25]);
      expect(service.notes()).toBe('This is a test');
    });
  });
});
