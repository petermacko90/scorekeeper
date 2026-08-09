import { TestBed } from '@angular/core/testing';
import { RemoveButton } from './remove-button';
import { inputBinding, signal } from '@angular/core';

describe('RemoveButton', () => {
  it('should display delete icon by default', async () => {
    const fixture = TestBed.createComponent(RemoveButton, {
      bindings: [inputBinding('tooltip', signal('Test'))],
    });

    await fixture.whenStable();

    const iconSpan: HTMLSpanElement = fixture.nativeElement.querySelector(
      '.material-symbols-outlined',
    );

    expect(iconSpan.textContent).toContain('delete');
  });

  it('should display passed icon', async () => {
    const fixture = TestBed.createComponent(RemoveButton, {
      bindings: [
        inputBinding('tooltip', signal('Test')),
        inputBinding('icon', signal('person_remove')),
      ],
    });

    await fixture.whenStable();

    const iconSpan: HTMLSpanElement = fixture.nativeElement.querySelector(
      '.material-symbols-outlined',
    );

    expect(iconSpan.textContent).toContain('person_remove');
  });
});
