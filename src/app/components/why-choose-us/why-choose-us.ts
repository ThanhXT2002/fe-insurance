import { Component, ElementRef, AfterViewInit, ViewChild, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SectionIntro } from "../section-intro/section-intro";
import { FeatureList } from "../feature-list/feature-list";
import { BtnCommon } from "../btn-common/btn-common";
import { Router } from '@angular/router';

@Component({
  selector: 'app-why-choose-us',
  imports: [SectionIntro, FeatureList, BtnCommon],
  templateUrl: './why-choose-us.html',
  styleUrl: './why-choose-us.scss'
})
export class WhyChooseUs implements AfterViewInit {
  @ViewChild('boxBackground') boxBackground!: ElementRef;
  @ViewChild('boxImg') boxImg!: ElementRef;

  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    // Only run in browser
    if (isPlatformBrowser(this.platformId)) {
      this.adjustBackgroundHeight();

      // Listen for window resize
      window.addEventListener('resize', () => {
        this.adjustBackgroundHeight();
      });
    }
  }

  private adjustBackgroundHeight() {
    if (this.boxBackground && this.boxImg) {
      const imgHeight = this.boxImg.nativeElement.offsetHeight;
      const newHeight = imgHeight + 100; // Thêm 100px
      this.boxBackground.nativeElement.style.height = `${newHeight}px`;
    }
  }

  redirectToContact(){
    this.router.navigate(['/contact']);
  }
}
