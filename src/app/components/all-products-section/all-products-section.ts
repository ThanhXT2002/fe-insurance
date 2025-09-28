import { Component, computed, inject } from '@angular/core';
import { ProductList } from '../product-list/product-list';
import { ProductStore } from '../../core/store/product.store';

@Component({
  selector: 'app-all-products-section',
  imports: [ProductList],
  templateUrl: './all-products-section.html',
  styleUrl: './all-products-section.scss',
})
export class AllProductsSection {
  private readonly productStore = inject(ProductStore);
  readonly products = computed(() => this.productStore.list());

  constructor() {
    Promise.resolve().then(() => {
      this.productStore.loadHome().catch(() => {});
    });
  }
}
