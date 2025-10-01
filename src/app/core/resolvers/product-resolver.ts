import { Injectable, inject } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ResolveFn,
} from '@angular/router';
import { ProductDetailStore } from '../store/products/product-detail.store';
import { catchError, of, from, timeout } from 'rxjs';
import { ProductItem } from '../interfaces/product.interface';

/**
 * Hybrid resolver với timeout ngắn để cải thiện performance
 * - Nếu API trả về nhanh (< 800ms): dùng dữ liệu từ resolver (fast path)
 * - Nếu API chậm hoặc lỗi: component sẽ tự load data (fallback path)
 * Kết quả: trang load ngay lập tức, không bị block bởi API chậm
 */
export const productResolver: ResolveFn<ProductItem | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const store = inject(ProductDetailStore);
  const slug = route.paramMap.get('slug') || '';

  if (!slug) {
    return of(null);
  }

  // Chuyển Promise thành Observable với timeout ngắn để tránh block navigation
  return from(store.load(slug)).pipe(
    timeout(800), // Chỉ chờ 800ms, sau đó fallback về component load
    catchError(() => {
      // Timeout hoặc lỗi → trả về null, component sẽ tự handle
      return of(null);
    }),
  );
};

// Keep the class for backward compatibility if needed
@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<ProductItem | null> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return productResolver(route, state);
  }
}
