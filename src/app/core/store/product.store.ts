import { Injectable, inject, Signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { BaseStoreSignal } from '../base/base-store-signal';
import { ProductsService } from '../services/api/products';
import { ProductItem } from '../interfaces/product.interface';

interface ProductHomeState {
  items: ProductItem[] | null;
}

@Injectable({ providedIn: 'root' })
export class ProductStore extends BaseStoreSignal<ProductHomeState> {
  protected getInitialState(): ProductHomeState {
    return { items: null };
  }

  private readonly productsService = inject(ProductsService);
  // Promise đang chạy để gom (dedupe) các request cùng lúc
  private _loadPromise: Promise<ProductItem[]> | null = null;

  // selector: signal chứa items
  readonly items: Signal<ProductItem[] | null> = this.select((s) => s.items);

  // Computed tiện lợi: trả về mảng sản phẩm hoặc mảng rỗng
  get list() {
    return this.select((s) => s.items ?? []);
  }

  // Tải sản phẩm cho trang chủ: ưu tiên dùng cache, nếu không có thì gọi API (có retry)
  async loadHome(limit?: number) {
    // Nếu đã có cache và không rỗng thì trả về ngay
    const current = this.snapshot().items;
    if (current && Array.isArray(current) && current.length > 0) return current;

    // Nếu đang có load đang tiến hành thì tái sử dụng promise đó (dedupe)
    if (this._loadPromise) return this._loadPromise;

    const fetcher = async (): Promise<ProductItem[]> => {
      // Gọi getFeaturedProducts (backend trả ApiResponse<ProductItem[]>)
      try {
        const resp = await firstValueFrom(
          this.productsService
            .getFeaturedProducts(limit)
            .pipe(timeout(5000)) as any,
        );
        // ApiResponse shape: { data: ProductItem[] } or similar; support both
        // Hỗ trợ cả trường hợp backend trả mảng trực tiếp hoặc object chứa trường `data` là mảng
        const payload: any = resp;
        if (Array.isArray(payload)) return payload as ProductItem[];
        if (payload && Array.isArray(payload.data))
          return payload.data as ProductItem[];
        return [];
      } catch (err) {
        // Nếu API lỗi hoặc timeout thì trả về mảng rỗng (không dùng fallback JSON nữa)
        return [];
      }
    };

    // Bắt đầu thực hiện fetch và lưu promise đang chạy để các lần gọi đồng thời cùng sử dụng
    this._loadPromise = (async () => {
      try {
        const res = await this.fetchWithRetry<ProductItem[]>(
          fetcher,
          2,
          (v) => !v || (Array.isArray(v) && v.length === 0),
        );
        // Update store state
        // Cập nhật state của store
        this.set({ items: res });
        return res;
      } finally {
        // Clear in-flight promise regardless of success/failure
        // Xóa _loadPromise dù thành công hay lỗi
        this._loadPromise = null;
      }
    })();

    return this._loadPromise;
  }
}
