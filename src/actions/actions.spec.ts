import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Mocked } from 'vitest';
import { Actions } from './actions';
import { StorageService } from '../storage/storage.service';
import { StateService } from '../state/state.service';

describe('Actions', () => {
  const storageServiceStub: Mocked<StorageService> = {
    load: vi.fn().mockReturnValue(null),
    save: vi.fn(),
    loadActionsPosition: vi.fn().mockReturnValue('top'),
    saveActionsPosition: vi.fn(),
    loadTheme: vi.fn().mockReturnValue('system'),
  } as unknown as Mocked<StorageService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });
  });

  it('should be in horizontal position', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    expect(fixture.componentInstance.isActionsPositionVertical()).toBe(false);

    const containerDiv = fixture.nativeElement.querySelector('div');
    expect(containerDiv.classList).toContain('w-full');
  });

  it('should be in vertical position', async () => {
    const fixture = TestBed.createComponent(Actions);
    fixture.componentInstance['actions'].setPosition('left');
    await fixture.whenStable();
    expect(fixture.componentInstance.isActionsPositionVertical()).toBe(true);

    const containerDiv = fixture.nativeElement.querySelector('div');
    expect(containerDiv.classList).toContain('w-11');

    const addPlayerButton = fixture.debugElement.query(By.css('sk-button'));
    expect(addPlayerButton.componentInstance.showText()).toBe(false);
  });

  it('should add player', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    const stateAddPlayerSpy = vi.spyOn(fixture.componentInstance.state, 'addPlayer');
    const playerAddedspy = vi.spyOn(fixture.componentInstance.playerAdded, 'emit');
    const addPlayerButton = fixture.debugElement.query(By.css('sk-button'));

    expect(addPlayerButton.attributes['text']).toBe('Add Player');
    expect(addPlayerButton.componentInstance.showText()).toBe(true);
    addPlayerButton.triggerEventHandler('action');
    expect(stateAddPlayerSpy).toHaveBeenCalled();
    expect(playerAddedspy).toHaveBeenCalled();
  });

  it('should add round', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    const stateAddRoundSpy = vi.spyOn(fixture.componentInstance.state, 'addRound');
    const roundAddedSpy = vi.spyOn(fixture.componentInstance.roundAdded, 'emit');
    const addRoundButton = fixture.debugElement.query(By.css('sk-button:nth-child(2)'));

    expect(addRoundButton.attributes['text']).toBe('Add Round');
    addRoundButton.triggerEventHandler('action');
    expect(stateAddRoundSpy).toHaveBeenCalled();
    expect(roundAddedSpy).toHaveBeenCalled();
  });

  it('should include notes button with type "positive" when notes are empty', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    const notesButton = fixture.debugElement.query(By.css('sk-button:nth-child(3)'));

    expect(notesButton.attributes['text']).toBe('Notes');
    expect(notesButton.properties['innerHTML']).toContain('bg-aurora-green');
  });

  it('should include notes button with type "notice" when notes are not empty', async () => {
    const fixture = TestBed.createComponent(Actions);

    fixture.componentInstance.state.setState({
      notes: 'Test',
      playerCounter: 1,
      players: [{ name: 'Player 1', score: [null] }],
    });

    await fixture.whenStable();
    const notesButton = fixture.debugElement.query(By.css('sk-button:nth-child(3)'));

    expect(notesButton.properties['innerHTML']).toContain('bg-aurora-yellow');
  });

  it('should include edit mode button', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    const editModeButton = fixture.debugElement.query(By.css('sk-button:nth-child(4)'));

    expect(editModeButton.properties['innerHTML']).toContain('Enter Edit Mode');
    editModeButton.triggerEventHandler('action');
    await fixture.whenStable();
    expect(editModeButton.properties['innerHTML']).toContain('Exit Edit Mode');
  });

  it('should include undo button in disabled state', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    const undoButton = fixture.debugElement.query(By.css('sk-button:nth-child(5)'));

    expect(undoButton.attributes['text']).toBe('Undo');
    expect(undoButton.componentInstance.disabled()).toBe(true);
  });

  it('should include undo button in enabled state', async () => {
    const fixture = TestBed.createComponent(Actions);

    fixture.componentInstance.state.history.set([
      {
        notes: '',
        playerCounter: 1,
        players: [{ name: 'Player 1', score: [null] }],
      },
      {
        notes: '',
        playerCounter: 1,
        players: [{ name: 'Player 1', score: [10, null] }],
      },
    ]);

    fixture.componentInstance.state.historyCurrentIndex.set(1);
    await fixture.whenStable();
    const undoButton = fixture.debugElement.query(By.css('sk-button:nth-child(5)'));
    expect(undoButton.componentInstance.disabled()).toBe(false);

    undoButton.triggerEventHandler('action');
    await fixture.whenStable();
    expect(fixture.componentInstance.state.historyCurrentIndex()).toBe(0);
  });

  it('should include redo button in disabled state', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    const redoButton = fixture.debugElement.query(By.css('sk-button:nth-child(6)'));

    expect(redoButton.attributes['text']).toBe('Redo');
    expect(redoButton.componentInstance.disabled()).toBe(true);
  });

  it('should include redo button in enabled state', async () => {
    const fixture = TestBed.createComponent(Actions);

    fixture.componentInstance.state.history.set([
      {
        notes: '',
        playerCounter: 1,
        players: [{ name: 'Player 1', score: [null] }],
      },
      {
        notes: '',
        playerCounter: 1,
        players: [{ name: 'Player 1', score: [10, null] }],
      },
    ]);

    fixture.componentInstance.state.historyCurrentIndex.set(0);
    await fixture.whenStable();

    const redoButton = fixture.debugElement.query(By.css('sk-button:nth-child(6)'));
    expect(redoButton.componentInstance.disabled()).toBe(false);

    redoButton.triggerEventHandler('action');
    await fixture.whenStable();
    expect(fixture.componentInstance.state.historyCurrentIndex()).toBe(1);
  });

  it('should include reset button', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    const resetButton = fixture.debugElement.query(By.css('sk-button:nth-child(7)'));

    expect(resetButton.attributes['text']).toBe('Reset');
    expect(resetButton.componentInstance.disabled()).toBe(true);

    fixture.componentInstance.state.setState({
      notes: '',
      playerCounter: 1,
      players: [{ name: 'Player 1', score: [10, null] }],
    });
    await fixture.whenStable();
    expect(resetButton.componentInstance.disabled()).toBe(false);

    resetButton.triggerEventHandler('action');
    await fixture.whenStable();
    expect(fixture.componentInstance.state.scorekeeperModel()).toStrictEqual(
      StateService.initialState,
    );
  });

  it('should include settings button', async () => {
    const fixture = TestBed.createComponent(Actions);
    await fixture.whenStable();
    const settingsButton = fixture.debugElement.query(By.css('sk-button:nth-child(8)'));

    expect(settingsButton.attributes['text']).toBe('More');
  });
});
