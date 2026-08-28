import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Mocked } from 'vitest';
import { App } from './app';
import { StorageService } from '../storage/storage.service';
import { ThemeService } from '../theme/theme.service';
import { StateService } from '../state/state.service';

describe('App', () => {
  const storageServiceStub: Mocked<StorageService> = {
    load: vi.fn().mockReturnValue(StateService.initialState),
    save: vi.fn(),
    loadActionsPosition: vi.fn().mockReturnValue('top'),
    saveActionsPosition: vi.fn(),
    loadTheme: vi.fn().mockReturnValue('system'),
  } as unknown as Mocked<StorageService>;

  const themeServiceStub: Mocked<ThemeService> = {
    changeTheme: vi.fn(),
  } as unknown as Mocked<ThemeService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageServiceStub },
        { provide: ThemeService, useValue: themeServiceStub },
      ],
    });
  });

  it('should contain flex-col if actions postion is bottom', async () => {
    storageServiceStub.loadActionsPosition.mockReturnValue('bottom');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const containerDiv: HTMLDivElement = fixture.nativeElement.querySelector('div');
    expect(containerDiv.classList.toString()).toContain('flex-col');
  });

  it('should contain flex-row if actions postion is left', async () => {
    storageServiceStub.loadActionsPosition.mockReturnValue('left');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const containerDiv: HTMLDivElement = fixture.nativeElement.querySelector('div');
    expect(containerDiv.classList.toString()).toContain('flex-row');
  });

  it('should focus last player', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const lastPlayer =
      fixture.componentInstance[
        'scoreboard'
      ]().lastPlayerRef.nativeElement.querySelector<HTMLInputElement>('th:last-child>input')!;

    const focusSpy = vi.spyOn(lastPlayer, 'focus');
    const selectSpy = vi.spyOn(lastPlayer, 'select');

    const actions = fixture.debugElement.query(By.css('sk-actions'));
    actions.triggerEventHandler('playerAdded');
    await fixture.whenStable();
    actions.triggerEventHandler('playerAdded');
    await fixture.whenStable();
    expect(focusSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
  });

  it('should scroll to last round', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const lastRoundNativeElement =
      fixture.componentInstance['scoreboard']().lastRoundRef.nativeElement;
    lastRoundNativeElement.querySelector('tbody>tr:last-child')!.scrollIntoView = () => {};

    const scrollSpy = vi.spyOn(
      lastRoundNativeElement.querySelector('tbody>tr:last-child')!,
      'scrollIntoView',
    );

    const actions = fixture.debugElement.query(By.css('sk-actions'));
    actions.triggerEventHandler('roundAdded');
    await fixture.whenStable();
    actions.triggerEventHandler('roundAdded');
    await fixture.whenStable();
    expect(scrollSpy).toHaveBeenCalled();
  });
});
