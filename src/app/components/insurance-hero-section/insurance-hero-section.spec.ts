import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHeroSection } from './insurance-hero-section';

describe('InsuranceHeroSection', () => {
  let component: InsuranceHeroSection;
  let fixture: ComponentFixture<InsuranceHeroSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceHeroSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceHeroSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
