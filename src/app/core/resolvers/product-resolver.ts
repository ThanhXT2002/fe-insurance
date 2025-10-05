import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ResolveFn,
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import { ProductDetailStore } from '../store/products/product-detail.store';
import { catchError, of, from, timeout, tap } from 'rxjs';
import { ProductItem } from '../interfaces/product.interface';

/**
 * Product resolver với TransferState cho SSR optimization
 */
export const productResolver: ResolveFn<ProductItem | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const store = inject(ProductDetailStore);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const slug = route.paramMap.get('slug') || '';

  if (!slug) {
    return of(null);
  }

  // 1. Kiểm tra cache trước
  const cached = store.getSignal(slug)();
  if (cached) {
    return of(cached);
  }

  const transferState = inject(TransferState);
  const stateKey = makeStateKey<ProductItem | null>(`product-${slug}`);

  // 2. CLIENT: Kiểm tra TransferState
  if (isBrowser) {
    const serverData = transferState.get(stateKey, null);
    if (serverData) {
      store.setData(slug, serverData);
      transferState.remove(stateKey);
      return of(serverData);
    }
    return of(null);
  }
  // 3. SERVER: Load và lưu vào TransferState
  return from(store.load(slug)).pipe(
    timeout(1500),
    tap((data) => {
      if (data) transferState.set(stateKey, data);
    }),
    catchError(() => of(null)),
  );
};

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<ProductItem | null> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return productResolver(route, state);
  }
}
