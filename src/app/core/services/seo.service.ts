import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  // Additional social/SEO helpers
  noindex?: boolean;
  nofollow?: boolean;
  ogLocale?: string; // e.g. 'vi_VN'
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  twitterSite?: string; // e.g. '@xtbh'
  twitterCreator?: string; // e.g. '@author'
  fbAppId?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class SEOService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  // Default SEO config cho toàn site (chuẩn hóa đầy đủ trường)
  private readonly defaultConfig: SEOConfig = {
    title: environment.seoTitle,
    description: environment.seoDescription,
    keywords: environment.seoKeywords,
    image: environment.seoImage,
    url: environment.seoUrl,
    type: environment.seoType as 'website' | 'article' | 'product',
    siteName: environment.seoSiteName,
    author: environment.seoAuthor,
    publishedTime: environment.seoPublishedTime,
    modifiedTime: environment.seoModifiedTime,
  };

  /**
   * Set SEO meta tags cho mọi loại page (động/tĩnh)
   * Nếu không truyền hoặc thiếu trường, sẽ tự động dùng dữ liệu mặc định
   * Có thể truyền thêm preset cho từng loại trang nếu muốn
   */
  setSEO(
    config?: Partial<SEOConfig>,
    preset?: keyof ReturnType<SEOService['getPageSEO']>,
  ): void {
    let presetConfig: SEOConfig = {};
    if (preset) {
      const pageSEO = this.getPageSEO();
      if (typeof pageSEO[preset] === 'function') {
        presetConfig = pageSEO[preset]() || {};
      }
    }
    // Ưu tiên: defaultConfig < presetConfig < config
    const fullConfig: SEOConfig = {
      ...this.defaultConfig,
      ...presetConfig,
      ...config,
    };
    const currentUrl = `${this.document.location.origin}${this.router.url}`;

    // Set page title
    const pageTitle = fullConfig.title
      ? `${fullConfig.title} | ${fullConfig.siteName}`
      : fullConfig.siteName || '';
    this.title.setTitle(pageTitle);

    // Basic meta tags
    this.setBasicMeta(fullConfig);

    // Open Graph tags (Facebook, LinkedIn)
    this.setOpenGraphMeta(fullConfig, currentUrl);

    // Twitter Card tags
    this.setTwitterMeta(fullConfig, currentUrl);

    // Additional SEO tags
    this.setAdditionalMeta(fullConfig, currentUrl);

    // Robots handling (noindex/nofollow)
    if (fullConfig.noindex || fullConfig.nofollow) {
      const robotsParts: string[] = [];
      robotsParts.push(fullConfig.noindex ? 'noindex' : 'index');
      robotsParts.push(fullConfig.nofollow ? 'nofollow' : 'follow');
      this.setRobots(robotsParts.join(', '));
    }
  }

  /**
   * Chuyển dữ liệu động từ API (product-detail) sang SEOConfig
   */
  mapProductDetailToSEOConfig(product: any): SEOConfig {
    if (!product) return { ...this.defaultConfig };
    const seoMeta = product.seoMeta || {};
    return {
      title: seoMeta.seoTitle || product.name,
      description: seoMeta.metaDescription || product.description,
      keywords:
        seoMeta.focusKeyword ||
        (product.metaKeywords ? product.metaKeywords.join(', ') : undefined),
      image: product.imgs?.[0] || product.icon,
      url: seoMeta.canonicalUrl,
      type: seoMeta.ogType || 'product',
      siteName: this.defaultConfig.siteName,
      author: product.updatedBy || this.defaultConfig.author,
      publishedTime: product.createdAt,
      modifiedTime: product.updatedAt,
    };
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
    const existingScript = this.document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    this.document.head.appendChild(script);
  }

  /**
   * Set canonical URL
   */
  setCanonicalUrl(url?: string): void {
    const canonicalUrl =
      url || `${this.document.location.origin}${this.router.url}`;

    // Remove existing canonical
    const existingCanonical = this.document.querySelector(
      'link[rel="canonical"]',
    );
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
      'description',
      'keywords',
      'author',
      'og:title',
      'og:description',
      'og:image',
      'og:url',
      'og:type',
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image',
    ];

    tagsToRemove.forEach((tag) => {
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
      this.meta.updateTag({
        property: 'og:description',
        content: config.description,
      });
    }

    if (config.image) {
      const imageUrl = config.image.startsWith('http')
        ? config.image
        : `${this.document.location.origin}${config.image}`;
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      // Add additional image tags to improve compatibility with crawlers (Zalo, some messengers)
      this.meta.updateTag({ property: 'og:image:url', content: imageUrl });
      this.meta.updateTag({
        property: 'og:image:secure_url',
        content: imageUrl,
      });
      // Optional: content type if available (assume image/webp for modern assets)
      this.meta.updateTag({ property: 'og:image:type', content: 'image/webp' });

      // Also ensure a link rel="image_src" is present for older crawlers
      // Remove existing link[rel="image_src"] if any
      const existingImageSrc = this.document.querySelector(
        'link[rel="image_src"]',
      );
      if (existingImageSrc) {
        existingImageSrc.remove();
      }
      const imageLink = this.document.createElement('link');
      imageLink.setAttribute('rel', 'image_src');
      imageLink.setAttribute('href', imageUrl);
      this.document.head.appendChild(imageLink);
      // image alt and dimensions
      if (config.imageAlt) {
        this.meta.updateTag({
          property: 'og:image:alt',
          content: config.imageAlt,
        });
      }
      if (config.imageWidth) {
        this.meta.updateTag({
          property: 'og:image:width',
          content: String(config.imageWidth),
        });
      }
      if (config.imageHeight) {
        this.meta.updateTag({
          property: 'og:image:height',
          content: String(config.imageHeight),
        });
      }
    }

    this.meta.updateTag({
      property: 'og:url',
      content: config.url || currentUrl,
    });
    this.meta.updateTag({
      property: 'og:type',
      content: config.type || 'website',
    });

    // Locale
    if (config.ogLocale) {
      this.meta.updateTag({ property: 'og:locale', content: config.ogLocale });
    }

    // Facebook App ID (optional)
    if (config.fbAppId) {
      this.meta.updateTag({ property: 'fb:app_id', content: config.fbAppId });
    }

    if (config.siteName) {
      this.meta.updateTag({
        property: 'og:site_name',
        content: config.siteName,
      });
    }
  }

  private setTwitterMeta(config: SEOConfig, currentUrl: string): void {
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });

    if (config.title) {
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({
        name: 'twitter:description',
        content: config.description,
      });
    }

    if (config.image) {
      const imageUrl = config.image.startsWith('http')
        ? config.image
        : `${this.document.location.origin}${config.image}`;
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }

    // twitter site and creator
    if (config.twitterSite) {
      this.meta.updateTag({
        name: 'twitter:site',
        content: config.twitterSite,
      });
    }

    if (config.twitterCreator) {
      this.meta.updateTag({
        name: 'twitter:creator',
        content: config.twitterCreator,
      });
    }
  }

  private setAdditionalMeta(config: SEOConfig, currentUrl: string): void {
    // Viewport for mobile
    this.meta.updateTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    });

    // Published/Modified time for articles
    if (config.publishedTime) {
      this.meta.updateTag({
        property: 'article:published_time',
        content: config.publishedTime,
      });
    }

    if (config.modifiedTime) {
      this.meta.updateTag({
        property: 'article:modified_time',
        content: config.modifiedTime,
      });
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
        description:
          'SecureGuard Insurance cung cấp các giải pháp bảo hiểm toàn diện: sức khỏe, nhân thọ, tài sản, doanh nghiệp. Bảo vệ những điều quan trọng nhất với quy trình nhanh chóng, minh bạch.',
        keywords:
          'bảo hiểm, bảo hiểm sức khỏe, bảo hiểm nhân thọ, bảo hiểm tài sản, SecureGuard',
        type: 'website',
        image: this.defaultConfig.image,
        url: this.defaultConfig.url,
        siteName: this.defaultConfig.siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),

      about: (): SEOConfig => ({
        title: 'Giới thiệu về SecureGuard Insurance',
        description:
          'Tìm hiểu về SecureGuard Insurance - công ty bảo hiểm hàng đầu Việt Nam với hơn 10 năm kinh nghiệm, cam kết bảo vệ khách hàng với dịch vụ chuyên nghiệp.',
        keywords:
          'giới thiệu, về chúng tôi, SecureGuard Insurance, công ty bảo hiểm',
        type: 'website',
        image: this.defaultConfig.image,
        url: `${this.defaultConfig.url}/about`,
        siteName: this.defaultConfig.siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),

      products: (): SEOConfig => ({
        title: 'Sản phẩm bảo hiểm đa dạng',
        description:
          'Khám phá các sản phẩm bảo hiểm của SecureGuard: bảo hiểm sức khỏe, nhân thọ, ô tô, du lịch, doanh nghiệp. Lựa chọn phù hợp cho mọi nhu cầu bảo vệ.',
        keywords:
          'sản phẩm bảo hiểm, gói bảo hiểm, bảo hiểm sức khỏe, bảo hiểm ô tô',
        type: 'website',
        image: this.defaultConfig.image,
        url: `${this.defaultConfig.url}/products`,
        siteName: this.defaultConfig.siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),

      contact: (): SEOConfig => ({
        title: 'Liên hệ tư vấn bảo hiểm',
        description:
          'Liên hệ với đội ngũ chuyên gia SecureGuard Insurance để được tư vấn miễn phí. Hotline: 1800-BAO-HIEM. Hỗ trợ 24/7.',
        keywords: 'liên hệ, tư vấn bảo hiểm, hotline, hỗ trợ khách hàng',
        type: 'website',
        image: this.defaultConfig.image,
        url: `${this.defaultConfig.url}/contact`,
        siteName: this.defaultConfig.siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),

      blog: (title?: string, description?: string): SEOConfig => ({
        title: title || 'Tin tức & Kiến thức Bảo hiểm',
        description:
          description ||
          'Cập nhật tin tức mới nhất về bảo hiểm, kiến thức hữu ích, mẹo tiết kiệm và lựa chọn sản phẩm bảo hiểm phù hợp.',
        keywords: 'tin tức bảo hiểm, kiến thức bảo hiểm, blog, mẹo tiết kiệm',
        type: 'article',
        image: this.defaultConfig.image,
        url: `${this.defaultConfig.url}/blog`,
        siteName: this.defaultConfig.siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),
    };
  }
}
