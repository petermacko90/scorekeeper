import { TestBed } from '@angular/core/testing';
import { Notes } from './notes';

describe('Notes', () => {
  it('should render', async () => {
    const fixture = TestBed.createComponent(Notes);
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
