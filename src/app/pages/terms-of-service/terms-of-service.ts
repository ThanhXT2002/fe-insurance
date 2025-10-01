import { Component, computed, inject } from '@angular/core';
import { TermLayoutComponent } from '../../components/term-layout/term-layout.component';
import { TermOfServiceService } from '../../core/services/api/terms-of-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SEOService } from '@/core/services/seo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-terms-of-service',
  imports: [TermLayoutComponent],
  template: `
    <app-term-layout
      [dataSource]="dataSource()"
      loadingText="Đang tải điều khoản sử dụng..."
      downloadButtonText="Tải PDF"
      downloadFileName="privacy-policy.pdf"
    />
  `,
})
export class TermsOfService {
  private readonly termOfServiceService = inject(TermOfServiceService);
  private readonly seo = inject(SEOService);

  readonly dataSource = computed(() => this.termOfServiceService.getTermOfServiceData());

  constructor() {
    // Set SEO with server-safe URL resolution
    this.termOfServiceService
      .getTermOfServiceData()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        if (!data) return;
        try {
          // Use production URL for SSR/prerendering, fallback to relative for client-side nav
          const isServer = typeof window === 'undefined';
          const baseUrl = isServer
            ? environment.seoUrl || 'https://xtbh.tranxuanthanhtxt.com'
            : '';
          const fullUrl = isServer ? `${baseUrl}/terms-of-service` : '/terms-of-service';

          this.seo.setSEO({
            title: data.title || 'Điều khoản sử dụng',
            description:
              data.subtitle || data.sections?.[0]?.content?.[0] || '',
            keywords: 'điều khoản sử dụng, quy định, bảo hiểm',
            image: data.imgBanner
              ? isServer && !data.imgBanner.startsWith('http')
                ? `${baseUrl}/${data.imgBanner.replace(/^\/+/, '')}`
                : data.imgBanner
              : undefined,
            url: fullUrl,
            type: 'article',
          });

          // Add structured data
          this.seo.addStructuredData({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.title,
            description: data.subtitle,
            image: data.imgBanner
              ? [
                  isServer && !data.imgBanner.startsWith('http')
                    ? `${baseUrl}/${data.imgBanner.replace(/^\/+/, '')}`
                    : data.imgBanner,
                ]
              : undefined,
            url: fullUrl,
            datePublished: new Date().toISOString(),
            author: {
              '@type': 'Organization',
              name: environment.seoSiteName || 'XTBH',
            },
          });
        } catch (e) {
          // swallow any SEO errors so page rendering isn't blocked
        }
      });
  }
}
