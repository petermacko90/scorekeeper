import { TestBed } from '@angular/core/testing';
import { EditModeService } from './edit-mode.service';

describe('EditModeService', () => {
  let editMode: EditModeService;

  beforeEach(() => {
    editMode = TestBed.inject(EditModeService);
  });

  it('should be false by default and toggle the value', () => {
    expect(editMode.isEditMode()).toBe(false);

    editMode.toggleEditMode();
    expect(editMode.isEditMode()).toBe(true);

    editMode.toggleEditMode();
    expect(editMode.isEditMode()).toBe(false);
  });
});
