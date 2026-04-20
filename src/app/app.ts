import { Component, signal } from '@angular/core';
import { Scoreboard } from '../scoreboard/scoreboard';
import { Actions } from '../actions/actions';

@Component({
  selector: 'app-root',
  imports: [Scoreboard, Actions],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isEditMode = signal<boolean>(false);
}
