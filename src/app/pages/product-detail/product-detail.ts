import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  effect,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SEOService } from '../../core/services/seo.service';
import { ProductDetailStore } from '../../core/store/products/product-detail.store';
import { environment } from '../../../environments/environment';
import { LoadingService } from '@/core/services/loading.service';
import { ProductItem } from '@/core/interfaces/product.interface';
import { BreadcrumbImg } from '@/components/breadcrumb-img/breadcrumb-img';
import { isPlatformServer } from '@angular/common';
import { MenuProduct } from "@/components/menu-product/menu-product";
import { BtnCommon } from "@/components/btn-common/btn-common";

@Component({
  selector: 'app-product-detail',
  imports: [BreadcrumbImg, MenuProduct, BtnCommon],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SEOService);
  private readonly store = inject(ProductDetailStore);
  private loadingService = inject(LoadingService);
  private platformId = inject(PLATFORM_ID);
  private isServer = isPlatformServer(this.platformId);

  // Chuyển data thành signal để tránh ExpressionChangedAfterItHasBeenCheckedError
  data = signal<ProductItem | null>(null);
  private slugSignal = signal('');

  constructor() {
    // Theo dõi dữ liệu từ store signal và tự động cập nhật
    effect(() => {
      const slug = this.slugSignal();
      if (!slug) return;

      const product = this.store.getSignal(slug)();
      if (product) {
        this.data.set(product);
        this.setupSEOFromProduct(product);
      }
    });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!slug) return;

    // Cập nhật signal để trigger effect
    this.slugSignal.set(slug);

    // Kiểm tra data từ resolver trước
    const resolverData = this.route.snapshot.data['product'];

    if (resolverData) {
      // Resolver thành công (fast path < 800ms)
      this.data.set(resolverData);
      this.setupSEOFromProduct(resolverData);
    } else {
      // Resolver timeout hoặc lỗi → load từ store
      this.loadProductAndSetSEO();
    }
    this.loadingService.hide();
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
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    // Xác định environment để tạo URL phù hợp
    const baseUrl = this.isServer ? environment.seoUrl : '';

    // Component tự load dữ liệu với URL server-safe
    this.store
      .load(slug)
      .then((product) => {
        if (product) {
          this.data.set(product);
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
      });
  }


  onClickBuyNow(){

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
}
