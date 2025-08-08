import { TestBed } from '@angular/core/testing';

import { BlogSerive } from './blog-serive';

describe('BlogSerive', () => {
  let service: BlogSerive;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogSerive);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
