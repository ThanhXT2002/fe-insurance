import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrder } from './confirm-order';

describe('ConfirmOrder', () => {
  let component: ConfirmOrder;
  let fixture: ComponentFixture<ConfirmOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
