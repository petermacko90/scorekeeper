import { TestBed } from '@angular/core/testing';
import { ActionsPositionService } from './actions-positions.service';
import { Mocked } from 'vitest';
import { StorageService } from '../storage/storage.service';

const storageServiceStub: Mocked<StorageService> = {
  saveActionsPosition: vi.fn(),
  loadActionsPosition: vi.fn(),
} as unknown as Mocked<StorageService>;

describe('ActionsPositionService', () => {
  let actionsPosition: ActionsPositionService;

  it('should return "top" when storage returns null', () => {
    storageServiceStub.loadActionsPosition.mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });

    actionsPosition = TestBed.inject(ActionsPositionService);

    expect(actionsPosition.position()).toBe('top');
  });

  it('should load the value from storage', () => {
    storageServiceStub.loadActionsPosition.mockReturnValue('bottom');

    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });

    actionsPosition = TestBed.inject(ActionsPositionService);

    expect(actionsPosition.position()).toBe('bottom');
  });

  it('should set position', () => {
    storageServiceStub.loadActionsPosition.mockReturnValue('left');

    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });

    actionsPosition = TestBed.inject(ActionsPositionService);

    actionsPosition.setPosition('right');

    expect(actionsPosition.position()).toBe('right');
  });
});
