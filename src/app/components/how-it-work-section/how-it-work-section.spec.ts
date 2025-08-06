import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorkSection } from './how-it-work-section';

describe('HowItWorkSection', () => {
  let component: HowItWorkSection;
  let fixture: ComponentFixture<HowItWorkSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowItWorkSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowItWorkSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
