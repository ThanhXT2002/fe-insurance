import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoginButton } from './social-login-button';

describe('SocialLoginButton', () => {
  let component: SocialLoginButton;
  let fixture: ComponentFixture<SocialLoginButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLoginButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialLoginButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
