import { Injectable, inject } from '@angular/core';
import { computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseStoreSignal } from '../../base/base-store-signal';
import { MenuService } from '../../services/api/menu.service';
import {
  PublicMenuResponse,
  MenuCacheEntry,
} from '../../interfaces/menu.interface';

export interface MenuStoreState {
  // Cache cho multiple menu categories - key: categoryKey, value: MenuCacheEntry
  menuCache: Record<string, MenuCacheEntry>;
  // Danh sách category keys đang được load
  loadingCategories: string[];
  // Lỗi cho từng category - key: categoryKey, value: error
  categoryErrors: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class MenuStore extends BaseStoreSignal<MenuStoreState> {
  private menuService = inject(MenuService);

  // Menu cache vĩnh viễn - menu rất ít khi thay đổi
  // Chỉ clear cache khi user manually refresh hoặc app restart

  protected getInitialState(): MenuStoreState {
    return {
      menuCache: {},
      loadingCategories: [],
      categoryErrors: {},
    };
  }

  // Selectors
  readonly menuCache = this.select((state) => state.menuCache);
  readonly loadingCategories = this.select((state) => state.loadingCategories);
  readonly categoryErrors = this.select((state) => state.categoryErrors);

  /**
   * Selector để lấy menu theo category key
   * @param categoryKey - Key của menu category
   */
  getMenuByCategory = (categoryKey: string) =>
    computed(() => {
      const cache = this.menuCache();
      const entry = cache[categoryKey];

      if (!entry) return null;

      // Menu cache vĩnh viễn - không kiểm tra expiry
      return entry.data;
    });

  /**
   * Selector để kiểm tra category có đang loading không
   * @param categoryKey - Key của menu category
   */
  isCategoryLoading = (categoryKey: string) =>
    computed(() => {
      return this.loadingCategories().includes(categoryKey);
    });

  /**
   * Selector để lấy error của category
   * @param categoryKey - Key của menu category
   */
  getCategoryError = (categoryKey: string) =>
    computed(() => {
      return this.categoryErrors()[categoryKey] || null;
    });

  /**
   * Load menu theo category key với cache
   * @param categoryKey - Key của menu category
   * @param forceRefresh - Bắt buộc refresh, bỏ qua cache
   */
  async loadMenu(categoryKey: string, forceRefresh = false): Promise<void> {
    // Kiểm tra cache nếu không force refresh
    if (!forceRefresh) {
      const cached = this.getMenuByCategory(categoryKey)();
      if (cached) {
        return; // Đã có cache hợp lệ
      }
    }

    // Kiểm tra đã đang load chưa
    if (this.isCategoryLoading(categoryKey)()) {
      return; // Đang load rồi
    }

    try {
      // Thêm vào loading list
      this.addToLoadingList(categoryKey);

      // Clear error cũ
      this.clearCategoryError(categoryKey);

      // Gọi API
      const response = await firstValueFrom(
        this.menuService.getPublicMenu(categoryKey),
      );

      if (response?.status && response.data) {
        // Lưu vào cache
        this.addToCache(categoryKey, response.data);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      // Lưu error
      this.setCategoryError(categoryKey, error);
      throw error;
    } finally {
      // Xóa khỏi loading list
      this.removeFromLoadingList(categoryKey);
    }
  }

  // Private helper methods

  private addToCache(categoryKey: string, data: PublicMenuResponse): void {
    const now = Date.now();
    const entry: MenuCacheEntry = {
      data,
      timestamp: now,
      expiry: Number.MAX_SAFE_INTEGER, // Cache vĩnh viễn
    };

    this.patch({
      menuCache: {
        ...this.snapshot().menuCache,
        [categoryKey]: entry,
      },
    });
  }


  private addToLoadingList(categoryKey: string): void {
    const currentLoading = this.snapshot().loadingCategories;
    if (!currentLoading.includes(categoryKey)) {
      this.patch({
        loadingCategories: [...currentLoading, categoryKey],
      });
    }
  }

  private removeFromLoadingList(categoryKey: string): void {
    this.patch({
      loadingCategories: this.snapshot().loadingCategories.filter(
        (key) => key !== categoryKey,
      ),
    });
  }

  private setCategoryError(categoryKey: string, error: any): void {
    this.patch({
      categoryErrors: {
        ...this.snapshot().categoryErrors,
        [categoryKey]: error,
      },
    });
  }

  private clearCategoryError(categoryKey: string): void {
    const currentErrors = { ...this.snapshot().categoryErrors };
    delete currentErrors[categoryKey];

    this.patch({ categoryErrors: currentErrors });
  }
}
