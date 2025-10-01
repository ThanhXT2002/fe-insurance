import { Injectable, inject } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ResolveFn,
} from '@angular/router';
import { ProductDetailStore } from '../store/products/product-detail.store';
import { catchError, of, from } from 'rxjs';
import { ProductItem } from '../interfaces/product.interface';

// Modern function-based resolver with proper error handling
export const productResolver: ResolveFn<ProductItem | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const store = inject(ProductDetailStore);
  const slug = route.paramMap.get('slug') || '';

  if (!slug) {
    return of(null);
  }

  // Convert Promise to Observable for proper RxJS error handling
  return from(store.load(slug)).pipe(
    catchError((error) => {
      console.error(`[ProductResolver] Error resolving product:`, error);
      // Return null instead of throwing to prevent navigation failure
      // This allows the component to handle the "no data" scenario gracefully
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
