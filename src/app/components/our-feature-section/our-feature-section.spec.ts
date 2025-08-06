import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurFeatureSection } from './our-feature-section';

describe('OurFeatureSection', () => {
  let component: OurFeatureSection;
  let fixture: ComponentFixture<OurFeatureSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurFeatureSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurFeatureSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
