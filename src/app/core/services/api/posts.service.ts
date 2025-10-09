import { ApiResponse } from '@/core/interfaces/api-response.interface';
import { PostItem, PostType } from '@/core/interfaces/post.interface';
import { ProductItem } from '@/core/interfaces/product.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private http = inject(HttpClient);

  apiUrl = environment.apiUrl + '/posts';

  // lấy danh sách bài viết nổi bật -  dành cho trang chủ
  getFeaturedPosts(query?: {
    limit?: number;
    isFeatured?: boolean;
    isHighlighted?: boolean;
  }): Observable<ApiResponse<PostItem[]>> {
    const params: any = {};
    if (query?.limit != null) params.limit = query.limit;
    if (query?.isFeatured !== undefined && query?.isFeatured !== null)
      params.isFeatured = String(query.isFeatured);
    if (query?.isHighlighted !== undefined && query?.isHighlighted !== null)
      params.isHighlighted = String(query.isHighlighted);

    return this.http.get<ApiResponse<PostItem[]>>(`${this.apiUrl}/featured`, {
      params,
    });
  }

  // lấy danh sách bài viết đã xuất bản
  getPublishedPosts(query?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    postType?: PostType;
  }): Observable<ApiResponse<PostItem[]>> {
    const params: any = {};
    if (query?.page != null) params.page = query.page;
    if (query?.limit != null) params.limit = query.limit;
    if (query?.categoryId != null) params.categoryId = query.categoryId;
    if (query?.postType != null) params.postType = query.postType;

    return this.http.get<ApiResponse<PostItem[]>>(`${this.apiUrl}/published`, {
      params,
    });
  }

  // lấy chi tiết bài viết theo slug
  getPostBySlug(slug: string): Observable<ApiResponse<PostItem>> {
    return this.http.get<ApiResponse<PostItem>>(`${this.apiUrl}/slug/${slug}`);
  }

  // lấy danh sách bài biết liên quan
  getRelatedPosts(query: {
    postId: number;
    limit: number;
    categoryId?: number;
    postType?: PostType;
  }): Observable<ApiResponse<PostItem[]>> {
    const params: any = {};
    if (query?.limit != null) params.limit = query.limit;
    if (query?.categoryId != null) params.categoryId = query.categoryId;
    if (query?.postType != null) params.postType = query.postType;

    // Endpoint format: /posts/{postId}/related?limit=6&categoryId=x
    return this.http.get<ApiResponse<PostItem[]>>(
      `${this.apiUrl}/${query.postId}/related`,
      { params },
    );
  }
}
