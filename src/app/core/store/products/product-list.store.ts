import { Injectable, inject, Signal, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { BaseStoreSignal } from '../../base/base-store-signal';
import { ProductsService } from '../../services/api/products';
import { ProductItem } from '../../interfaces/product.interface';

interface ProductListState {
  rows: ProductItem[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class ProductListStore extends BaseStoreSignal<ProductListState> {
  protected getInitialState(): ProductListState {
    return { rows: [], total: 0, page: 1, limit: 8 };
  }

  private readonly service = inject(ProductsService);

  // signals
  readonly rows: Signal<ProductItem[]> = this.select((s) => s.rows);
  readonly total = this.select((s) => s.total);
  // computed signal: whether there are more items to load (readonly)
  readonly hasMore: Signal<boolean> = computed(
    () => (this.rows()?.length ?? 0) < (this.total() ?? 0),
  );
  // separate loading flag for loadMore to avoid conflating with general loading
  private _loadingMore = signal(false);
  readonly loadingMore: Signal<boolean> = computed(() => this._loadingMore());

  /**
   * Tải danh sách sản phẩm có phân trang.
   * Tự động thử lại khi gặp lỗi mạng qua fetchWithRetry, nhưng KHÔNG thử lại nếu kết quả trả về là mảng rỗng.
   */
  async load(query?: {
    page?: number;
    limit?: number;
    keyword?: string;
    active?: true;
  }) {
    const params = { ...(query || {}) };

    const res = await this.fetchPage(params);

    // replace rows with fetched page
    this.set({
      rows: res.rows,
      total: res.total ?? 0,
      page: params.page ?? this.snapshot().page,
      limit: params.limit ?? this.snapshot().limit,
    });

    return res;
  }

  // Fetch a single page from the API without mutating store state.
  private async fetchPage(params: {
    page?: number;
    limit?: number;
    keyword?: string;
    active?: true;
  }) {
    const fetcher = async () => {
      const resp = await firstValueFrom(
        this.service.fetchProducts(params).pipe(timeout(5000)) as any,
      );
      const payload: any = resp;
      if (payload && payload.data && Array.isArray(payload.data.rows)) {
        return payload.data as { rows: ProductItem[]; total: number };
      }
      if (payload && Array.isArray(payload.rows)) return payload as any;
      return { rows: [], total: 0 } as { rows: ProductItem[]; total: number };
    };

    const res = await this.fetchWithRetry(fetcher, 2, (v) => false);
    return res;
  }

  /**
   * Load the first page (useful on component init)
   */
  async loadInitial(
    query?: { limit?: number; keyword?: string; active?: true },
    options?: { force?: boolean },
  ) {
    // If we already have cached rows and caller didn't force refresh, return cache
    const cachedRows = this.snapshot().rows;
    if (!options?.force && Array.isArray(cachedRows) && cachedRows.length > 0) {
      return { rows: cachedRows, total: this.snapshot().total } as any;
    }

    // ensure page is 1
    const limit = query?.limit ?? this.snapshot().limit;
    const res = await this.load({
      ...(query || {}),
      page: 1,
      limit,
      active: true,
    });
    return res;
  }

  /**
   * Load the next page and append rows. Returns appended result.
   */
  async loadMore() {
    // prevent concurrent loadMore calls
    if (this._loadingMore())
      return { rows: [], total: this.snapshot().total } as any;

    this._loadingMore.set(true);
    try {
      const s = this.snapshot();
      const nextPage = (s.page || 1) + 1;

      const res = await this.fetchPage({
        page: nextPage,
        limit: s.limit,
        active: true,
      });

      // append rows if any
      const currentRows = this.snapshot().rows || [];
      if (res && Array.isArray(res.rows) && res.rows.length > 0) {
        this.set({
          rows: [...currentRows, ...res.rows],
          total: res.total ?? this.snapshot().total,
          page: nextPage,
          limit: s.limit,
        });
      } else {
        // even if empty, update total if provided by API
        this.patch({ total: res.total ?? this.snapshot().total });
        this.patch({ page: nextPage });
      }

      return res;
    } finally {
      this._loadingMore.set(false);
    }
  }

  /**
   * Refresh the list: reset pagination and reload first page.
   */
  async refresh(query?: { limit?: number; keyword?: string; active?: true }) {
    // reset page to 1 and optionally set limit
    const limit = query?.limit ?? this.snapshot().limit;
    this.set({ rows: [], total: 0, page: 1, limit });
    return this.loadInitial(query);
  }

  // tiện ích để đặt lại phân trang
  resetPagination() {
    this.patch({ page: 1, limit: 8 });
  }
}
