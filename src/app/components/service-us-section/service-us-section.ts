import { ProductStore } from '@/core/store/products/product.store';
import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";
import { RouterLink } from '@angular/router';
import { InfoExtraPhone } from "../info-extra-phone/info-extra-phone";
import { MenuProduct } from "../menu-product/menu-product";

@Component({
  selector: 'app-service-us-section',
  imports: [IconBoxWrapper, RouterLink, InfoExtraPhone, MenuProduct],
  templateUrl: './service-us-section.html',
  styleUrl: './service-us-section.scss',
})
export class ServiceUsSection {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly productStore = inject(ProductStore);
  isBrowser = isPlatformBrowser(this.platformId);

  loading = this.productStore.loading;

  skeletonArray = Array(6);

  // Computed signal expose danh sách sản phẩm (mảng) cho template
  readonly products = computed(() => this.productStore.list());

  constructor() {
    if (this.isBrowser) {
      Promise.resolve().then(() => {
        this.productStore.loadHome(6)
      });
    }
  }
}
