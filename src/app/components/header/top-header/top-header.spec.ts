import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TopHeader } from './top-header';

describe('TopHeader', () => {
  let component: TopHeader;
  let fixture: ComponentFixture<TopHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopHeader],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {},
            snapshot: { params: {} }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
