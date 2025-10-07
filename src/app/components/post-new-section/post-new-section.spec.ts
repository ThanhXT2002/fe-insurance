import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostNewSection } from './post-new-section';

describe('PostNewSection', () => {
  let component: PostNewSection;
  let fixture: ComponentFixture<PostNewSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostNewSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostNewSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
