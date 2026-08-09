import { TestBed } from '@angular/core/testing';
import { Dialog } from './dialog';
import { inputBinding, signal } from '@angular/core';

describe('Dialog', () => {
  it('should display heading', async () => {
    const fixture = TestBed.createComponent(Dialog, {
      bindings: [inputBinding('heading', signal('Test'))],
    });

    await fixture.whenStable();
    const headingDiv: HTMLDivElement = fixture.nativeElement.querySelectorAll('div')[0];
    expect(headingDiv.textContent).toContain('Test');
  });
});
