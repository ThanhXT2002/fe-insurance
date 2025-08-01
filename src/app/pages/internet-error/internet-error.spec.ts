import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetError } from './internet-error';

describe('InternetError', () => {
  let component: InternetError;
  let fixture: ComponentFixture<InternetError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternetError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternetError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
