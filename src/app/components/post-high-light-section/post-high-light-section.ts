import { PostListFeaturedStore } from '@/core/store/posts/post-list-featured.store';
import { TimeFormatHelper } from '@/core/utils/time-format.helper';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, ViewChild } from '@angular/core';
import { ItemPost } from '../item-post/item-post';
import { CustomCarousel } from '../custom-carousel/custom-carousel';
import { PostItemSkeleton } from "../post-item-skeleton/post-item-skeleton";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-high-light-section',
  imports: [CommonModule, ItemPost, CustomCarousel, PostItemSkeleton, RouterLink],
  templateUrl: './post-high-light-section.html',
  styleUrl: './post-high-light-section.scss',
})
export class PostHighLightSection {
  @ViewChild('carousel') carousel?: CustomCarousel;
  private readonly postStore = inject(PostListFeaturedStore);
  readonly timeFormatHelper = new TimeFormatHelper();

  readonly highlightPosts = computed(() => this.postStore.listHighLight());
  readonly loading = this.postStore.loading;

  skeletonArray = Array(3);

  constructor() {
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
