import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { BtnCommon } from '../btn-common/btn-common';
import { TestimonialCard } from "../testimonial-card/testimonial-card";
import { SectionLabel } from "../section-label/section-label";

@Component({
  selector: 'app-about-section',
  imports: [NgOptimizedImage, BtnCommon, TestimonialCard, SectionLabel],
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutSection {

}
