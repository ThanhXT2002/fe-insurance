import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductList } from '../product-list/product-list';
import { SectionIntro } from '../section-intro/section-intro';
import { ProductStore } from '../../core/store/products/product.store';

@Component({
  selector: 'app-service-section',
  imports: [CommonModule, ProductList, SectionIntro],
  templateUrl: './service-section.html',
  styleUrl: './service-section.scss',
})
export class ServiceSection {
  private readonly productStore = inject(ProductStore);

  // Computed signal expose danh sách sản phẩm (mảng) cho template
  readonly products = computed(() => this.productStore.list());

  constructor() {
    // Tải dữ liệu cho trang chủ (số lượng mặc định 4) trong microtask để tránh thay đổi view khi đang check
    Promise.resolve().then(() => {
      this.productStore.loadHome(4).catch(() => {
        // lỗi load thì cứ để store hiển thị fallback empty list
      });
    });
  }
}
