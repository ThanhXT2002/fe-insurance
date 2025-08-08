import { Component } from '@angular/core';
import { AboutSection } from "../../components/about-section/about-section";
import { BreadcrumbImg } from "../../components/breadcrumb-img/breadcrumb-img";

@Component({
  selector: 'app-about-us',
  imports: [AboutSection, BreadcrumbImg],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss'
})
export class AboutUs {

  bgUrl = 'assets/images/banner/page-header-bg.jpg';

}
