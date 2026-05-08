import { Component, ElementRef, inject, signal } from '@angular/core';
import { Dialog } from '../dialog/dialog';
import { ActionsPositionService } from '../actions/actions-positions.service';
import { ActionsPosition } from '../models/models';
import { Button } from '../button/button';

@Component({
  selector: 'sk-settings',
  templateUrl: './settings.html',
  imports: [Dialog, Button],
})
export class Settings {
  actions = inject(ActionsPositionService);

  dialogRef: ElementRef<HTMLDialogElement> = inject(ElementRef);

  newPosition = signal<ActionsPosition>(this.actions.position());

  changeActionsPosition($event: Event) {
    const value = ($event.target as HTMLSelectElement).value as ActionsPosition;
    this.newPosition.set(value);
  }

  loadPositions() {
    this.newPosition.set(this.actions.position());
  }

  save() {
    this.actions.setPosition(this.newPosition());
    this.dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.close();
  }

  close() {
    this.dialogRef.nativeElement.querySelector<HTMLDialogElement>('dialog')?.close();
  }
}
