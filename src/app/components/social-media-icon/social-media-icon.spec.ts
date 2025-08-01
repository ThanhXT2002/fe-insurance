import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaIcon } from './social-media-icon';

describe('SocialMediaIcon', () => {
  let component: SocialMediaIcon;
  let fixture: ComponentFixture<SocialMediaIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
