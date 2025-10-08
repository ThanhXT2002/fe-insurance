import { Injectable, inject, Signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import {
  firstValueFrom,
  timeout,
  defer,
  of,
  throwError,
  timer,
  Observable,
} from 'rxjs';
import { map, mergeMap, catchError, retry } from 'rxjs/operators';
import { BaseStoreSignal } from '../../base/base-store-signal';
import { PostsService } from '../../services/api/posts.service';
import { PostItem, PostType } from '@/core/interfaces/post.interface';

interface PostRelatedState {
  items: PostItem[] | null;
}

@Injectable({ providedIn: 'root' })
export class PostRelatedStore extends BaseStoreSignal<PostRelatedState> {
  protected getInitialState(): PostRelatedState {
    return { items: null };
  }

  private readonly postsService = inject(PostsService);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private _loadPromise: Promise<PostItem[]> | null = null;

  readonly items: Signal<PostItem[] | null> = this.select((s) => s.items);

  get list() {
    return this.select((s) => s.items ?? []);
  }

  // Generic Observable-based request that fetches related posts
  private relatedPostsRequest$(query: {
    postId: number;
    limit: number;
    categoryId: number;
    postType?: PostType;
  }) {
    return defer(() =>
      this.postsService.getRelatedPosts(query).pipe(
        timeout(5000),
        map((resp: any) => {
          if (Array.isArray(resp)) return resp as PostItem[];
          if (resp && Array.isArray(resp.data)) return resp.data as PostItem[];
          return [] as PostItem[];
        }),
        catchError(() => of([] as PostItem[])),
      ),
    );
  }

  // Generic Observable method with retry logic
  private loadRelatedPosts$(query: {
    postId: number;
    limit: number;
    categoryId: number;
    postType?: PostType;
  }) {
    const maxRetries = 2;
    return this.relatedPostsRequest$(query).pipe(
      mergeMap((arr) => {
        // If empty, throw to trigger retry; otherwise emit the array
        if (!arr || (Array.isArray(arr) && arr.length === 0))
          return throwError(() => new Error('EMPTY_RESULT'));
        return of(arr);
      }),
      // Use modern retry with config (count + delay) instead of deprecated retryWhen
      retry({ count: maxRetries, delay: () => timer(300) }),
      catchError(() => of([] as PostItem[])),
    );
  }

  // Load related posts with caching and TransferState support
  async loadRelatedPosts(query: {
    postId: number;
    limit: number;
    categoryId: number;
    postType?: PostType;
  }): Promise<PostItem[]> {
    const currentItems = this.snapshot().items;

    // Return cached items if available
    if (currentItems && Array.isArray(currentItems) && currentItems.length > 0)
      return currentItems;

    // Return existing promise if already loading
    if (this._loadPromise) return this._loadPromise;

    const isBrowser = isPlatformBrowser(this.platformId);
    const stateKey = `posts-related-${query.postId}-${query.categoryId}-${query.limit}-${query.postType || 'all'}`;
    const transferStateKey = makeStateKey<PostItem[]>(stateKey);

    // CLIENT: Check TransferState first
    if (isBrowser) {
      const serverData = this.transferState.get(transferStateKey, null);
      if (serverData && Array.isArray(serverData) && serverData.length > 0) {
        this.set({ ...this.snapshot(), items: serverData });
        this.transferState.remove(transferStateKey);
        return serverData;
      }
    }

    const fetcher = async (): Promise<PostItem[]> => {
      try {
        const resp = await firstValueFrom(this.loadRelatedPosts$(query));
        return (resp as PostItem[]) || [];
      } catch (err) {
        return [];
      }
    };

    const promise = (async () => {
      try {
        const res = await this.fetchWithRetry<PostItem[]>(
          fetcher,
          2,
          (v) => !v || (Array.isArray(v) && v.length === 0),
        );

        this.set({ ...this.snapshot(), items: res });

        // SERVER: Save to TransferState
        if (!isBrowser && res && res.length > 0) {
          this.transferState.set(transferStateKey, res);
        }

        return res;
      } finally {
        this._loadPromise = null;
      }
    })();

    this._loadPromise = promise;
    return promise;
  }
}
