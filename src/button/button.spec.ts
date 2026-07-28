import { inputBinding, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  it('should display text by default', async () => {
    const fixture = TestBed.createComponent(Button, {
      bindings: [inputBinding('text', signal('Test')), inputBinding('icon', signal('icon'))],
    });

    await fixture.whenStable();
    const textSpan: HTMLSpanElement = fixture.nativeElement.querySelectorAll('span')[1];
    expect(textSpan.textContent).toContain('Test');
  });

  it('should not display text if showText is false', async () => {
    const fixture = TestBed.createComponent(Button, {
      bindings: [
        inputBinding('text', signal('Test')),
        inputBinding('icon', signal('icon')),
        inputBinding('showText', signal(false)),
      ],
    });

    await fixture.whenStable();
    const textSpan = fixture.nativeElement.querySelectorAll('span')[1];
    expect(textSpan).toBeUndefined();
  });

  it('should not hide text on large screen', async () => {
    const fixture = TestBed.createComponent(Button, {
      bindings: [
        inputBinding('text', signal('Test')),
        inputBinding('icon', signal('icon')),
        inputBinding('showText', signal(true)),
        inputBinding('hideTextOnSmallScreen', signal(true)),
      ],
    });

    await fixture.whenStable();
    const textSpan: HTMLSpanElement = fixture.nativeElement.querySelectorAll('span')[1];
    expect(textSpan.textContent).toContain('Test');
  });
});
