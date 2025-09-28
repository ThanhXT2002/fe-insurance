import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCommon } from './input-common';

describe('InputCommon', () => {
  let component: InputCommon;
  let fixture: ComponentFixture<InputCommon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCommon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCommon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
