import { Component, inject, ChangeDetectionStrategy, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionIntro } from "../section-intro/section-intro";
import { BlogService } from '../../core/services/api/blog-serive';
import { ItemPost } from '../item-post/item-post';
import { PostListFeaturedStore } from '@/core/store/posts/post-list-featured.store';

@Component({
  selector: 'app-post-news-section',
  imports: [SectionIntro, CommonModule, RouterLink, ItemPost],
  templateUrl: './post-news-section.html',
  styleUrl: './post-news-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostNewsSection {

  private readonly postStore = inject(PostListFeaturedStore);

  // Expose featured posts as a getter for template
  readonly featuredPosts = computed(() => this.postStore.list());

  constructor() {
    Promise.resolve().then(() => {
      this.postStore.loadHome(3).catch(() => {
        // lỗi load thì cứ để store hiển thị fallback empty list
      });
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
