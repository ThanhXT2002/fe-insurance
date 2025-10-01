import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressLoading } from './progress-loading';

describe('ProgressLoading', () => {
  let component: ProgressLoading;
  let fixture: ComponentFixture<ProgressLoading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressLoading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
