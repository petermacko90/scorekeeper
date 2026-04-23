import { Component, ElementRef, inject, input } from '@angular/core';
import { StateService } from '../state/state.service';
import { FormField } from '@angular/forms/signals';
import { UndoService } from '../state/undo.service';
import { ActionsPosition } from '../models/models';

@Component({
  selector: 'sk-notes',
  templateUrl: './notes.html',
  imports: [FormField],
})
export class Notes {
  state = inject(StateService);
  undoService = inject(UndoService);

  actionsPosition = input.required<ActionsPosition>();

  dialogRef: ElementRef<HTMLDialogElement> = inject(ElementRef);

  close() {
    this.dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.close();
  }
}
