import { Component, computed, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TermLayoutComponent } from '../../components/term-layout/term-layout.component';
import { IndemnifyService } from '../../core/services/api/indemnify.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SEOService } from '@/core/services/seo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-indemnify',
  imports: [TermLayoutComponent],
  template: `
    <app-term-layout
      [dataSource]="dataSource()"
      loadingText="Đang tải quy trình bồi thường..."
      downloadButtonText="Tải xuống hướng dẫn"
      downloadFileName="indemnify-guide.pdf"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndemnifyComponent {
  private indemnifyService = inject(IndemnifyService);
  private readonly seo = inject(SEOService);

  readonly dataSource = computed(() =>
    this.indemnifyService.getIndemnifyData(),
  );
  constructor() {
    // Set SEO with server-safe URL resolution
    this.indemnifyService
      .getIndemnifyData()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        if (!data) return;
        try {
          // Use production URL for SSR/prerendering, fallback to relative for client-side nav
          const isServer = typeof window === 'undefined';
          const baseUrl = isServer
            ? environment.seoUrl || 'https://xtbh.tranxuanthanhtxt.com'
            : '';
          const fullUrl = isServer ? `${baseUrl}/indemnify` : '/indemnify';

          this.seo.setSEO({
            title: data.title || 'Quy trình bồi thường',
            description:
              data.subtitle || data.sections?.[0]?.content?.[0] || '',
            keywords: 'bồi thường, hướng dẫn, bảo hiểm',
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
