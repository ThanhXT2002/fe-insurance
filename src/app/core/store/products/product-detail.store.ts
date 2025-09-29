import { Injectable, inject, Signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseStoreSignal } from '../../base/base-store-signal';
import { ProductsService } from '../../services/api/products';
import { ProductItem } from '../../interfaces/product.interface';

/**
 * Store cache cho chi tiết sản phẩm (key theo slug)
 * - TTL cho mỗi entry (mặc định 5 phút)
 * - Dedupe request đang chạy cho cùng slug
 * - Giới hạn số entry và loại bỏ theo LRU
 * - Cung cấp Signal để component theo dõi dữ liệu từng slug
 */

interface ProductDetailEntry {
  // Dữ liệu chi tiết sản phẩm (hoặc null nếu không tìm thấy)
  data: ProductItem | null;
  // Thời điểm lấy dữ liệu (ms)
  fetchedAt: number;
  // Thời điểm truy cập cuối cùng (dùng để LRU)
  accessingAt: number;
}

interface ProductDetailState {
  // Bản đồ slug -> ProductDetailEntry
  entries: Record<string, ProductDetailEntry>;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_ENTRIES = 50;

@Injectable({ providedIn: 'root' })
export class ProductDetailStore extends BaseStoreSignal<ProductDetailState> {
  protected getInitialState(): ProductDetailState {
    return { entries: {} };
  }

  private readonly productsService = inject(ProductsService);
  private _inFlight: Record<string, Promise<ProductItem | null> | null> = {};
  // TTL (ms) và giới hạn số entries
  private ttl = DEFAULT_TTL_MS;
  private maxEntries = DEFAULT_MAX_ENTRIES;

  /**
   * Configure store behaviour (optional). Call early in app startup if needed.
   */
  configure(opts: { ttlMs?: number; maxEntries?: number }) {
    // Tuỳ chỉnh TTL và giới hạn entry
    if (opts.ttlMs != null) this.ttl = opts.ttlMs;
    if (opts.maxEntries != null) this.maxEntries = opts.maxEntries;
  }

  // Internal helper: get entry or null
  private getEntry(slug: string): ProductDetailEntry | null {
    const e = this.snapshot().entries[slug];
    if (!e) return null;
    const now = Date.now();
    // expire check
    if (this.ttl > 0 && now - e.fetchedAt > this.ttl) {
      this.delete(slug);
      return null;
    }
    // update accessingAt for LRU
    e.accessingAt = now;
    // Cập nhật state để signal liên quan nhận biết thay đổi thời điểm truy cập
    this.patch({ entries: { ...this.snapshot().entries, [slug]: e } });
    return e;
  }

  // Public: get cached product or null (does not call API)
  get(slug: string): ProductItem | null {
    const e = this.getEntry(slug);
    return e ? e.data : null;
  }

  // Public: signal to watch a specific slug's entry (data or null)
  getSignal(slug: string): Signal<ProductItem | null> {
    return this.select((s) => s.entries[slug]?.data ?? null);
  }

  // Load product detail, dedupe in-flight and respect cache TTL
  async load(slug: string): Promise<ProductItem | null> {
    if (!slug) return null;
    // Return cached if present
    const cached = this.get(slug);
    if (cached) return cached;

    // If in-flight, return the same promise
    if (this._inFlight[slug])
      return this._inFlight[slug] as Promise<ProductItem | null>;

    const p = (async () => {
      try {
        // Dùng firstValueFrom thay cho toPromise() vì toPromise() đã bị deprecated
        const resp = await firstValueFrom(
          this.productsService.getProductBySlug(slug),
        );
        // ApiResponse<ProductItem> hoặc trả trực tiếp; hỗ trợ cả hai dạng
        const payload: any = resp;
        const data: ProductItem | null =
          payload && payload.data ? payload.data : (payload ?? null);
        // lưu vào cache
        this.setEntry(slug, data);
        return data;
      } catch (err) {
        // Không cache khi lỗi; trả về null
        return null;
      } finally {
        // xoá in-flight
        this._inFlight[slug] = null;
      }
    })();

    this._inFlight[slug] = p;
    return p;
  }

  // Force refresh (bypass cache)
  async refresh(slug: string): Promise<ProductItem | null> {
    // Xoá cache hiện tại rồi gọi lại API
    this.delete(slug);
    return this.load(slug);
  }

  // Remove one entry
  delete(slug: string) {
    const entries = { ...this.snapshot().entries };
    if (entries[slug]) {
      delete entries[slug];
      this.patch({ entries });
    }
  }

  // Clear all cache
  clearAll() {
    // Xoá toàn bộ cache
    this.set({ entries: {} });
  }

  // Internal: set entry and enforce maxEntries eviction
  private setEntry(slug: string, data: ProductItem | null) {
    const now = Date.now();
    const entry: ProductDetailEntry = {
      data,
      fetchedAt: now,
      accessingAt: now,
    };
    const entries = { ...this.snapshot().entries, [slug]: entry };
    // Thêm/ cập nhật entry và chạy kiểm soát số lượng
    this.patch({ entries });
    this.enforceMaxEntries(entries);
  }

  // Simple LRU eviction based on accessingAt timestamps
  private enforceMaxEntries(entriesObj: Record<string, ProductDetailEntry>) {
    const keys = Object.keys(entriesObj);
    if (keys.length <= this.maxEntries) return;
    // Sort keys by accessingAt ascending (least recently used first)
    const sorted = keys.sort(
      (a, b) => entriesObj[a].accessingAt - entriesObj[b].accessingAt,
    );
    const toRemove = sorted.slice(0, keys.length - this.maxEntries);
    if (toRemove.length === 0) return;
    const newEntries = { ...entriesObj };
    for (const k of toRemove) delete newEntries[k];
    // Thiết lập state mới sau khi đã loại bỏ mục LRU
    this.set({ entries: newEntries });
  }
}
