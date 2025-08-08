import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPost } from './item-post';

describe('ItemPost', () => {
  let component: ItemPost;
  let fixture: ComponentFixture<ItemPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
