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
  // Signal lưu trữ toàn bộ danh sách sản phẩm
  private readonly productsSignal = signal<ProductItem[] | null>(null);
  apiUrl =  environment.apiUrl;

  // Signal lấy 4 sản phẩm đầu tiên (ưu tiên theo priority tăng dần)
  readonly top4Products = computed(() => {
    const products = this.productsSignal();
    return products
      ? [...products]
      : [];
  });

  constructor(private http: HttpClient) {
    this.fetchProducts(); // Tự động gọi fetchProducts khi khởi tạo service
  }

  /**
   * Lấy danh sách sản phẩm từ file json và lưu vào signal
   */
  fetchProducts(): void {
    this.http
      .get<ProductItem[]>('assets/json/products.json')
      .pipe(
      )
      .subscribe({
        next: (data) => this.productsSignal.set(data),
        error: () => this.productsSignal.set([]),
      });
  }

  /**
   * Trả về signal chứa toàn bộ danh sách sản phẩm
   */
  get products() {
    return this.productsSignal;
  }

  /**
   * Trả về observable danh sách sản phẩm (nếu cần dùng dạng observable)
   */
  getProductLists$(): Observable<ProductItem[]> {
    return this.http.get<ProductItem[]>('assets/json/products.json');
  }

  // viết thêm endpoint lấy sản phẩm nổi bật cho trang chủ
  getFeaturedProducts(limit: number = 4): Observable<ApiResponse<ProductItem[]>> {
    return this.http.get<ApiResponse<ProductItem[]>>(`${this.apiUrl}/products/home?limit=${limit}`);
  }

  /**
   * Làm mới lại dữ liệu sản phẩm (gọi lại API)
   */
  refresh(): void {
    this.fetchProducts();
  }
}
