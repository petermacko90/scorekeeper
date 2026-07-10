import { TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sk-select',
  templateUrl: './select.html',
  imports: [TitleCasePipe],
})
export class Select<T extends string> {
  id = input.required<string>();
  label = input.required<string>();
  value = input.required<T>();
  options = input.required<T[]>();

  selectionChanged = output<T>();

  selectionChange($event: Event) {
    const value = ($event.target as HTMLSelectElement).value as T;
    this.selectionChanged.emit(value);
  }
}
