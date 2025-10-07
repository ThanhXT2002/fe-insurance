import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostItemSkeleton } from './post-item-skeleton';

describe('PostItemSkeleton', () => {
  let component: PostItemSkeleton;
  let fixture: ComponentFixture<PostItemSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostItemSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostItemSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
