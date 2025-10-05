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
    CheckItem,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SEOService);
  private readonly store = inject(ProductDetailStore);
  private loadingService = inject(LoadingService);
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
    // Theo dõi dữ liệu từ store signal và tự động cập nhật
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

  /**
   * Convert product.imgs (comma-separated string or string[]) into an array
   * acceptable by p-galleria: [{ itemImageSrc, thumbnailImageSrc }, ...]
   */
  private toGalleriaItems(
    imgs?: string[] | string | null,
  ): { itemImageSrc: string; thumbnailImageSrc: string }[] {
    if (!imgs) return [];

    let arr: string[] = [];
    if (Array.isArray(imgs)) {
      arr = imgs.filter(Boolean) as string[];
    } else if (typeof imgs === 'string') {
      // Some responses provide a comma separated string
      arr = imgs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return arr.map((url) => ({ itemImageSrc: url, thumbnailImageSrc: url }));
  }

  ngOnInit(): void {
    // Lắng nghe thay đổi slug từ route params (không dùng snapshot)
    this.routeSubscription = this.route.params.subscribe((params) => {
      const slug = params['slug'] || '';
      if (!slug) return;

      // Reset data trước khi load mới
      this.data.set(null);
      this.loadingService.show();

      // Cập nhật signal để trigger effect
      this.slugSignal.set(slug);

      // Kiểm tra data từ resolver trước
      const resolverData = this.route.snapshot.data['product'];

      if (resolverData && resolverData.slug === slug) {
        // Resolver thành công và đúng slug hiện tại
        this.data.set(resolverData);
        this.imgThumbnail.set(this.toGalleriaItems(resolverData.imgs));
        this.setupSEOFromProduct(resolverData);
        this.loadingService.hide();
      } else {
        // Resolver timeout, lỗi, hoặc slug không khớp → load từ store
        this.loadProductAndSetSEO();
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup subscription để tránh memory leak
    this.routeSubscription?.unsubscribe();
  }

  /**
   * Thiết lập SEO từ dữ liệu product đã có
   */
  private setupSEOFromProduct(product: any): void {
    const cfg = this.seo.mapProductDetailToSEOConfig(product);
    this.seo.setSEO(cfg);
  }

  /**
   * Load dữ liệu product và thiết lập SEO (dùng khi resolver timeout)
   */
  private loadProductAndSetSEO(): void {
    const slug = this.slugSignal(); // Dùng signal thay vì snapshot
    if (!slug) {
      this.loadingService.hide();
      return;
    }

    // Xác định environment để tạo URL phù hợp
    const baseUrl = this.isServer ? environment.seoUrl : '';

    // Component tự load dữ liệu với URL server-safe
    this.store
      .load(slug)
      .then((product) => {
        if (product) {
          this.data.set(product);
          this.imgThumbnail.set(this.toGalleriaItems(product.imgs));
          const cfg = this.seo.mapProductDetailToSEOConfig(product);
          // Cập nhật URL để tương thích với server
          if (cfg.url && this.isServer) {
            cfg.url = baseUrl + cfg.url;
          }
          this.seo.setSEO(cfg);
        } else {
          // Thiết lập SEO mặc định nếu không load được dữ liệu
          this.setDefaultSEO(slug, baseUrl, this.isServer);
        }
      })
      .catch(() => {
        // Thiết lập SEO mặc định nếu có lỗi
        this.setDefaultSEO(slug, baseUrl, this.isServer);
      })
      .finally(() => {
        // Luôn hide loading khi hoàn thành
        this.loadingService.hide();
      });
  }

  onClickBuyNow(url: string) {
    console.log('Navigating to:', url);
    this.router.navigate([url]);
  }

  /**
   * Thiết lập SEO mặc định khi không load được dữ liệu product
   */
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

  // computed tagsList trả về mảng đã xử lý
  tagsList = computed(() => {
    const p = this.data();
    if (!p) return [];
    const tags: unknown = (p as any).tags;

    // nếu đã là mảng, trim từng phần tử
    if (Array.isArray(tags)) {
      return (tags as unknown[])
        .map((t) => (t ?? '').toString().trim())
        .filter(Boolean);
    }

    // nếu là string, tách theo dấu phẩy
    if (typeof tags === 'string') {
      return tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [];
  });

  // trackBy cho @for (dùng value + index)
  trackByFeature = (index: number, feature: string) => `${index}:${feature}`;
}
