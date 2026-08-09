import { TestBed } from '@angular/core/testing';
import { Injector, inputBinding, signal } from '@angular/core';
import { Select } from './select';
import { Theme, themes } from '../settings/settings.model';
import { form } from '@angular/forms/signals';

describe('Select', () => {
  it('should display default value and change value', async () => {
    const model = signal<{ theme: Theme }>({
      theme: 'system',
    });

    const themeForm = form(model, () => {}, { injector: TestBed.inject(Injector) });

    const fixture = TestBed.createComponent(Select, {
      bindings: [
        inputBinding('id', signal('theme')),
        inputBinding('label', signal('Theme:')),
        inputBinding('field', signal(themeForm.theme())),
        inputBinding('options', signal(themes)),
      ],
    });

    await fixture.whenStable();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.value).toBe('system');

    select.value = select.options[2].value;
    select.dispatchEvent(new Event('change'));
    expect(select.value).toBe('light');
  });
});
