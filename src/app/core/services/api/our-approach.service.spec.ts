import { TestBed } from '@angular/core/testing';

import { OurApproachService } from './our-approach.service';

describe('OurApproachService', () => {
  let service: OurApproachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OurApproachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
