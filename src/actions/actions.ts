import { Component, inject, model } from '@angular/core';
import { Button } from '../button/button';
import { StateService } from '../state/state.service';

@Component({
  selector: 'sk-actions',
  imports: [Button],
  templateUrl: './actions.html',
  styleUrl: './actions.css',
})
export class Actions {
  state = inject(StateService);

  isEditMode = model.required<boolean>();

  toggleEditMode() {
    this.isEditMode.update((value) => !value);
  }
}
