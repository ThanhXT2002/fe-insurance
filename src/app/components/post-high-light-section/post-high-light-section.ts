import { PostListFeaturedStore } from '@/core/store/posts/post-list-featured.store';
import { TimeFormatHelper } from '@/core/utils/time-format.helper';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ItemPost } from "../item-post/item-post";
@Component({
  selector: 'app-post-high-light-section',
  imports: [CarouselModule, CommonModule, ItemPost],
  templateUrl: './post-high-light-section.html',
  styleUrl: './post-high-light-section.scss',
})
export class PostHighLightSection {
  private readonly postStore = inject(PostListFeaturedStore);
  readonly timeFormatHelper = new TimeFormatHelper();

  readonly highlightPosts = computed(() => this.postStore.listHighLight());

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

  getColorCategory(id: number) {
    switch (id) {
      case 1:
        return 'text-red-500';
      case 2:
        return 'text-blue-500';
      case 3:
        return 'text-green-500';
      case 4:
        return 'text-yellow-500';
      case 5:
        return 'text-purple-500';
      case 6:
        return 'text-pink-500';
      case 7:
        return 'text-indigo-500';
      case 8:
        return 'text-teal-500';
      case 9:
        return 'text-cyan-500';
      case 10:
        return 'text-orange-500';
      case 11:
        return 'text-lime-500';
      case 12:
        return 'text-emerald-500';
      case 13:
        return 'text-sky-500';
      case 14:
        return 'text-violet-500';
      case 15:
        return 'text-rose-500';
      case 16:
        return 'text-amber-500';
      case 17:
        return 'text-fuchsia-500';
      case 18:
        return 'text-neutral-500';
      case 19:
        return 'text-slate-500';
      case 20:
        return 'text-zinc-500';
      case 21:
        return 'text-stone-500';
      case 22:
        return 'text-gray-500';
      case 23:
        return 'text-red-400';
      case 24:
        return 'text-blue-400';
      case 25:
        return 'text-green-400';
      case 26:
        return 'text-yellow-400';
      case 27:
        return 'text-purple-400';
      case 28:
        return 'text-pink-400';
      case 29:
        return 'text-teal-400';
      case 30:
        return 'text-orange-400';
      case 31:
        return 'text-lime-400';
      case 32:
        return 'text-emerald-400';
      case 33:
        return 'text-sky-400';
      case 34:
        return 'text-violet-400';
      case 35:
        return 'text-rose-400';
      case 36:
        return 'text-amber-400';
      case 37:
        return 'text-fuchsia-400';
      case 38:
        return 'text-neutral-400';
      case 39:
        return 'text-slate-400';
      case 40:
        return 'text-zinc-400';
      case 41:
        return 'text-stone-400';
      case 42:
        return 'text-gray-400';
      case 43:
        return 'text-cyan-400';
      case 44:
        return 'text-indigo-400';
      default:
        return 'text-secondary';
    }
  }
}
