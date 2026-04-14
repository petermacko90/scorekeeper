import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { StateService } from '../state/state.service';
import { RemoveButton } from '../remove-button/remove-button';
import { Button } from '../button/button';

@Component({
  selector: 'sk-scorekeeper',
  imports: [FormField, RemoveButton, Button],
  templateUrl: './scorekeeper.html',
  styleUrl: './scorekeeper.css',
})
export class Scorekeeper implements OnInit {
  state = inject(StateService);

  isEditMode = signal<boolean>(false);

  private lastPlayerRef: ElementRef<HTMLInputElement> = inject(ElementRef);
  private lastRoundRef: ElementRef<HTMLTableRowElement> = inject(ElementRef);

  constructor() {
    this.state.saveState();
  }

  ngOnInit(): void {
    this.state.loadState();
  }

  addPlayer() {
    this.state.addPlayer();

    setTimeout(() => {
      this.lastPlayerRef.nativeElement
        .querySelector<HTMLInputElement>('th:last-child>input')
        ?.focus();
    });
  }

  addRound() {
    this.state.addRound();

    setTimeout(() => {
      this.lastRoundRef.nativeElement.querySelector('tbody>tr:last-child')?.scrollIntoView();
    });
  }

  toggleEditMode() {
    this.isEditMode.update((value) => !value);
  }

  scoreChange(event: KeyboardEvent, index: number) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ArrowUp', 'ArrowDown'];
    if (index + 1 === this.state.roundsNumber() && allowedKeys.includes(event.key)) {
      this.addRound();
    }
  }
}
