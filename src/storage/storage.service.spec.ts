import { Mocked } from 'vitest';
import { StorageService } from './storage.service';
import { LocalStorage } from './localStorage';
import { TestBed } from '@angular/core/testing';
import { ScorekeeperFormModel } from '../state/state.model';

describe('StorageService', () => {
  describe('getItem returns "test"', () => {
    const localStorageServiceStub: Mocked<LocalStorage> = {
      getLocalStorage: vi.fn().mockReturnValue({
        setItem: vi.fn(),
        getItem: vi.fn().mockReturnValue('test'),
        removeItem: vi.fn(),
      }),
    };

    let service: StorageService;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LocalStorage, useValue: localStorageServiceStub }],
      });

      service = TestBed.inject(StorageService);
    });

    it('should save state', () => {
      const setItemSpy = vi.spyOn(localStorageServiceStub.getLocalStorage(), 'setItem');

      const state: ScorekeeperFormModel = {
        notes: '',
        players: [
          {
            name: 'Player 1',
            score: [1],
          },
        ],
        playerCounter: 1,
      };

      service.save(state);
      expect(setItemSpy).toHaveBeenCalledWith(
        'scorekeeper',
        '{"notes":"","players":[{"name":"Player 1","score":[1]}],"playerCounter":1}',
      );
    });

    it('should return null state in case of parse error', () => {
      const state = service.load();
      expect(state).toBe(null);
    });

    it('should save actions position', () => {
      const setItemSpy = vi.spyOn(localStorageServiceStub.getLocalStorage(), 'setItem');
      service.saveActionsPosition('left');
      expect(setItemSpy).toHaveBeenCalledWith('skActionsPosition', 'left');
    });

    it('should return null and remove it from storage if saved actions position is invalid', () => {
      const removItemSpy = vi.spyOn(localStorageServiceStub.getLocalStorage(), 'removeItem');
      const position = service.loadActionsPosition();
      expect(position).toBe(null);
      expect(removItemSpy).toHaveBeenCalledWith('skActionsPosition');
    });

    it('should save theme', () => {
      const setItemSpy = vi.spyOn(localStorageServiceStub.getLocalStorage(), 'setItem');
      service.saveTheme('light');
      expect(setItemSpy).toHaveBeenCalledWith('skTheme', 'light');
    });

    it('should return system theme and remove it from storage if saved theme is invalid', () => {
      const removItemSpy = vi.spyOn(localStorageServiceStub.getLocalStorage(), 'removeItem');
      const theme = service.loadTheme();
      expect(theme).toBe('system');
      expect(removItemSpy).toHaveBeenCalledWith('skTheme');
    });
  });

  describe('getItem returns null', () => {
    const localStorageServiceStub: Mocked<LocalStorage> = {
      getLocalStorage: vi.fn().mockReturnValue({
        setItem: vi.fn(),
        getItem: vi.fn().mockReturnValue(null),
        removeItem: vi.fn(),
      }),
    };

    let service: StorageService;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LocalStorage, useValue: localStorageServiceStub }],
      });

      service = TestBed.inject(StorageService);
    });

    it('should return null state if getItem returns null', () => {
      const state = service.load();
      expect(state).toBe(null);
    });

    it('should return null actions position if getItem returns null', () => {
      const position = service.loadActionsPosition();
      expect(position).toBe(null);
    });

    it('should return system theme if getItem returns null', () => {
      const theme = service.loadTheme();
      expect(theme).toBe('system');
    });
  });

  describe('getItem returns valid state', () => {
    const stateStringified =
      '{"players":[{"name":"Player 1","score":[1]}],"notes":"","playerCounter":1}';

    const localStorageServiceStub: Mocked<LocalStorage> = {
      getLocalStorage: vi.fn().mockReturnValue({
        setItem: vi.fn(),
        getItem: vi.fn().mockReturnValue(stateStringified),
        removeItem: vi.fn(),
      }),
    };

    let service: StorageService;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LocalStorage, useValue: localStorageServiceStub }],
      });

      service = TestBed.inject(StorageService);
    });

    it('should parse stored state', () => {
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

      const state = service.load();
      expect(state).toStrictEqual(expected);
    });
  });

  describe('getItem returns "bottom"', () => {
    const localStorageServiceStub: Mocked<LocalStorage> = {
      getLocalStorage: vi.fn().mockReturnValue({
        setItem: vi.fn(),
        getItem: vi.fn().mockReturnValue('bottom'),
        removeItem: vi.fn(),
      }),
    };

    let service: StorageService;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LocalStorage, useValue: localStorageServiceStub }],
      });

      service = TestBed.inject(StorageService);
    });

    it('should return stored actions position', () => {
      const position = service.loadActionsPosition();
      expect(position).toBe('bottom');
    });
  });

  describe('getItem returns "light"', () => {
    const localStorageServiceStub: Mocked<LocalStorage> = {
      getLocalStorage: vi.fn().mockReturnValue({
        setItem: vi.fn(),
        getItem: vi.fn().mockReturnValue('light'),
        removeItem: vi.fn(),
      }),
    };

    let service: StorageService;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LocalStorage, useValue: localStorageServiceStub }],
      });

      service = TestBed.inject(StorageService);
    });

    it('should return stored theme', () => {
      const theme = service.loadTheme();
      expect(theme).toBe('light');
    });

    it('should delete theme', () => {
      const removItemSpy = vi.spyOn(localStorageServiceStub.getLocalStorage(), 'removeItem');
      service.deleteTheme();
      expect(removItemSpy).toHaveBeenCalledWith('skTheme');
    });
  });

  describe('getItem throws error', () => {
    const localStorageServiceStub: Mocked<LocalStorage> = {
      getLocalStorage: vi.fn().mockReturnValue({
        setItem: vi.fn(),
        getItem: vi.fn().mockThrow('error'),
        removeItem: vi.fn(),
      }),
    };

    let service: StorageService;

    beforeAll(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LocalStorage, useValue: localStorageServiceStub }],
      });

      service = TestBed.inject(StorageService);
    });

    it('should return null state in case of error', () => {
      const state = service.load();
      expect(state).toBe(null);
    });

    it('should return top position in case of error', () => {
      const position = service.loadActionsPosition();
      expect(position).toBe(null);
    });

    it('should return system theme in case of error', () => {
      const theme = service.loadTheme();
      expect(theme).toBe('system');
    });
  });
});
