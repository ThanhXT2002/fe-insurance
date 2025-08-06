import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingPlanSection } from './pricing-plan-section';

describe('PricingPlanSection', () => {
  let component: PricingPlanSection;
  let fixture: ComponentFixture<PricingPlanSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPlanSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingPlanSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
