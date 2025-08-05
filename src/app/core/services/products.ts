import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductItem } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // Signal lưu trữ toàn bộ danh sách sản phẩm
  private readonly productsSignal = signal<ProductItem[] | null>(null);

  // Signal lấy 4 sản phẩm đầu tiên (ưu tiên theo priority tăng dần)
  readonly top4Products = computed(() => {
    const products = this.productsSignal();
    return products ? [...products].sort((a, b) => a.priority - b.priority).slice(0, 4) : [];
  });

  constructor(private http: HttpClient) {
    this.fetchProducts(); // Tự động gọi fetchProducts khi khởi tạo service
  }

  /**
   * Lấy danh sách sản phẩm từ file json và lưu vào signal
   */
  fetchProducts(): void {
    this.http.get<ProductItem[]>('assets/json/products.json').subscribe({
      next: (data) => this.productsSignal.set(data),
      error: () => this.productsSignal.set([])
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

  /**
   * Làm mới lại dữ liệu sản phẩm (gọi lại API)
   */
  refresh(): void {
    this.fetchProducts();
  }
}
