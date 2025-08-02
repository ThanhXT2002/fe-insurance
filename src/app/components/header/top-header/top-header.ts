import { Component } from '@angular/core';
import { SocialMediaIcon } from "../../social-media-icon/social-media-icon";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-header',
  imports: [SocialMediaIcon, RouterLink],
  templateUrl: './top-header.html',
  styleUrl: './top-header.scss'
})
export class TopHeader {

}
