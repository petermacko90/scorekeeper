import { TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FieldState, FormField } from '@angular/forms/signals';

@Component({
  selector: 'sk-select',
  templateUrl: './select.html',
  imports: [TitleCasePipe, FormField],
})
export class Select<T extends string> {
  id = input.required<string>();
  label = input.required<string>();
  field = input.required<FieldState<T>>();
  options = input.required<T[]>();

  protected selectionChanged = output<T>();

  selectionChange($event: Event) {
    const value = ($event.target as HTMLSelectElement).value as T;
    this.selectionChanged.emit(value);
  }
}
