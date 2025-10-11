import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet,   NavigationEnd,
  NavigationStart,
  Router,
 } from '@angular/router';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { TopHeader } from "../../components/header/top-header/top-header";
import { filter } from 'rxjs';
import { isPlatformBrowser, Location, PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header, Footer, TopHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

   private scrollPositions = new Map<string, number>();
  private lastUrl: string | null = null;
  private isPopState = false;

  private router = inject(Router);
  private location = inject(Location);
  private platformLocation = inject(PlatformLocation);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    // ✅ Bắt sự kiện Back/Forward
    this.platformLocation.onPopState(() => {
      this.isPopState = true;
    });

    // ✅ Khi chuẩn bị điều hướng
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe((event: any) => {
        if (this.lastUrl) {
          this.scrollPositions.set(this.lastUrl, window.scrollY);
        }
      });

    // ✅ Khi điều hướng xong
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        setTimeout(() => {
          if (this.isPopState && this.scrollPositions.has(url)) {
            window.scrollTo(0, this.scrollPositions.get(url) || 0);
          } else {
            window.scrollTo(0, 0);
          }

          this.isPopState = false;
          this.lastUrl = url;
        });
      });
  }

}
