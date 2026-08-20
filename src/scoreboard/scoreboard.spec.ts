import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Mocked } from 'vitest';
import { Scoreboard } from './scoreboard';
import { StorageService } from '../storage/storage.service';

describe('Scoreboard', () => {
  const storageServiceStub: Mocked<StorageService> = {
    load: vi.fn().mockReturnValue(null),
    save: vi.fn(),
    loadActionsPosition: vi.fn().mockReturnValue('top'),
  } as unknown as Mocked<StorageService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });
  });

  it('should have class "sk-table-height" if actions position is top', async () => {
    const fixture = TestBed.createComponent(Scoreboard);
    await fixture.whenStable();

    const mainElement: HTMLElement = fixture.nativeElement.querySelector('main');
    expect(mainElement.classList.toString()).toContain('sk-table-height');
  });

  it('should have class "sk-table-width" if actions position is left', async () => {
    storageServiceStub.loadActionsPosition.mockReturnValue('left');
    const fixture = TestBed.createComponent(Scoreboard);
    await fixture.whenStable();

    const mainElement: HTMLElement = fixture.nativeElement.querySelector('main');
    expect(mainElement.classList.toString()).toContain('sk-table-width');
  });

  it('should have initial state', async () => {
    const fixture = TestBed.createComponent(Scoreboard);
    await fixture.whenStable();

    const player1NameInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(player1NameInput.value).toBe('Player 1');

    const player1ScoreInput: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="number"]');
    expect(player1ScoreInput.value).toBe('');

    const player1Sum: HTMLTableCellElement = fixture.nativeElement.querySelector(
      'tfoot>tr>td:nth-child(2)',
    );
    expect(player1Sum.textContent.trim()).toBe('0');
  });

  it('should change player name', async () => {
    const fixture = TestBed.createComponent(Scoreboard);
    await fixture.whenStable();

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
    nameInput.value = 'Kamil';
    nameInput.dispatchEvent(new Event('input'));
    nameInput.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(nameInput.value).toBe('Kamil');
  });

  it('should change score and sum', async () => {
    const fixture = TestBed.createComponent(Scoreboard);
    await fixture.whenStable();

    const score1Input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type="number"]');
    const sumCell: HTMLTableCellElement = fixture.nativeElement.querySelector(
      'tfoot>tr>td:nth-child(2)',
    );

    score1Input.value = '10';
    score1Input.dispatchEvent(new Event('input'));
    score1Input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(score1Input.value).toBe('10');
    expect(sumCell.textContent.trim()).toBe('10');

    fixture.componentInstance.state.addRound();
    await fixture.whenStable();
    const score2Input: HTMLInputElement =
      fixture.nativeElement.querySelectorAll('input[type="number"]')[1];
    score2Input.value = '15';
    score2Input.dispatchEvent(new Event('input'));
    score2Input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(score2Input.value).toBe('15');
    expect(sumCell.textContent.trim()).toBe('25');
  });

  it('should remove player', async () => {
    const fixture = TestBed.createComponent(Scoreboard);
    await fixture.whenStable();
    fixture.componentInstance.editMode.toggleEditMode();
    await fixture.whenStable();

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
    nameInput.value = 'Kamil';
    nameInput.dispatchEvent(new Event('input'));
    nameInput.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    const removePlayerButton = fixture.debugElement.query(By.css('sk-remove-button'));
    removePlayerButton.triggerEventHandler('action');
    await fixture.whenStable();
    expect(nameInput.value).toBe('Player 1');
  });
});
