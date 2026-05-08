import { Component, inject, output } from '@angular/core';
import { ActionsPositionService } from '../actions/actions-positions.service';

@Component({
  selector: 'sk-dialog',
  templateUrl: './dialog.html',
})
export class Dialog {
  actions = inject(ActionsPositionService);

  dialogToggled = output<void>();
}
