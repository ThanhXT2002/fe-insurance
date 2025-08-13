import { Component, effect, inject, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Logo } from '../logo/logo';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterService } from '../../core/services/api/footer';
import { FooterData } from '../../core/interfaces/footer.interface';
import { AppMenuItem } from '../../core/interfaces/menu.interface';

@Component({
  selector: 'app-footer',
  imports: [Logo, RouterLink, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer  {
  private readonly footerService = inject(FooterService);
  readonly footerData = signal<FooterData | null>(null);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      this.footerService.getFooterData().subscribe((data: FooterData) => {
        this.footerData.set(data);
      });
    });
  }

  // Helper method để mở link external
  openExternalLink(item: AppMenuItem) {
    if (item.isBlank && isPlatformBrowser(this.platformId)) {
      window.open(item.link, '_blank');
    }
  }
}
