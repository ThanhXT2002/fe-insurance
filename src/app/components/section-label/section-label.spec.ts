import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionLabel } from './section-label';

describe('SectionLabel', () => {
  let component: SectionLabel;
  let fixture: ComponentFixture<SectionLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
