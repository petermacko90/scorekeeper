import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Mocked } from 'vitest';
import { Notes } from './notes';
import { StorageService } from '../storage/storage.service';

describe('Notes', () => {
  const storageServiceStub: Mocked<StorageService> = {
    load: vi.fn().mockReturnValue(null),
  } as unknown as Mocked<StorageService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageServiceStub }],
    });
  });

  it('should display notes', async () => {
    const fixture = TestBed.createComponent(Notes);
    await fixture.whenStable();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.value).toBe('');

    fixture.componentInstance.state.setState({
      notes: 'Test',
      playerCounter: 1,
      players: [],
    });
    await fixture.whenStable();
    expect(textarea.value).toBe('Test');
  });

  it('should close', async () => {
    const fixture = TestBed.createComponent(Notes);
    const dialogNativeElement = fixture.componentInstance.dialogRef.nativeElement;
    dialogNativeElement.querySelector('dialog')!.close = () => {};
    const closeSpy = vi.spyOn(dialogNativeElement.querySelector('dialog')!, 'close');
    await fixture.whenStable();

    const closeButton = fixture.debugElement.query(By.css('sk-button'));
    closeButton.triggerEventHandler('action');
    expect(closeSpy).toHaveBeenCalled();
  });
});
