import { Component, inject, input, OnInit, computed } from '@angular/core';
import { IconBoxWrapper } from "../icon-box-wrapper/icon-box-wrapper";
import { ProductsService } from '../../core/services/products';

@Component({
  selector: 'app-product-list',
  imports: [IconBoxWrapper],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  protected readonly productService = inject(ProductsService);

  // Input để nhận số lượng item cần hiển thị từ component cha
  readonly itemCount = input<number>(4); // Default value là 4

  // Computed signal để lấy số lượng products giới hạn theo itemCount
  readonly limitedProducts = computed(() => {
    const products = this.productService.products();
    const count = this.itemCount();
    return products?.slice(0, count) || [];
  });
}
