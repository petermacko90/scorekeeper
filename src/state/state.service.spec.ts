import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { ScorekeeperFormModel } from './state.model';
import { Mocked } from 'vitest';
import { StorageService } from '../storage/storage.service';

const storageServiceStub: Mocked<StorageService> = {
  loadPlayerCounter: vi.fn().mockResolvedValue(1),
  savePlayerCounter: vi.fn(),
  load: vi.fn().mockReturnValue(null),
  save: vi.fn(),
} as unknown as Mocked<StorageService>;

describe('StateService', () => {
  let service: StateService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });

    service = TestBed.inject(StateService);
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
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
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2],
          },
        ],
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3],
          },
        ],
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3, 4],
          },
        ],
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3, 4, 5],
          },
        ],
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3, 4, 5, 6],
          },
        ],
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3, 4, 5, 6, 7],
          },
        ],
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3, 4, 5, 6, 7, 8],
          },
        ],
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        ],
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        ],
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
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2],
          },
        ],
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
    });
    service.history.set(state);
    service.historyCurrentIndex.set(0);

    expect(service.isUndoEnabled()).toBe(false);

    service.undo();
    expect(service.historyCurrentIndex()).toBe(0);
    expect(service.scorekeeperModel()).toStrictEqual({
      notes: '',
      players: [
        {
          name: 'Player 1',
          score: [1],
        },
      ],
    });
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
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2],
          },
        ],
      },
    ];

    service.history.set(state);
    service.historyCurrentIndex.set(1);

    expect(service.isUndoEnabled()).toBe(true);

    service.undo();
    expect(service.historyCurrentIndex()).toBe(0);
    expect(service.scorekeeperModel()).toStrictEqual({
      notes: '',
      players: [
        {
          name: 'Player 1',
          score: [1],
        },
      ],
    });
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
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2],
          },
        ],
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
    });
    service.history.set(state);
    service.historyCurrentIndex.set(1);

    expect(service.isRedoEnabled()).toBe(false);

    service.redo();
    expect(service.historyCurrentIndex()).toBe(1);
    expect(service.scorekeeperModel()).toStrictEqual({
      notes: '',
      players: [
        {
          name: 'Player 1',
          score: [1, 2],
        },
      ],
    });
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
      },
      {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1, 2],
          },
        ],
      },
    ];

    service.history.set(state);
    service.historyCurrentIndex.set(0);

    expect(service.isRedoEnabled()).toBe(true);

    service.redo();
    expect(service.historyCurrentIndex()).toBe(1);
    expect(service.scorekeeperModel()).toStrictEqual({
      notes: '',
      players: [
        {
          name: 'Player 1',
          score: [1, 2],
        },
      ],
    });
  });
});
