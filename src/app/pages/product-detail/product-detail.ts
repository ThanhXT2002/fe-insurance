import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  effect,
  signal,
  model,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SEOService } from '../../core/services/seo.service';
import { ProductDetailStore } from '../../core/store/products/product-detail.store';
import { environment } from '../../../environments/environment';
import { LoadingService } from '@/core/services/loading.service';
import { ProductItem } from '@/core/interfaces/product.interface';
import { BreadcrumbImg } from '@/components/breadcrumb-img/breadcrumb-img';
import { isPlatformServer } from '@angular/common';
import { MenuProduct } from '@/components/menu-product/menu-product';
import { BtnCommon } from '@/components/btn-common/btn-common';
import { InfoExtraPhone } from '@/components/info-extra-phone/info-extra-phone';
import { GalleriaModule } from 'primeng/galleria';
import { WhyOurPolicy } from '@/components/why-our-policy/why-our-policy';
import { FAQSItems } from '@/components/faqs-items/faqs-items';
import { SectionIntro } from '@/components/section-intro/section-intro';
import { CheckItem } from '@/components/check-item/check-item';
import { LoadingInPage } from '@/components/loading-in-page/loading-in-page';

@Component({
  selector: 'app-product-detail',
  imports: [
    BreadcrumbImg,
    MenuProduct,
    BtnCommon,
    InfoExtraPhone,
    GalleriaModule,
    WhyOurPolicy,
    FAQSItems,
    SectionIntro,
    LoadingInPage,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SEOService);
  private readonly store = inject(ProductDetailStore);
  loadingService = inject(LoadingService);
  private platformId = inject(PLATFORM_ID);
  private isServer = isPlatformServer(this.platformId);
  private router = inject(Router);

  imgThumbnail = model<{ itemImageSrc: string; thumbnailImageSrc: string }[]>(
    [],
  );

  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  // Chuyển data thành signal để tránh ExpressionChangedAfterItHasBeenCheckedError
  data = signal<ProductItem | null>(null);
  private slugSignal = signal('');
  private routeSubscription?: Subscription;

  constructor() {
    effect(() => {
      const slug = this.slugSignal();
      if (!slug) return;

      const product = this.store.getSignal(slug)();
      if (product) {
        this.data.set(product);
        // Set galleria items from product imgs
        this.imgThumbnail.set(this.toGalleriaItems(product.imgs));
        this.setupSEOFromProduct(product);
      }
    });
  }

  private toGalleriaItems(
    imgs?: string[] | string | null,
  ): { itemImageSrc: string; thumbnailImageSrc: string }[] {
    if (!imgs) return [];

    let arr: string[] = [];
    if (Array.isArray(imgs)) {
      arr = imgs.filter(Boolean) as string[];
    } else if (typeof imgs === 'string') {
      arr = imgs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return arr.map((url) => ({ itemImageSrc: url, thumbnailImageSrc: url }));
  }

  ngOnInit(): void {
    const initialSlug = this.route.snapshot.paramMap.get('slug') || '';
    if (initialSlug) {
      this.handleSlugChange(initialSlug);
    }
    let isFirstEmit = true;
    this.routeSubscription = this.route.params.subscribe((params) => {
      const newSlug = params['slug'] || '';
      const currentSlug = this.slugSignal();

      if (isFirstEmit) {
        isFirstEmit = false;
        return;
      }

      if (newSlug && newSlug !== currentSlug) {
        this.handleSlugChange(newSlug);
      }
    });
  }

  private handleSlugChange(slug: string): void {
    this.slugSignal.set(slug);

    const cachedProduct = this.store.getSignal(slug)();
    if (cachedProduct) {
      this.data.set(cachedProduct);
      this.imgThumbnail.set(this.toGalleriaItems(cachedProduct.imgs));
      this.setupSEOFromProduct(cachedProduct);
      this.loadingService.hide();
      return;
    }
    this.data.set(null);
    this.loadingService.show();
    this.loadProductAndSetSEO();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private setupSEOFromProduct(product: any): void {
    const cfg = this.seo.mapProductDetailToSEOConfig(product);
    this.seo.setSEO(cfg);
  }

  private loadProductAndSetSEO(): void {
    const slug = this.slugSignal();
    if (!slug) {
      this.loadingService.hide();
      return;
    }

    const baseUrl = this.isServer ? environment.seoUrl : '';
    this.store
      .load(slug)
      .then((product) => {
        if (product) {
          this.data.set(product);
          this.imgThumbnail.set(this.toGalleriaItems(product.imgs));
          const cfg = this.seo.mapProductDetailToSEOConfig(product);
          if (cfg.url && this.isServer) {
            cfg.url = baseUrl + cfg.url;
          }
          this.seo.setSEO(cfg);
        } else {
          this.setDefaultSEO(slug, baseUrl, this.isServer);
        }
      })
      .catch(() => {
        this.setDefaultSEO(slug, baseUrl, this.isServer);
      })
      .finally(() => {
        this.loadingService.hide();
      });
  }

  onClickBuyNow(url: string) {
    this.router.navigate([url]);
  }

  private setDefaultSEO(
    slug: string,
    baseUrl: string,
    isServer: boolean,
  ): void {
    this.seo.setSEO({
      title: `Sản phẩm ${slug} - XTBH`,
      description: 'Thông tin chi tiết sản phẩm bảo hiểm tại XTBH',
      url: isServer ? `${baseUrl}/product/${slug}` : `/product/${slug}`,
      type: 'product',
    });
  }

  tagsList = computed(() => {
    const p = this.data();
    if (!p) return [];
    const tags: unknown = (p as any).tags;

    if (Array.isArray(tags)) {
      return (tags as unknown[])
        .map((t) => (t ?? '').toString().trim())
        .filter(Boolean);
    }

    if (typeof tags === 'string') {
      return tags
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    return [];
  });

  trackByFeature = (index: number, feature: string) => `${index}:${feature}`;
}
