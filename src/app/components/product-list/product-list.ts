import { Component, inject, input, OnInit, computed } from '@angular/core';
import { IconBoxWrapper } from '../icon-box-wrapper/icon-box-wrapper';
import { ProductsService } from '../../core/services/api/products';

@Component({
  selector: 'app-product-list',
  imports: [IconBoxWrapper],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  protected readonly productService = inject(ProductsService);

  // Input để nhận số lượng item cần hiển thị từ component cha
  readonly itemCount = input<number | undefined>(undefined); // Cho phép undefined

  // Computed signal để lấy số lượng products giới hạn theo itemCount
  readonly limitedProducts = computed(() => {
    const products = this.productService.products();
    const count = this.itemCount();
    if (!products) return [];
    // Nếu count là undefined/null/0 hoặc lớn hơn số lượng sản phẩm thì trả về tất cả
    if (
      count === undefined ||
      count === null ||
      count <= 0 ||
      count >= products.length
    ) {
      return products;
    }
    return products.slice(0, count);
  });
}
