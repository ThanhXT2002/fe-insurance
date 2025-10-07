import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PostListPublisedStore } from '@/core/store/posts/post-list-publised.store';
import { ItemPost } from '../item-post/item-post';
import { PostItemSkeleton } from '../post-item-skeleton/post-item-skeleton';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-post-new-section',
  standalone: true,
  imports: [CommonModule, ItemPost, PostItemSkeleton, PaginatorModule],
  templateUrl: './post-new-section.html',
  styleUrl: './post-new-section.scss',
})
export class PostNewSection implements OnInit, AfterViewInit {
  private readonly store = inject(PostListPublisedStore);
  private readonly platformId = inject(PLATFORM_ID);

  // expose loading signal from store
  readonly loading = this.store.loading;

  // posts as plain array via computed
  readonly posts = computed(() => this.store.items() ?? []);

  // pagination data from store
  readonly total = this.store.total;
  readonly currentPage = this.store.page;
  readonly limit = this.store.limit;

  // paginator first index (0-based)
  readonly first = computed(() => {
    const page = this.currentPage();
    const rows = this.limit();
    return (page - 1) * rows;
  });

  // simple skeleton count
  readonly skeletonArray = signal(Array.from({ length: 4 }));

  ngOnInit(): void {
    // nothing heavy in ngOnInit
  }

  ngAfterViewInit(): void {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) return;

    // Check if we already have data in store (from previous visit)
    const hasExistingData = this.posts().length > 0 && this.currentPage() > 0;

    if (hasExistingData) {
      // Already have data from cache, don't reload
      console.log(
        'PostNewSection: Using cached data, page:',
        this.currentPage(),
      );
      return;
    }

    // No cached data, load initial page
    this.loadClientData();
  }

  private async loadClientData(page?: number, limit?: number) {
    // Use store's current values if not provided
    const targetPage = page ?? this.currentPage() ?? 1;
    const targetLimit = limit ?? this.limit() ?? 4;

    try {
      await this.store.loadPublished(targetPage, targetLimit);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (msg.includes('Empty result')) {
        console.warn('No published posts available (client)', msg);
      } else {
        console.error('Failed to load published posts (client)', err);
      }
    }
  }

  onPageChange(event: any) {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) return;

    // event.page is 0-based, convert to 1-based for API
    const page = event.page + 1;
    const limit = event.rows;

    // Clear current items to show loading state
    this.store.set({ ...this.store.snapshot(), items: null });

    // Load new page
    this.loadClientData(page, limit);
  }
}
