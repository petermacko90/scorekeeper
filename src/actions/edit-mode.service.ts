import { Service, signal } from '@angular/core';

@Service()
export class EditModeService {
  isEditMode = signal<boolean>(false);

  toggleEditMode() {
    this.isEditMode.update((isEditMode) => !isEditMode);
  }
}
