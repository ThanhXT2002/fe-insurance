import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductList } from '../product-list/product-list';
import { ProductListStore } from '../../core/store/products/product-list.store';
import { BtnCommon } from '../btn-common/btn-common';

@Component({
  selector: 'app-all-products-section',
  imports: [CommonModule, ProductList, BtnCommon],
  templateUrl: './all-products-section.html',
  styleUrl: './all-products-section.scss',
})
export class AllProductsSection {
  private readonly productListStore = inject(ProductListStore);
  readonly products = computed(() => this.productListStore.rows());
  readonly loading = this.productListStore.loading;
  // use store-provided signals for hasMore and loadingMore
  readonly hasMore = computed(() => this.productListStore.hasMore());
  readonly loadingMore = computed(() => this.productListStore.loadingMore());

  constructor() {
    // Load first page in microtask.
    // Note: loadInitial() will return cached rows if present (so when navigating back
    // to this page the list is preserved). To force a refresh pass { force: true }.
    Promise.resolve().then(() => {
      this.productListStore.loadInitial({ active: true }).catch(() => {});
    });
  }

  // handler for load more button
  async loadMore() {
    // prevent double clicks - store maintains loadingMore
    if (this.productListStore.loadingMore()) return;
    try {
      await this.productListStore.loadMore();
    } catch (err) {
      // error is already set on the store
    }
  }

  // expose refresh for UI if needed
  async refresh() {
    await this.productListStore.refresh({ active: true });
  }
}
