import { Component, inject, input, output } from '@angular/core';
import { ActionsPositionService } from '../actions/actions-positions.service';

@Component({
  selector: 'sk-dialog',
  templateUrl: './dialog.html',
})
export class Dialog {
  actions = inject(ActionsPositionService);

  heading = input.required<string>();

  dialogToggled = output<void>();
}
