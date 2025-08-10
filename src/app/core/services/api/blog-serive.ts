import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogPost } from '../../interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  // Signal lưu trữ toàn bộ danh sách blog posts
  private readonly blogPostsSignal = signal<BlogPost[] | null>(null);

  // Signal lấy 6 bài viết mới nhất (sắp xếp theo published_at giảm dần)
  readonly latestPosts = computed(() => {
    const posts = this.blogPostsSignal();
    return posts
      ? [...posts].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()).slice(0, 6)
      : [];
  });

  // Signal lấy 3 bài viết nổi bật (có thể dựa trên tags hoặc criteria khác)
  readonly featuredPosts = computed(() => {
    const posts = this.blogPostsSignal();
    return posts
      ? [...posts].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()).slice(0, 3)
      : [];
  });

  constructor(private http: HttpClient) {
    this.fetchBlogPosts(); // Tự động gọi fetchBlogPosts khi khởi tạo service
  }

  /**
   * Lấy danh sách blog posts từ file json và lưu vào signal
   */
  fetchBlogPosts(): void {
    this.http.get<BlogPost[]>('assets/json/post-new.json').subscribe({
      next: (data) => this.blogPostsSignal.set(data),
      error: () => this.blogPostsSignal.set([])
    });
  }

  /**
   * Trả về signal chứa toàn bộ danh sách blog posts
   */
  get blogPosts() {
    return this.blogPostsSignal;
  }

  /**
   * Trả về observable danh sách blog posts (nếu cần dùng dạng observable)
   */
  getBlogPosts$(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>('assets/json/post-new.json');
  }

  /**
   * Tìm blog post theo slug
   */
  getPostBySlug(slug: string): BlogPost | undefined {
    const posts = this.blogPostsSignal();
    return posts?.find(post => post.slug === slug);
  }

  /**
   * Tìm blog posts theo tag
   */
  getPostsByTag = computed(() => {
    return (tag: string): BlogPost[] => {
      const posts = this.blogPostsSignal();
      return posts ? posts.filter(post => post.tags.includes(tag)) : [];
    };
  });

  /**
   * Tìm blog posts theo tác giả
   */
  getPostsByAuthor = computed(() => {
    return (author: string): BlogPost[] => {
      const posts = this.blogPostsSignal();
      return posts ? posts.filter(post => post.author === author) : [];
    };
  });

  /**
   * Tìm kiếm blog posts theo từ khóa (title, excerpt, content)
   */
  searchPosts = computed(() => {
    return (keyword: string): BlogPost[] => {
      const posts = this.blogPostsSignal();
      if (!posts || !keyword.trim()) return [];

      const searchTerm = keyword.toLowerCase().trim();
      return posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    };
  });

  /**
   * Lấy các tags duy nhất từ tất cả blog posts
   */
  readonly allTags = computed(() => {
    const posts = this.blogPostsSignal();
    if (!posts) return [];

    const tagSet = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  });

  /**
   * Lấy các tác giả duy nhất từ tất cả blog posts
   */
  readonly allAuthors = computed(() => {
    const posts = this.blogPostsSignal();
    if (!posts) return [];

    const authorSet = new Set<string>();
    posts.forEach(post => authorSet.add(post.author));
    return Array.from(authorSet).sort();
  });

  /**
   * Làm mới lại dữ liệu blog posts (gọi lại API)
   */
  refresh(): void {
    this.fetchBlogPosts();
  }
}
