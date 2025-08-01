import { Component, signal } from '@angular/core';
import { TopHeader } from "./top-header/top-header";

type MenuItem = {
  label: string;
  link: string;
};

@Component({
  selector: 'app-header',
  imports: [TopHeader],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly menuItems = signal<MenuItem[]>(
    [
      { label: 'Home', link: '/' },
      { label: 'About Us', link: '/about' },
      { label: 'Products', link: '/products' },
      { label: 'Blogs', link: '/blogs' },
      { label: 'Contact Us', link: '/contact' }
    ]
  );
}
