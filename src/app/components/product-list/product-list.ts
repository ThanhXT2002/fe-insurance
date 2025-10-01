import { Component, computed, inject, input, Signal } from '@angular/core';
import { IconBoxWrapper } from '../icon-box-wrapper/icon-box-wrapper';
import { Router } from '@angular/router';
import { ProductCardSkeleton } from "../product-card-skeleton/product-card-skeleton";



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [IconBoxWrapper, ProductCardSkeleton],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private router = inject(Router);
  // Nhận danh sách sản phẩm từ component cha thông qua input
  readonly items = input<Array<any> | undefined>(undefined);

  skeletonArray = this.items() ? this.items() : Array(8); // Mảng tạm để hiển thị 8 skeletons

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

  // thêm input nhận loading (boolean hoặc Signal<boolean>)
  readonly loading = input<boolean | Signal<boolean> | undefined>(undefined);
  readonly loadingMore = input<boolean | Signal<boolean> | undefined>(undefined);

  // normalized computed để dùng trong template
  readonly isLoading = computed(() => {
    const v = this.loading();
    return typeof v === 'function' ? (v as Signal<boolean>)() : !!v;
  });

  readonly isLoadingMore = computed(() => {
    const v = this.loadingMore();
    return typeof v === 'function' ? (v as Signal<boolean>)() : !!v;
  });

  onProductClick(slug:string){
    this.router.navigate(['/product', slug]);
  }
}
