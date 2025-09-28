import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { BtnCommon } from '../btn-common/btn-common';
import { TestimonialCard } from "../testimonial-card/testimonial-card";
import { SectionIntro } from "../section-intro/section-intro";
import { CheckItem } from "../check-item/check-item";
import { Router } from '@angular/router';


@Component({
  selector: 'app-about-section',
  imports: [NgOptimizedImage, BtnCommon, TestimonialCard, SectionIntro, CheckItem],
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutSection {

  private router = inject(Router);

  aboutFeatures: string[] = [
    'Tập trung vào khách hàng',
    'Giao tiếp minh bạch và rõ ràng',
    'Hỗ trợ 365/24x7 nhanh chóng',
    'Bảo hiểm toàn diện mọi nhu cầu'
  ];

  currentUrl = this.router.url;
  textButton:string = 'Tìm hiểu thêm';

  constructor() {

    if (this.currentUrl === '/') {
      this.textButton = 'Tìm hiểu thêm';
    } else if (this.currentUrl === '/about') {
      this.textButton = 'Liên hệ ngay';
    }
  }

  onClickButton() {
    if (this.currentUrl === '/') {
      this.router.navigate(['/about']);
    } else if (this.currentUrl === '/about') {
      // Redirect to contact
      this.router.navigate(['/contact']);
    }
  }
}
