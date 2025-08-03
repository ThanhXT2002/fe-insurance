import { Component } from '@angular/core';
import { BannerHome } from "../../components/banner-home/banner-home";
import { AboutSection } from "../../components/about-section/about-section";

@Component({
  selector: 'app-home',
  imports: [BannerHome, AboutSection],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
