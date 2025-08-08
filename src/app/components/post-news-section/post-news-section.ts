import { Component, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionIntro } from "../section-intro/section-intro";
import { BlogService } from '../../core/services/blog-serive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-news-section',
  imports: [SectionIntro, CommonModule, RouterLink],
  templateUrl: './post-news-section.html',
  styleUrl: './post-news-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostNewsSection {
  private readonly blogSrv = inject(BlogService);


  // Expose featured posts as a getter for template
  readonly featuredPosts = this.blogSrv.featuredPosts;

  constructor() {
    // Sử dụng effect để theo dõi thay đổi
    effect(() => {
      const posts = this.featuredPosts();
      if (posts.length > 0) {
      }
    });
  }


  /**
   * Truncate text to specified length
   */
  truncateText(text: string, maxLength: number = 150): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Format date to Vietnamese locale
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
