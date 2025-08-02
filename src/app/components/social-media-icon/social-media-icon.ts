import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-media-icon',
  imports: [CommonModule],
  templateUrl: './social-media-icon.html',
  styleUrl: './social-media-icon.scss'
})
export class SocialMediaIcon {

  @Input() icons: Array<{ icon: string; link?: string; text?: string }> = [
    { icon: 'ri-facebook-fill', link: '#', text: '' },
    { icon: 'ri-instagram-line', link: '#', text: '' },
    { icon: 'ri-messenger-line', link: '#', text: '' },
    { icon: 'ri-twitter-x-line', link: '#', text: '' },
  ];
  @Input() spaceClass = 'space-x-4';
  @Input() colorClass = 'text-secondary';
  @Input() iconSize = 'text-2xl';

}

