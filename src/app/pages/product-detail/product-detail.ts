import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SEOService } from '../../core/services/seo.service';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SEOService);

  ngOnInit(): void {
    // Subscribe to route data to get resolver data (important for SSR)
    this.route.data.subscribe((data) => {
      try {
        const product = data['product'] || null;

        if (product) {
          const cfg = this.seo.mapProductDetailToSEOConfig(product);
          this.seo.setSEO(cfg);
        }
      } catch (e) {
        console.error('[ProductDetail] Error setting SEO:', e);
        // ignore — don't break the page
      }
    });
  }
}
