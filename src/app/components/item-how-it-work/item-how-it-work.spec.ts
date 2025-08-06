import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHowItWork } from './item-how-it-work';

describe('ItemHowItWork', () => {
  let component: ItemHowItWork;
  let fixture: ComponentFixture<ItemHowItWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemHowItWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemHowItWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
