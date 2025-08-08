import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbImg } from './breadcrumb-img';

describe('BreadcrumbImg', () => {
  let component: BreadcrumbImg;
  let fixture: ComponentFixture<BreadcrumbImg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbImg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbImg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
