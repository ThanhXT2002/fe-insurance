import { Component, inject, OnInit } from '@angular/core';
import { SEOService } from '../../core/services/seo.service';
import { BreadcrumbImg } from '../../components/breadcrumb-img/breadcrumb-img';
import { InsuranceHeroSection } from '../../components/insurance-hero-section/insurance-hero-section';
import { FaqsSection } from '../../components/faqs-section/faqs-section';
import { AllProductsSection } from '../../components/all-products-section/all-products-section';

@Component({
  selector: 'app-products',
  imports: [
    BreadcrumbImg,
    InsuranceHeroSection,
    FaqsSection,
    AllProductsSection,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private readonly seo = inject(SEOService);

  ngOnInit(): void {
    try {
      this.seo.setSEO(undefined, 'products');
    } catch (e) {
      // don't break page if SEO service unavailable
    }
  }
}
