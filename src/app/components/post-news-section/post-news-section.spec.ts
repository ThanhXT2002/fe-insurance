import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostNewsSection } from './post-news-section';

describe('PostNewsSection', () => {
  let component: PostNewsSection;
  let fixture: ComponentFixture<PostNewsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostNewsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostNewsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
