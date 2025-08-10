import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckItem } from './check-item';

describe('CheckItem', () => {
  let component: CheckItem;
  let fixture: ComponentFixture<CheckItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
