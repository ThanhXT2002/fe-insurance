import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsSerive } from './products';
import { ProductItem } from '../interfaces/product.interface';
import { ProductStatus } from '../interfaces/product.interface';

describe('ProductsSerive', () => {
  let service: ProductsSerive;
  let httpMock: HttpTestingController;

  const mockProducts: ProductItem[] = [
    { id: 1, slug: 'a', icon: '', imgs: [], name: 'A', description: '', detail: '', isPublish: true, status: ProductStatus.active, createdAt: '', updatedAt: '', priority: 1, tags: [], isPromotion: false, features: [], createdBy: '', updatedBy: '' },
    { id: 2, slug: 'b', icon: '', imgs: [], name: 'B', description: '', detail: '', isPublish: true, status: ProductStatus.active, createdAt: '', updatedAt: '', priority: 2, tags: [], isPromotion: false, features: [], createdBy: '', updatedBy: '' },
    { id: 3, slug: 'c', icon: '', imgs: [], name: 'C', description: '', detail: '', isPublish: true, status: ProductStatus.active, createdAt: '', updatedAt: '', priority: 3, tags: [], isPromotion: false, features: [], createdBy: '', updatedBy: '' },
    { id: 4, slug: 'd', icon: '', imgs: [], name: 'D', description: '', detail: '', isPublish: true, status: ProductStatus.active, createdAt: '', updatedAt: '', priority: 4, tags: [], isPromotion: false, features: [], createdBy: '', updatedBy: '' },
    { id: 5, slug: 'e', icon: '', imgs: [], name: 'E', description: '', detail: '', isPublish: true, status: ProductStatus.active, createdAt: '', updatedAt: '', priority: 5, tags: [], isPromotion: false, features: [], createdBy: '', updatedBy: '' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsSerive]
    });
    service = TestBed.inject(ProductsSerive);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products and update signal', () => {
    service.fetchProducts();
    const req = httpMock.expectOne('assets/json/products.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
    expect(service.products()).toEqual(mockProducts);
  });

  it('should return top 4 products sorted by priority', () => {
    service['productsSignal'].set(mockProducts);
    const top4 = service.top4Products();
    expect(top4.length).toBe(4);
    expect(top4[0].priority).toBe(1);
    expect(top4[3].priority).toBe(4);
  });

  it('should return empty array for top4Products if products is null', () => {
    service['productsSignal'].set(null);
    expect(service.top4Products()).toEqual([]);
  });

  it('should refresh and update products', () => {
    service.refresh();
    const req = httpMock.expectOne('assets/json/products.json');
    req.flush(mockProducts);
    expect(service.products()).toEqual(mockProducts);
  });

  it('should return observable from getProductLists$', (done) => {
    service.getProductLists$().subscribe((data) => {
      expect(data).toEqual(mockProducts);
      done();
    });
    const req = httpMock.expectOne('assets/json/products.json');
    req.flush(mockProducts);
  });

  it('should set productsSignal to [] on fetch error', () => {
    service.fetchProducts();
    const req = httpMock.expectOne('assets/json/products.json');
    req.error(new ErrorEvent('Network error'));
    expect(service.products()).toEqual([]);
  });
});
