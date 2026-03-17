import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sk-remove-button',
  templateUrl: './remove-button.html',
})
export class RemoveButton {
  tooltip = input.required<string>();

  action = output<void>();
}
