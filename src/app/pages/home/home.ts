import { Component, inject } from '@angular/core';
import { BannerHome } from '../../components/banner-home/banner-home';
import { AboutSection } from '../../components/about-section/about-section';
import { ServiceSection } from '../../components/service-section/service-section';
import { WhyChooseUs } from '../../components/why-choose-us/why-choose-us';
import { HowItWorkSection } from '../../components/how-it-work-section/how-it-work-section';
import { OurFeatureSection } from '../../components/our-feature-section/our-feature-section';
import { InsuranceHeroSection } from '../../components/insurance-hero-section/insurance-hero-section';
import { PricingPlanSection } from '../../components/pricing-plan-section/pricing-plan-section';
import { OurSupportTeamSection } from '../../components/our-support-team-section/our-support-team-section';
import { FaqsSection } from '../../components/faqs-section/faqs-section';
import { TestimonialsSection } from '../../components/testimonials-section/testimonials-section';
import { PostNewsSection } from '../../components/post-news-section/post-news-section';
import { SEOService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  imports: [
    BannerHome,
    AboutSection,
    ServiceSection,
    WhyChooseUs,
    HowItWorkSection,
    OurFeatureSection,
    InsuranceHeroSection,
    PricingPlanSection,
    OurSupportTeamSection,
    FaqsSection,
    TestimonialsSection,
    PostNewsSection,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly seo = inject(SEOService);

  constructor() {
    // Use default SEO from environment (no preset) so site-wide defaults apply
    this.seo.setSEO();
  }
}
