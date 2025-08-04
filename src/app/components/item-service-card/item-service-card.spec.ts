import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemServiceCard } from './item-service-card';

describe('ItemServiceCard', () => {
  let component: ItemServiceCard;
  let fixture: ComponentFixture<ItemServiceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemServiceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemServiceCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
