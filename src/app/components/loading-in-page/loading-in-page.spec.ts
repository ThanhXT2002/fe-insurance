import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingInPage } from './loading-in-page';

describe('LoadingInPage', () => {
  let component: LoadingInPage;
  let fixture: ComponentFixture<LoadingInPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingInPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
