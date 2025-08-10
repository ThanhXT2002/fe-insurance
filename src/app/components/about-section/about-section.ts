import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { BtnCommon } from '../btn-common/btn-common';
import { TestimonialCard } from "../testimonial-card/testimonial-card";
import { SectionIntro } from "../section-intro/section-intro";
import { CheckItem } from "../check-item/check-item";

@Component({
  selector: 'app-about-section',
  imports: [NgOptimizedImage, BtnCommon, TestimonialCard, SectionIntro, CheckItem],
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutSection {

  aboutFeatures: string[] = [
    'Tập trung vào khách hàng',
    'Giao tiếp minh bạch và rõ ràng',
    'Hỗ trợ 365/24x7 nhanh chóng',
    'Bảo hiểm toàn diện mọi nhu cầu'
  ];

}
