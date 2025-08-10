import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurApproachSection } from './our-approach-section';

describe('OurApproachSection', () => {
  let component: OurApproachSection;
  let fixture: ComponentFixture<OurApproachSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurApproachSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurApproachSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
