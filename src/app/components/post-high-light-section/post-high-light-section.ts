import { PostListFeaturedStore } from '@/core/store/posts/post-list-featured.store';
import { TimeFormatHelper } from '@/core/utils/time-format.helper';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, ViewChild, signal } from '@angular/core';
import { ItemPost } from '../item-post/item-post';
import { CustomCarousel } from '../custom-carousel/custom-carousel';
import { PostItemSkeleton } from '../post-item-skeleton/post-item-skeleton';
import { RouterLink } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-post-high-light-section',
  imports: [
    CommonModule,
    ItemPost,
    CustomCarousel,
    PostItemSkeleton,
    RouterLink,
  ],
  templateUrl: './post-high-light-section.html',
  styleUrl: './post-high-light-section.scss',
})
export class PostHighLightSection {
  @ViewChild('carousel') carousel?: CustomCarousel;
  private readonly postStore = inject(PostListFeaturedStore);
  private breakpointObserver = inject(BreakpointObserver);
  readonly timeFormatHelper = new TimeFormatHelper();

  readonly highlightPosts = computed(() => this.postStore.listHighLight());
  readonly loading = this.postStore.loading;

  skeletonArray = Array(3);

  // Signal để theo dõi loại màn hình
  isTablet = signal(false);

  // Computed signal để tính toán slice range cho bottom posts
  readonly bottomPostsSlice = computed(() => {
    const posts = this.highlightPosts();
    if (!posts) return [];

    // Nếu là tablet (md): lấy từ index 4-8 (4 bài viết)
    // Nếu là mobile hoặc desktop: lấy từ index 5-8 (3 bài viết)
    const startIndex = this.isTablet() ? 4 : 5;
    return posts.slice(startIndex, 8);
  });

  constructor() {
    // Theo dõi breakpoint cho tablet (md: 768px - 1023px)
    this.breakpointObserver
      .observe(['(min-width: 768px) and (max-width: 1023px)'])
      .subscribe((screenSize) => {
        this.isTablet.set(screenSize.matches);
      });

    Promise.resolve().then(() => {
      this.postStore
        .loadPostHighlight(8)
        .then(() => {
          console.log(this.highlightPosts());
        })
        .catch(() => {
          console.error('Failed to load highlighted posts');
        });
    });
  }
}
