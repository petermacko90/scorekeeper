import { TestBed } from '@angular/core/testing';
import { Mocked } from 'vitest';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from './theme.service';

vi.hoisted(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    enumerable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('ThemeService prefers-color-scheme: dark', () => {
  const storageServiceStub: Mocked<StorageService> = {
    loadTheme: vi.fn(),
  } as unknown as Mocked<StorageService>;

  let service: ThemeService;

  it('should be dark if theme is system and query returns true', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });
    service = TestBed.inject(ThemeService);

    storageServiceStub.loadTheme.mockReturnValue('system');
    service.changeTheme();
    expect(document.documentElement.classList.toString()).contain('dark');
  });

  it('should be light if theme is light', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });
    service = TestBed.inject(ThemeService);

    storageServiceStub.loadTheme.mockReturnValue('light');
    service.changeTheme();
    expect(document.documentElement.classList.toString()).not.contain('dark');
  });

  it('should be dark if theme is dark', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });
    service = TestBed.inject(ThemeService);

    storageServiceStub.loadTheme.mockReturnValue('dark');
    service.changeTheme();
    expect(document.documentElement.classList.toString()).contain('dark');
  });
});
