import { Component } from '@angular/core';
import { BannerHome } from "../../components/banner-home/banner-home";
import { AboutSection } from "../../components/about-section/about-section";
import { ServiceSection } from "../../components/service-section/service-section";

@Component({
  selector: 'app-home',
  imports: [BannerHome, AboutSection, ServiceSection],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
