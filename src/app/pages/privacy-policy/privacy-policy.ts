import { Component, computed, inject } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TermLayoutComponent } from '../../components/term-layout/term-layout.component';
import { PrivacyPolicyService } from '../../core/services/api/privacy-policy.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SEOService } from '@/core/services/seo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-privacy-policy',
  imports: [TermLayoutComponent],
  template: `
    <app-term-layout
      [dataSource]="dataSource()"
      loadingText="Đang tải chính sách bảo mật..."
      downloadButtonText="Tải xuống chính sách"
      downloadFileName="privacy-policy.pdf"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {
  private privacyPolicyService = inject(PrivacyPolicyService);
  private readonly seo = inject(SEOService);

  readonly dataSource = computed(() =>
    this.privacyPolicyService.getPrivacyPolicyData(),
  );

  constructor() {
    // Set SEO with server-safe URL resolution
    this.privacyPolicyService
      .getPrivacyPolicyData()
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        if (!data) return;
        try {
          // Use production URL for SSR/prerendering, fallback to relative for client-side nav
          const isServer = typeof window === 'undefined';
          const baseUrl = isServer
            ? environment.seoUrl || 'https://xtbh.tranxuanthanhtxt.com'
            : '';
          const fullUrl = isServer
            ? `${baseUrl}/privacy-policy`
            : '/privacy-policy';

          this.seo.setSEO({
            title: data.title || 'Chính sách bảo mật',
            description:
              data.subtitle || data.sections?.[0]?.content?.[0] || '',
            keywords: 'chính sách bảo mật, quyền riêng tư, bảo hiểm',
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
