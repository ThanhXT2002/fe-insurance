import { Component } from '@angular/core';
import { BannerHome } from "../../components/banner-home/banner-home";

@Component({
  selector: 'app-home',
  imports: [BannerHome],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
