import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnCommon } from './btn-common';

describe('BtnCommon', () => {
  let component: BtnCommon;
  let fixture: ComponentFixture<BtnCommon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnCommon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnCommon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
