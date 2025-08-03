import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToGetProtected } from './ready-to-get-protected';

describe('ReadyToGetProtected', () => {
  let component: ReadyToGetProtected;
  let fixture: ComponentFixture<ReadyToGetProtected>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyToGetProtected]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyToGetProtected);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
