import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Mocked } from 'vitest';
import { Actions } from './actions';
import { ActionsPositionService } from './actions-positions.service';
import { StateService } from '../state/state.service';
import { By } from '@angular/platform-browser';

@Component({ selector: 'sk-notes', template: '' })
class NotesStub {}

@Component({ selector: 'sk-settings', template: '' })
class SettingsStub {}

describe('Actions', () => {
  describe('actions position is top', () => {
    const actionsPositionServiceStub: Mocked<ActionsPositionService> = {
      position: signal('top'),
    } as unknown as Mocked<ActionsPositionService>;

    const stateServiceStub: Mocked<StateService> = {
      isUndoEnabled: vi.fn().mockReturnValue(false),
      isRedoEnabled: vi.fn().mockReturnValue(false),
      isInitialState: vi.fn(),
      notes: signal(''),
      addPlayer: vi.fn(),
      addRound: vi.fn(),
    } as unknown as Mocked<StateService>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: ActionsPositionService,
            useValue: actionsPositionServiceStub,
          },
          {
            provide: StateService,
            useValue: stateServiceStub,
          },
        ],
      }).overrideComponent(Actions, {
        set: {
          imports: [NotesStub, SettingsStub],
          schemas: [NO_ERRORS_SCHEMA],
        },
      });

      vi.resetAllMocks();
    });

    it('should be in horizontal position', async () => {
      const fixture = TestBed.createComponent(Actions);
      await fixture.whenStable();
      expect(fixture.componentInstance.isActionsPositionVertical()).toBe(false);

      const containerDiv = fixture.nativeElement.querySelector('div');
      expect(containerDiv.classList).toContain('w-full');
    });

    it('should add player', async () => {
      const fixture = TestBed.createComponent(Actions);
      await fixture.whenStable();
      const stateAddPlayerSpy = vi.spyOn(stateServiceStub, 'addPlayer');
      const playerAddedspy = vi.spyOn(fixture.componentInstance.playerAdded, 'emit');
      const addPlayerButton = fixture.debugElement.query(By.css('sk-button'));
      expect(addPlayerButton.properties['showText']).toBe(true);
      addPlayerButton.triggerEventHandler('action');
      expect(stateAddPlayerSpy).toHaveBeenCalled();
      expect(playerAddedspy).toHaveBeenCalled();
    });

    it('should add round', async () => {
      const fixture = TestBed.createComponent(Actions);
      await fixture.whenStable();
      const stateAddRoundSpy = vi.spyOn(stateServiceStub, 'addRound');
      const roundAddedSpy = vi.spyOn(fixture.componentInstance.roundAdded, 'emit');
      const addRoundButton = fixture.debugElement.query(By.css('sk-button:nth-child(2)'));
      addRoundButton.triggerEventHandler('action');
      expect(stateAddRoundSpy).toHaveBeenCalled();
      expect(roundAddedSpy).toHaveBeenCalled();
    });

    it('should include notes button with type "positive" when notes are empty', async () => {
      const fixture = TestBed.createComponent(Actions);
      await fixture.whenStable();
      const notesButton = fixture.debugElement.query(By.css('sk-button:nth-child(3)'));
      expect(notesButton.properties['type']).toBe('positive');
    });

    it('should include edit mode button', async () => {
      const fixture = TestBed.createComponent(Actions);
      await fixture.whenStable();
      const editModeButton = fixture.debugElement.query(By.css('sk-button:nth-child(4)'));
      expect(editModeButton.properties['text']).toBe('Enter Edit Mode');
      editModeButton.triggerEventHandler('action');
      await fixture.whenStable();
      expect(editModeButton.properties['text']).toBe('Exit Edit Mode');
    });

    it('should include undo button in disabled state', async () => {
      const fixture = TestBed.createComponent(Actions);
      await fixture.whenStable();
      const undoButton = fixture.debugElement.query(By.css('sk-button:nth-child(5)'));
      expect(undoButton.properties['disabled']).toBe(true);
    });

    it('should include redo button in disabled state', async () => {
      const fixture = TestBed.createComponent(Actions);
      await fixture.whenStable();
      const redoButton = fixture.debugElement.query(By.css('sk-button:nth-child(6)'));
      expect(redoButton.properties['disabled']).toBe(true);
    });
  });

  describe('actions position is left', () => {
    const actionsPositionServiceStub: Mocked<ActionsPositionService> = {
      position: signal('left'),
    } as unknown as Mocked<ActionsPositionService>;

    const stateServiceStub: Mocked<StateService> = {
      isUndoEnabled: vi.fn().mockReturnValue(true),
      isRedoEnabled: vi.fn().mockReturnValue(true),
      isInitialState: vi.fn(),
      notes: signal('Test'),
      addPlayer: vi.fn(),
      addRound: vi.fn(),
    } as unknown as Mocked<StateService>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: ActionsPositionService,
            useValue: actionsPositionServiceStub,
          },
          {
            provide: StateService,
            useValue: stateServiceStub,
          },
        ],
      }).overrideComponent(Actions, {
        set: {
          imports: [NotesStub, SettingsStub],
          schemas: [NO_ERRORS_SCHEMA],
        },
      });

      vi.resetAllMocks();
    });

    it('should be in vertical position', async () => {
      const fixture = TestBed.createComponent(Actions);

      await fixture.whenStable();
      expect(fixture.componentInstance.isActionsPositionVertical()).toBe(true);

      const containerDiv = fixture.nativeElement.querySelector('div');
      expect(containerDiv.classList).toContain('w-11');

      const addPlayerButton = fixture.debugElement.query(By.css('sk-button'));
      expect(addPlayerButton.properties['showText']).toBe(false);
    });

    it('should include notes button with type "notice" when notes are not empty', async () => {
      const fixture = TestBed.createComponent(Actions);
      await fixture.whenStable();
      const notesButton = fixture.debugElement.query(By.css('sk-button:nth-child(3)'));
      expect(notesButton.properties['type']).toBe('notice');
    });
  });
});
