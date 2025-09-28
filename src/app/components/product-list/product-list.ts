import { Component, computed, input } from '@angular/core';
import { IconBoxWrapper } from '../icon-box-wrapper/icon-box-wrapper';

@Component({
  selector: 'app-product-list',
  imports: [IconBoxWrapper],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  // Nhận danh sách sản phẩm từ component cha thông qua input
  readonly items = input<Array<any> | undefined>(undefined);

  // Input để nhận số lượng item cần hiển thị từ component cha
  readonly itemCount = input<number | undefined>(undefined); // Cho phép undefined

  // Computed signal để lấy số lượng products giới hạn theo itemCount
  readonly limitedProducts = computed(() => {
    const products = this.items() ?? [];
    const count = this.itemCount();
    if (!products || products.length === 0) return [];
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
