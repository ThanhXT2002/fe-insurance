import { Component } from '@angular/core';
import { BannerHome } from "../../components/banner-home/banner-home";
import { AboutSection } from "../../components/about-section/about-section";
import { ServiceSection } from "../../components/service-section/service-section";
import { WhyChooseUs } from "../../components/why-choose-us/why-choose-us";
import { HowItWorkSection } from "../../components/how-it-work-section/how-it-work-section";

@Component({
  selector: 'app-home',
  imports: [BannerHome, AboutSection, ServiceSection, WhyChooseUs, HowItWorkSection],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
