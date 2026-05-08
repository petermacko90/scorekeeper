import { Component, ElementRef, inject } from '@angular/core';
import { StateService } from '../state/state.service';
import { FormField } from '@angular/forms/signals';
import { UndoService } from '../state/undo.service';
import { ActionsPositionService } from '../actions/actions-positions.service';

@Component({
  selector: 'sk-notes',
  templateUrl: './notes.html',
  imports: [FormField],
})
export class Notes {
  state = inject(StateService);
  undoService = inject(UndoService);
  actions = inject(ActionsPositionService);

  dialogRef: ElementRef<HTMLDialogElement> = inject(ElementRef);

  close() {
    this.dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.close();
  }
}
