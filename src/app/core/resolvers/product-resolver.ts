import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { ProductDetailStore } from '../store/products/product-detail.store';

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<any> {
  private readonly store = new ProductDetailStore();
  // Note: we intentionally call the store loader which will fetch or return cache
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const slug = route.paramMap.get('slug') || '';
    try {
      return await this.store.load(slug);
    } catch (e) {
      return null;
    }
  }
}
