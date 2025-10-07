import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostHighLightSection } from './post-high-light-section';

describe('PostHighLightSection', () => {
  let component: PostHighLightSection;
  let fixture: ComponentFixture<PostHighLightSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostHighLightSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostHighLightSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
