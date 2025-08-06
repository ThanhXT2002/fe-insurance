import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurSupportTeamSection } from './our-support-team-section';

describe('OurSupportTeamSection', () => {
  let component: OurSupportTeamSection;
  let fixture: ComponentFixture<OurSupportTeamSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurSupportTeamSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurSupportTeamSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
