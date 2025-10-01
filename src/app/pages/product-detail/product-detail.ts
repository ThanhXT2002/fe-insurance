import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SEOService } from '../../core/services/seo.service';
import { ProductDetailStore } from '../../core/store/products/product-detail.store';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SEOService);
  private readonly store = inject(ProductDetailStore);

  ngOnInit(): void {
    // Lắng nghe dữ liệu từ resolver (quan trọng cho SSR)
    this.route.data.subscribe((data) => {
      try {
        const product = data['product'] || null;

        if (product) {
          // Resolver thành công → thiết lập SEO ngay lập tức (đường nhanh)
          this.setupSEOFromProduct(product);
        } else {
          // 🔄 Resolver timeout/thất bại → component tự load dữ liệu (đường dự phòng)
          this.loadProductAndSetSEO();
        }
      } catch (e) {
        // Bỏ qua lỗi để không làm crash trang
      }
    });
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
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer ? environment.seoUrl : '';

    // Component tự load dữ liệu với URL server-safe
    this.store
      .load(slug)
      .then((product) => {
        if (product) {
          const cfg = this.seo.mapProductDetailToSEOConfig(product);
          // Cập nhật URL để tương thích với server
          if (cfg.url && isServer) {
            cfg.url = baseUrl + cfg.url;
          }
          this.seo.setSEO(cfg);
        } else {
          // Thiết lập SEO mặc định nếu không load được dữ liệu
          this.setDefaultSEO(slug, baseUrl, isServer);
        }
      })
      .catch(() => {
        // Thiết lập SEO mặc định nếu có lỗi
        this.setDefaultSEO(slug, baseUrl, isServer);
      });
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
