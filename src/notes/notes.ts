import { Component, ElementRef, inject } from '@angular/core';
import { StateService } from '../state/state.service';
import { FormField } from '@angular/forms/signals';
import { Dialog } from '../dialog/dialog';
import { Button } from '../button/button';

@Component({
  selector: 'sk-notes',
  templateUrl: './notes.html',
  imports: [FormField, Dialog, Button],
})
export class Notes {
  state = inject(StateService);

  dialogRef: ElementRef<HTMLDialogElement> = inject(ElementRef);

  close() {
    this.dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')!.close();
  }
}
