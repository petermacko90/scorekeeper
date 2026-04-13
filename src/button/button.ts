import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sk-button',
  templateUrl: './button.html',
})
export class Button {
  text = input.required<string>();
  icon = input.required<string>();
  type = input<'default' | 'danger'>('default');

  action = output<void>();
}
