import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { BtnCommon } from '../btn-common/btn-common';
import { TestimonialCard } from "../testimonial-card/testimonial-card";
import { SectionIntro } from "../section-intro/section-intro";

@Component({
  selector: 'app-about-section',
  imports: [NgOptimizedImage, BtnCommon, TestimonialCard, SectionIntro],
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutSection {

}
