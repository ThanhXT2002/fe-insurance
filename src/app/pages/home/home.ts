import { Component } from '@angular/core';
import { BannerHome } from "../../components/banner-home/banner-home";
import { AboutSection } from "../../components/about-section/about-section";
import { ServiceSection } from "../../components/service-section/service-section";
import { WhyChooseUs } from "../../components/why-choose-us/why-choose-us";
import { HowItWorkSection } from "../../components/how-it-work-section/how-it-work-section";
import { OurFeatureSection } from "../../components/our-feature-section/our-feature-section";
import { InsuranceHeroSection } from "../../components/insurance-hero-section/insurance-hero-section";
import { PricingPlanSection } from "../../components/pricing-plan-section/pricing-plan-section";

@Component({
  selector: 'app-home',
  imports: [BannerHome, AboutSection, ServiceSection, WhyChooseUs, HowItWorkSection, OurFeatureSection, InsuranceHeroSection, PricingPlanSection],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
