import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsSection } from './faqs-section';

describe('FaqsSection', () => {
  let component: FaqsSection;
  let fixture: ComponentFixture<FaqsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
