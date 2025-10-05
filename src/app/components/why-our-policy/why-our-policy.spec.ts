import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyOurPolicy } from './why-our-policy';

describe('WhyOurPolicy', () => {
  let component: WhyOurPolicy;
  let fixture: ComponentFixture<WhyOurPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyOurPolicy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyOurPolicy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
