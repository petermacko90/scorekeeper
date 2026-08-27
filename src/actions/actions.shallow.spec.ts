import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Mocked } from 'vitest';
import { Actions } from './actions';
import { Notes } from '../notes/notes';
import { Settings } from '../settings/settings';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'sk-notes',
  template: '',
  providers: [
    {
      provide: Notes,
      useClass: NotesStub,
    },
  ],
})
class NotesStub {}

@Component({
  selector: 'sk-settings',
  template: '',
  providers: [{ provide: Settings, useClass: SettingsStub }],
})
class SettingsStub {}

describe('Actions shallow', () => {
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
      imports: [Actions, NotesStub, SettingsStub],
    });
  });

  it('should open notes', async () => {
    const fixture = TestBed.createComponent(Actions);
    const notesDialogNativeElement = fixture.componentInstance['notes']().dialogRef.nativeElement;
    notesDialogNativeElement.querySelector('dialog')!.showModal = () => {};
    const openNotesSpy = vi.spyOn(notesDialogNativeElement.querySelector('dialog')!, 'showModal');
    await fixture.whenStable();

    const notesButton = fixture.debugElement.query(By.css('sk-button:nth-child(3)'));
    notesButton.triggerEventHandler('action');
    expect(openNotesSpy).toHaveBeenCalled();
  });

  it('should open settigs', async () => {
    const fixture = TestBed.createComponent(Actions);
    const settingsDialogNativeElement =
      fixture.componentInstance['settings']().dialogRef.nativeElement;
    settingsDialogNativeElement.querySelector('dialog')!.showModal = () => {};
    const openSettingsSpy = vi.spyOn(
      settingsDialogNativeElement.querySelector('dialog')!,
      'showModal',
    );
    await fixture.whenStable();

    const settingsButton = fixture.debugElement.query(By.css('sk-button:nth-child(8)'));
    settingsButton.triggerEventHandler('action');
    expect(openSettingsSpy).toHaveBeenCalled();
  });
});
