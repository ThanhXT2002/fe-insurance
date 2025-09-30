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
  // Additional fields from header-chuẩn-seo.html
  formatDetection?: string; // e.g. 'telephone=no'
  maxImagePreview?: 'none' | 'standard' | 'large' | string; // used in robots meta: max-image-preview:large
  fbPages?: string | string[];
  articleAuthorUrl?: string; // absolute URL of author facebook/profile
  articlePublisherUrl?: string; // absolute URL of publisher FB page
  resourceType?: string; // e.g. 'Document'
  distribution?: string; // e.g. 'Global'
  revisitAfter?: string; // e.g. '1 days'
  contentLanguage?: string; // e.g. 'vi'
  appleMobileWebAppCapable?: string; // e.g. 'yes'
  appleMobileWebAppTitle?: string;
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
    // Compute current URL in a safe way. During very early server initialization
    // Router may not have a resolved url yet; fall back to environment.seoUrl.
    let currentUrl = environment.seoUrl || '';
    try {
      if (this.document?.location?.origin && this.router?.url) {
        currentUrl = `${this.document.location.origin}${this.router.url}`;
      }
    } catch (e) {
      // ignore and use fallback
    }

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
    // Always set robots baseline and optionally include max-image-preview
    const robotsParts: string[] = [];
    robotsParts.push(fullConfig.noindex ? 'noindex' : 'index');
    robotsParts.push(fullConfig.nofollow ? 'nofollow' : 'follow');
    if (fullConfig.maxImagePreview) {
      robotsParts.push(`max-image-preview:${fullConfig.maxImagePreview}`);
    }
    this.setRobots(robotsParts.join(', '));
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
    this.createOrUpdateMeta('name', 'description', description);
  }

  /**
   * Ensure a meta tag exists in the DOM. This uses direct DOM manipulation as a
   * fallback for server-side rendering so meta tags are serialized into the
   * prerendered HTML even if Meta.updateTag doesn't create them in time.
   */
  private createOrUpdateMeta(
    attr: 'name' | 'property' | 'http-equiv',
    key: string,
    content?: string,
  ): void {
    if (!content) return;
    try {
      const selector =
        attr === 'http-equiv'
          ? `meta[http-equiv="${key}"]`
          : `meta[${attr}="${key}"]`;
      const existing = this.document.head.querySelector(
        selector,
      ) as HTMLMetaElement | null;
      if (existing) {
        existing.setAttribute('content', content);
        return;
      }
      const meta = this.document.createElement('meta');
      meta.setAttribute(attr, key);
      meta.setAttribute('content', content);
      this.document.head.appendChild(meta);
    } catch (e) {
      // ignore DOM issues in non-browser environments
    }
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
    // also ensure <link rel="canonical"> is present as link element already added
  }

  /**
   * Set robots meta tag
   */
  setRobots(robots: string = 'index, follow'): void {
    this.meta.updateTag({ name: 'robots', content: robots });
    this.createOrUpdateMeta('name', 'robots', robots);
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
      this.createOrUpdateMeta('name', 'description', config.description);
    }

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
      this.createOrUpdateMeta('name', 'keywords', config.keywords);
    }

    if (config.author) {
      this.meta.updateTag({ name: 'author', content: config.author });
      this.createOrUpdateMeta('name', 'author', config.author);
    }
    // mobile / apple tags
    if (config.appleMobileWebAppCapable) {
      this.meta.updateTag({
        name: 'apple-mobile-web-app-capable',
        content: config.appleMobileWebAppCapable,
      });
      this.createOrUpdateMeta(
        'name',
        'apple-mobile-web-app-capable',
        config.appleMobileWebAppCapable,
      );
    }
    if (config.appleMobileWebAppTitle) {
      this.meta.updateTag({
        name: 'apple-mobile-web-app-title',
        content: config.appleMobileWebAppTitle,
      });
      this.createOrUpdateMeta(
        'name',
        'apple-mobile-web-app-title',
        config.appleMobileWebAppTitle,
      );
    }
    // format-detection
    if (config.formatDetection) {
      this.meta.updateTag({
        name: 'format-detection',
        content: config.formatDetection,
      });
      this.createOrUpdateMeta(
        'name',
        'format-detection',
        config.formatDetection,
      );
    }
    // content language
    if (config.contentLanguage) {
      this.meta.updateTag({
        'http-equiv': 'content-language',
        content: config.contentLanguage,
      });
      this.createOrUpdateMeta(
        'http-equiv',
        'content-language',
        config.contentLanguage,
      );
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
      this.createOrUpdateMeta('property', 'og:image', imageUrl);
      // Add additional image tags to improve compatibility with crawlers (Zalo, some messengers)
      this.meta.updateTag({ property: 'og:image:url', content: imageUrl });
      this.createOrUpdateMeta('property', 'og:image:url', imageUrl);
      this.meta.updateTag({
        property: 'og:image:secure_url',
        content: imageUrl,
      });
      this.createOrUpdateMeta('property', 'og:image:secure_url', imageUrl);
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
        this.createOrUpdateMeta('property', 'og:image:alt', config.imageAlt);
      }
      if (config.imageWidth) {
        this.meta.updateTag({
          property: 'og:image:width',
          content: String(config.imageWidth),
        });
        this.createOrUpdateMeta(
          'property',
          'og:image:width',
          String(config.imageWidth),
        );
      }
      if (config.imageHeight) {
        this.meta.updateTag({
          property: 'og:image:height',
          content: String(config.imageHeight),
        });
        this.createOrUpdateMeta(
          'property',
          'og:image:height',
          String(config.imageHeight),
        );
      }
    }

    this.meta.updateTag({
      property: 'og:url',
      content: config.url || currentUrl,
    });
    this.createOrUpdateMeta('property', 'og:url', config.url || currentUrl);
    this.meta.updateTag({
      property: 'og:type',
      content: config.type || 'website',
    });
    this.createOrUpdateMeta('property', 'og:type', config.type || 'website');

    // Locale
    if (config.ogLocale) {
      this.meta.updateTag({ property: 'og:locale', content: config.ogLocale });
      this.createOrUpdateMeta('property', 'og:locale', config.ogLocale);
    }

    // Facebook App ID (optional)
    if (config.fbAppId) {
      this.meta.updateTag({ property: 'fb:app_id', content: config.fbAppId });
      this.createOrUpdateMeta('property', 'fb:app_id', config.fbAppId);
    }

    // Facebook pages
    if (config.fbPages) {
      const pages = Array.isArray(config.fbPages)
        ? config.fbPages
        : [config.fbPages];
      // set first fb:pages tag (most crawlers look for this)
      this.meta.updateTag({ property: 'fb:pages', content: pages[0] });
      this.createOrUpdateMeta('property', 'fb:pages', pages[0]);
    }

    if (config.siteName) {
      this.meta.updateTag({
        property: 'og:site_name',
        content: config.siteName,
      });
      this.createOrUpdateMeta('property', 'og:site_name', config.siteName);
    }
  }

  private setTwitterMeta(config: SEOConfig, currentUrl: string): void {
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.createOrUpdateMeta('name', 'twitter:card', 'summary_large_image');

    if (config.title) {
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
      this.createOrUpdateMeta('name', 'twitter:title', config.title);
    }

    if (config.description) {
      this.meta.updateTag({
        name: 'twitter:description',
        content: config.description,
      });
      this.createOrUpdateMeta(
        'name',
        'twitter:description',
        config.description,
      );
    }

    if (config.image) {
      const imageUrl = config.image.startsWith('http')
        ? config.image
        : `${this.document.location.origin}${config.image}`;
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
      this.createOrUpdateMeta('name', 'twitter:image', imageUrl);
    }

    // twitter site and creator
    if (config.twitterSite) {
      this.meta.updateTag({
        name: 'twitter:site',
        content: config.twitterSite,
      });
      this.createOrUpdateMeta('name', 'twitter:site', config.twitterSite);
    }

    if (config.twitterCreator) {
      this.meta.updateTag({
        name: 'twitter:creator',
        content: config.twitterCreator,
      });
      this.createOrUpdateMeta('name', 'twitter:creator', config.twitterCreator);
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

    // article author/publisher
    if (config.articleAuthorUrl) {
      this.meta.updateTag({
        property: 'article:author',
        content: config.articleAuthorUrl,
      });
    }
    if (config.articlePublisherUrl) {
      this.meta.updateTag({
        property: 'article:publisher',
        content: config.articlePublisherUrl,
      });
    }

    // Resource metadata and distribution
    if (config.resourceType) {
      this.meta.updateTag({
        name: 'resource-type',
        content: config.resourceType,
      });
    }
    if (config.distribution) {
      this.meta.updateTag({
        name: 'distribution',
        content: config.distribution,
      });
    }

    // revisit-after
    if (config.revisitAfter) {
      this.meta.updateTag({
        name: 'revisit-after',
        content: config.revisitAfter,
      });
    }

    // Set canonical URL
    this.setCanonicalUrl(config.url || currentUrl);
  }

  /**
   * Predefined SEO configs cho các page types
   */
  getPageSEO() {
    const siteName = this.defaultConfig.siteName || environment.seoSiteName;
    const baseDesc =
      this.defaultConfig.description || environment.seoDescription;
    const baseKeywords = this.defaultConfig.keywords || environment.seoKeywords;
    const baseImage = this.defaultConfig.image || environment.seoImage;
    const baseUrl = this.defaultConfig.url || environment.seoUrl;

    return {
      // For homepage we prefer the canonical site-level title/description from environment
      // so we return an empty preset and let defaultConfig carry the canonical values.
      homepage: (): SEOConfig => ({
        // no explicit title here — use defaultConfig.title (canonical site title)
        title: 'Trang chủ',
        description: baseDesc,
        keywords: baseKeywords,
        type: 'website',
        image: baseImage,
        url: baseUrl,
        siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),

      about: (): SEOConfig => ({
        title: 'Giới thiệu',
        description: `Giới thiệu về ${siteName}. ${baseDesc}`,
        keywords: baseKeywords ? `${baseKeywords}, giới thiệu` : 'giới thiệu',
        type: 'website',
        image: baseImage,
        url: `${baseUrl}/about`,
        siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),

      products: (): SEOConfig => ({
        title: 'Sản phẩm',
        description: `Danh mục sản phẩm bảo hiểm tại ${siteName}. ${baseDesc}`,
        keywords: baseKeywords
          ? `${baseKeywords}, sản phẩm, bảo hiểm`
          : 'sản phẩm, bảo hiểm',
        type: 'website',
        image: baseImage,
        url: `${baseUrl}/products`,
        siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),

      contact: (): SEOConfig => ({
        title: 'Liên hệ',
        description: `Liên hệ ${siteName} để được tư vấn và hỗ trợ về các giải pháp bảo hiểm. ${baseDesc}`,
        keywords: baseKeywords ? `${baseKeywords}, liên hệ` : 'liên hệ',
        type: 'website',
        image: baseImage,
        url: `${baseUrl}/contact`,
        siteName,
        ogLocale: environment.seoLocale || 'vi_VN',
      }),
    };
  }
}
