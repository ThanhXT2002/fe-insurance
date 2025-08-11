import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurTeamSection } from './our-team-section';

describe('OurTeamSection', () => {
  let component: OurTeamSection;
  let fixture: ComponentFixture<OurTeamSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurTeamSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurTeamSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
