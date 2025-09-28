import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductItem } from '../../interfaces/product.interface';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '@/core/interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchProducts(query?: {
    page?: number;
    limit?: number;
    keyword?: string;
    active?: boolean;
  }) {
    const params: any = {};
    if (query?.page != null) params.page = query.page;
    if (query?.limit != null) params.limit = query.limit;
    if (query?.keyword) params.keyword = query.keyword;
    if (query?.active !== undefined && query?.active !== null)
      params.active = String(query.active);
    return this.http.get<ApiResponse<{ rows: ProductItem[]; total: number }>>(
      `${this.apiUrl}/products/`,
      { params },
    );
  }

  // viết thêm endpoint lấy sản phẩm nổi bật cho trang chủ
  getFeaturedProducts(
    limit: number = 4,
  ): Observable<ApiResponse<ProductItem[]>> {
    return this.http.get<ApiResponse<ProductItem[]>>(
      `${this.apiUrl}/products/home?limit=${limit}`,
    );
  }

  /**
   * Làm mới lại dữ liệu sản phẩm (gọi lại API)
   */
  refresh(): void {
    this.fetchProducts();
  }
}
