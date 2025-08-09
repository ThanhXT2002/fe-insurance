import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  // Default SEO config cho toàn site
  private readonly defaultConfig: SEOConfig = {
    siteName: 'SecureGuard Insurance',
    type: 'website',
    image: '/assets/images/og-default.jpg',
    author: 'SecureGuard Team'
  };

  /**
   * Set complete SEO meta tags cho page
   */
  setSEO(config: SEOConfig): void {
    const fullConfig = { ...this.defaultConfig, ...config };
    const currentUrl = `${this.document.location.origin}${this.router.url}`;

    // Set page title
    if (fullConfig.title) {
      const pageTitle = `${fullConfig.title} | ${fullConfig.siteName}`;
      this.title.setTitle(pageTitle);
    }

    // Basic meta tags
    this.setBasicMeta(fullConfig);

    // Open Graph tags (Facebook, LinkedIn)
    this.setOpenGraphMeta(fullConfig, currentUrl);

    // Twitter Card tags
    this.setTwitterMeta(fullConfig, currentUrl);

    // Additional SEO tags
    this.setAdditionalMeta(fullConfig, currentUrl);
  }

  /**
   * Set page title only
   */
  setTitle(title: string): void {
    const pageTitle = `${title} | ${this.defaultConfig.siteName}`;
    this.title.setTitle(pageTitle);
  }

  /**
   * Set meta description only
   */
  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  /**
   * Add structured data (JSON-LD) cho Google
   */
  addStructuredData(data: StructuredData): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);

    // Remove existing structured data
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    this.document.head.appendChild(script);
  }

  /**
   * Set canonical URL
   */
  setCanonicalUrl(url?: string): void {
    const canonicalUrl = url || `${this.document.location.origin}${this.router.url}`;

    // Remove existing canonical
    const existingCanonical = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    this.document.head.appendChild(link);
  }

  /**
   * Set robots meta tag
   */
  setRobots(robots: string = 'index, follow'): void {
    this.meta.updateTag({ name: 'robots', content: robots });
  }

  /**
   * Remove all SEO meta tags (useful cho dynamic pages)
   */
  clearSEO(): void {
    const tagsToRemove = [
      'description', 'keywords', 'author',
      'og:title', 'og:description', 'og:image', 'og:url', 'og:type',
      'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'
    ];

    tagsToRemove.forEach(tag => {
      this.meta.removeTag(`name="${tag}"`);
      this.meta.removeTag(`property="${tag}"`);
    });
  }

  // Private helper methods
  private setBasicMeta(config: SEOConfig): void {
    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
    }

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    if (config.author) {
      this.meta.updateTag({ name: 'author', content: config.author });
    }
  }

  private setOpenGraphMeta(config: SEOConfig, currentUrl: string): void {
    if (config.title) {
      this.meta.updateTag({ property: 'og:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({ property: 'og:description', content: config.description });
    }

    if (config.image) {
      const imageUrl = config.image.startsWith('http')
        ? config.image
        : `${this.document.location.origin}${config.image}`;
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
    }

    this.meta.updateTag({ property: 'og:url', content: config.url || currentUrl });
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });

    if (config.siteName) {
      this.meta.updateTag({ property: 'og:site_name', content: config.siteName });
    }
  }

  private setTwitterMeta(config: SEOConfig, currentUrl: string): void {
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    if (config.title) {
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    if (config.image) {
      const imageUrl = config.image.startsWith('http')
        ? config.image
        : `${this.document.location.origin}${config.image}`;
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }
  }

  private setAdditionalMeta(config: SEOConfig, currentUrl: string): void {
    // Viewport for mobile
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });

    // Published/Modified time for articles
    if (config.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: config.publishedTime });
    }

    if (config.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: config.modifiedTime });
    }

    // Set canonical URL
    this.setCanonicalUrl(config.url || currentUrl);
  }

  /**
   * Predefined SEO configs cho các page types
   */
  getPageSEO() {
    return {
      homepage: (): SEOConfig => ({
        title: 'Bảo hiểm toàn diện cho cuộc sống an toàn',
        description: 'SecureGuard Insurance cung cấp các giải pháp bảo hiểm toàn diện: sức khỏe, nhân thọ, tài sản, doanh nghiệp. Bảo vệ những điều quan trọng nhất với quy trình nhanh chóng, minh bạch.',
        keywords: 'bảo hiểm, bảo hiểm sức khỏe, bảo hiểm nhân thọ, bảo hiểm tài sản, SecureGuard',
        type: 'website'
      }),

      about: (): SEOConfig => ({
        title: 'Giới thiệu về SecureGuard Insurance',
        description: 'Tìm hiểu về SecureGuard Insurance - công ty bảo hiểm hàng đầu Việt Nam với hơn 10 năm kinh nghiệm, cam kết bảo vệ khách hàng với dịch vụ chuyên nghiệp.',
        keywords: 'giới thiệu, về chúng tôi, SecureGuard Insurance, công ty bảo hiểm',
        type: 'website'
      }),

      products: (): SEOConfig => ({
        title: 'Sản phẩm bảo hiểm đa dạng',
        description: 'Khám phá các sản phẩm bảo hiểm của SecureGuard: bảo hiểm sức khỏe, nhân thọ, ô tô, du lịch, doanh nghiệp. Lựa chọn phù hợp cho mọi nhu cầu bảo vệ.',
        keywords: 'sản phẩm bảo hiểm, gói bảo hiểm, bảo hiểm sức khỏe, bảo hiểm ô tô',
        type: 'website'
      }),

      contact: (): SEOConfig => ({
        title: 'Liên hệ tư vấn bảo hiểm',
        description: 'Liên hệ với đội ngũ chuyên gia SecureGuard Insurance để được tư vấn miễn phí. Hotline: 1800-BAO-HIEM. Hỗ trợ 24/7.',
        keywords: 'liên hệ, tư vấn bảo hiểm, hotline, hỗ trợ khách hàng',
        type: 'website'
      }),

      blog: (title?: string, description?: string): SEOConfig => ({
        title: title || 'Tin tức & Kiến thức Bảo hiểm',
        description: description || 'Cập nhật tin tức mới nhất về bảo hiểm, kiến thức hữu ích, mẹo tiết kiệm và lựa chọn sản phẩm bảo hiểm phù hợp.',
        keywords: 'tin tức bảo hiểm, kiến thức bảo hiểm, blog, mẹo tiết kiệm',
        type: 'article'
      })
    };
  }

  /**
   * Structured data generators
   */
  getStructuredData() {
    return {
      organization: (): StructuredData => ({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'SecureGuard Insurance',
        'url': this.document.location.origin,
        'logo': `${this.document.location.origin}/assets/images/logo.png`,
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '+84-1800-BAO-HIEM',
          'contactType': 'customer service'
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '123 Đường Bảo Hiểm',
          'addressLocality': 'Hà Nội',
          'addressCountry': 'VN'
        }
      }),

      website: (): StructuredData => ({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'SecureGuard Insurance',
        'url': this.document.location.origin,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${this.document.location.origin}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }),

      breadcrumb: (items: Array<{name: string, url: string}>): StructuredData => ({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': item.name,
          'item': `${this.document.location.origin}${item.url}`
        }))
      }),

      article: (title: string, description: string, publishedTime: string, author: string = 'SecureGuard Team'): StructuredData => ({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': title,
        'description': description,
        'author': {
          '@type': 'Person',
          'name': author
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'SecureGuard Insurance',
          'logo': {
            '@type': 'ImageObject',
            'url': `${this.document.location.origin}/assets/images/logo.png`
          }
        },
        'datePublished': publishedTime,
        'dateModified': publishedTime
      })
    };
  }
}
