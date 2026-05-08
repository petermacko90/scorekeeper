import { inject, Injectable, signal } from '@angular/core';
import { ActionsPosition } from '../models/models';
import { StorageService } from '../storage/storage.service';

@Injectable({ providedIn: 'root' })
export class ActionsPositionService {
  private storage = inject(StorageService);

  position = signal<ActionsPosition>('top');

  constructor() {
    const position = this.storage.loadActionsPosition();
    if (position !== null) {
      this.position.set(position);
    }
  }

  setPosition(position: ActionsPosition) {
    this.position.set(position);
    this.storage.saveActionsPosition(position);
  }
}
