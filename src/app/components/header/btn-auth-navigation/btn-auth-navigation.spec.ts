import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnAuthNavigation } from './btn-auth-navigation';

describe('BtnAuthNavigation', () => {
  let component: BtnAuthNavigation;
  let fixture: ComponentFixture<BtnAuthNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnAuthNavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnAuthNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
