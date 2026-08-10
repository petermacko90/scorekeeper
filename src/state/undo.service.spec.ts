import { TestBed } from '@angular/core/testing';
import { HistoryService } from './undo.service';
import { ScorekeeperFormModel } from './state.model';
import { StateService } from './state.service';
import { Mocked } from 'vitest';
import { StorageService } from '../storage/storage.service';

const storageServiceStub: Mocked<StorageService> = {
  loadPlayerCounter: vi.fn().mockReturnValue(1),
} as unknown as Mocked<StorageService>;

const stateServiceStub: Mocked<StateService> = {
  setState: vi.fn(),
} as unknown as Mocked<StateService>;

describe('HistoryService', () => {
  let history: HistoryService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StateService, useValue: stateServiceStub },
        { provide: StorageService, useValue: storageServiceStub },
      ],
    });
  });

  it('should add to empty state', () => {
    history = TestBed.inject(HistoryService);

    const newState: ScorekeeperFormModel = {
      notes: '',
      players: [
        {
          name: 'Player 1',
          score: [1],
        },
      ],
    };

    history.addState(newState);

    expect(history.history().length).toBe(1);
    expect(history.currentIndex()).toBe(0);
    expect(history.history()).toStrictEqual([newState]);
    expect(history.isUndoEnabled()).toBe(false);
    expect(history.isRedoEnabled()).toBe(false);
  });

  it('should keep the history at 10 entries', () => {
    history = TestBed.inject(HistoryService);

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

    history.history.set(state);
    history.currentIndex.set(9);

    history.addState(newState);

    expect(history.history().length).toBe(10);
    expect(history.currentIndex()).toBe(9);
    expect(history.history()).toStrictEqual([...state.slice(1), newState]);
    expect(history.isUndoEnabled()).toBe(true);
    expect(history.isRedoEnabled()).toBe(false);
  });
});
