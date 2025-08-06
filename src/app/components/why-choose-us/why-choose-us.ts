import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { SectionLabel } from "../section-label/section-label";
import { SectionIntro } from "../section-intro/section-intro";
import { FeatureList } from "../feature-list/feature-list";
import { BtnCommon } from "../btn-common/btn-common";

@Component({
  selector: 'app-why-choose-us',
  imports: [SectionIntro, FeatureList, BtnCommon],
  templateUrl: './why-choose-us.html',
  styleUrl: './why-choose-us.scss'
})
export class WhyChooseUs implements AfterViewInit {
  @ViewChild('boxBackground') boxBackground!: ElementRef;
  @ViewChild('boxImg') boxImg!: ElementRef;

  ngAfterViewInit() {
    this.adjustBackgroundHeight();

    // Listen for window resize
    window.addEventListener('resize', () => {
      this.adjustBackgroundHeight();
    });
  }

  private adjustBackgroundHeight() {
    if (this.boxBackground && this.boxImg) {
      const imgHeight = this.boxImg.nativeElement.offsetHeight;
      const newHeight = imgHeight + 100; // Thêm 100px
      this.boxBackground.nativeElement.style.height = `${newHeight}px`;
    }
  }
}
