import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sk-remove-button',
  templateUrl: './remove-button.html',
})
export class RemoveButton {
  tooltip = input.required<string>();
  icon = input<'delete' | 'person_remove'>('delete');

  action = output<void>();
}
