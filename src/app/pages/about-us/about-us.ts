import { Component } from '@angular/core';
import { AboutSection } from "../../components/about-section/about-section";
import { BreadcrumbImg } from "../../components/breadcrumb-img/breadcrumb-img";
import { WhyChooseUs } from "../../components/why-choose-us/why-choose-us";
import { OurFeatureSection } from "../../components/our-feature-section/our-feature-section";
import { InsuranceHeroSection } from "../../components/insurance-hero-section/insurance-hero-section";
import { TestimonialsSection } from "../../components/testimonials-section/testimonials-section";
import { OurApproachSection } from "../../components/our-approach-section/our-approach-section";
import { OurTeamSection } from '../../components/our-team-section/our-team-section';


@Component({
  selector: 'app-about-us',
  imports: [AboutSection, BreadcrumbImg, WhyChooseUs, OurFeatureSection, InsuranceHeroSection, TestimonialsSection, OurApproachSection, OurTeamSection],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss'
})
export class AboutUs {

  bgUrl = 'assets/images/banner/page-header-bg.jpg';

}
