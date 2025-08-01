import { TestBed } from '@angular/core/testing';

import { CustomTiltle } from './custom-tiltle';

describe('CustomTiltle', () => {
  let service: CustomTiltle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTiltle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
