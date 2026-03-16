import { Component } from '@angular/core';
import { Scorekeeper } from '../scorekeeper/scorekeeper';

@Component({
  selector: 'app-root',
  imports: [Scorekeeper],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
