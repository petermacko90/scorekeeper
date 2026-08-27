import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Mocked } from 'vitest';
import { ActionsPositionService } from '../actions/actions-positions.service';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from '../theme/theme.service';
import { Settings } from './settings';

describe('Settings', () => {
  describe('actions position is top and theme is system', () => {
    const actionsPositionServiceStub: Mocked<ActionsPositionService> = {
      position: signal('top'),
      setPosition: vi.fn(),
    } as unknown as Mocked<ActionsPositionService>;

    const storageServiceStub: Mocked<StorageService> = {
      loadTheme: vi.fn().mockReturnValue('system'),
      deleteTheme: vi.fn(),
      saveTheme: vi.fn(),
    } as unknown as Mocked<StorageService>;

    const themeServiceStub: Mocked<ThemeService> = {
      changeTheme: vi.fn(),
    } as unknown as Mocked<ThemeService>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: ActionsPositionService, useValue: actionsPositionServiceStub },
          {
            provide: StorageService,
            useValue: storageServiceStub,
          },
          { provide: ThemeService, useValue: themeServiceStub },
        ],
      });
    });

    it('should have top actions position and system theme', async () => {
      const fixture = TestBed.createComponent(Settings);
      await fixture.whenStable();

      const setPositionSpy = vi.spyOn(actionsPositionServiceStub, 'setPosition');
      const actionspositionSelect = fixture.debugElement.query(By.css('sk-select'));
      expect(actionspositionSelect.componentInstance.field().value()).toBe('top');
      actionspositionSelect.triggerEventHandler('selectionChanged', 'right');
      expect(actionspositionSelect.componentInstance.field().value()).toBe('right');
      expect(setPositionSpy).toHaveBeenCalledWith('right');

      const deleteThemeSpy = vi.spyOn(storageServiceStub, 'deleteTheme');
      const themeSelect = fixture.debugElement.query(By.css('sk-select:nth-child(2)'));
      expect(themeSelect.componentInstance.field().value()).toBe('system');
      themeSelect.triggerEventHandler('selectionChanged', 'dark');
      expect(themeSelect.componentInstance.field().value()).toBe('dark');
      themeSelect.triggerEventHandler('selectionChanged', 'system');
      expect(themeSelect.componentInstance.field().value()).toBe('system');
      expect(deleteThemeSpy).toHaveBeenCalled();
    });

    it('should close', async () => {
      const fixture = TestBed.createComponent(Settings);
      const dialogNativeElement = fixture.componentInstance.dialogRef.nativeElement;
      dialogNativeElement.querySelector('dialog')!.close = () => {};
      const closeSpy = vi.spyOn(dialogNativeElement.querySelector('dialog')!, 'close');
      await fixture.whenStable();

      const closeButton = fixture.debugElement.query(By.css('sk-button'));
      closeButton.triggerEventHandler('action');
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('actions position is left and theme is light', () => {
    const actionsPositionServiceStub: Mocked<ActionsPositionService> = {
      position: signal('left'),
    } as unknown as Mocked<ActionsPositionService>;

    const storageServiceStub: Mocked<StorageService> = {
      loadTheme: vi.fn().mockReturnValue('light'),
      deleteTheme: vi.fn(),
      saveTheme: vi.fn(),
    } as unknown as Mocked<StorageService>;

    const themeServiceStub: Mocked<ThemeService> = {
      changeTheme: vi.fn(),
    } as unknown as Mocked<ThemeService>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: ActionsPositionService, useValue: actionsPositionServiceStub },
          {
            provide: StorageService,
            useValue: storageServiceStub,
          },
          { provide: ThemeService, useValue: themeServiceStub },
        ],
      });
    });

    it('should have left actions position and light theme', async () => {
      const fixture = TestBed.createComponent(Settings);
      await fixture.whenStable();
      expect(fixture.componentInstance).toBeTruthy();

      const actionspositionSelect = fixture.debugElement.query(By.css('sk-select'));
      expect(actionspositionSelect.componentInstance.field().value()).toBe('left');

      const themeSelect = fixture.debugElement.query(By.css('sk-select:nth-child(2)'));
      expect(themeSelect.componentInstance.field().value()).toBe('light');
    });
  });
});
