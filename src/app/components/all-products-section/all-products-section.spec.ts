import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProductsSection } from './all-products-section';

describe('AllProductsSection', () => {
  let component: AllProductsSection;
  let fixture: ComponentFixture<AllProductsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProductsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProductsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
