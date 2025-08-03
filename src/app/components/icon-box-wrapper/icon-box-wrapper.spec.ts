import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconBoxWrapper } from './icon-box-wrapper';

describe('IconBoxWrapper', () => {
  let component: IconBoxWrapper;
  let fixture: ComponentFixture<IconBoxWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconBoxWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconBoxWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
