import { Component, input } from '@angular/core';

@Component({
  selector: 'sk-dialog',
  templateUrl: './dialog.html',
})
export class Dialog {
  heading = input.required<string>();
}
