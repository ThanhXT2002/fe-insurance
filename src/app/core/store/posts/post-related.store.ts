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

  // Load related posts - CLIENT SIDE ONLY (no caching, no TransferState)
  async loadRelatedPosts(query: {
    postId: number;
    limit: number;
    categoryId: number;
  }): Promise<PostItem[]> {
    const isBrowser = isPlatformBrowser(this.platformId);

    // Only run on client side
    if (!isBrowser) {
      return [];
    }

    // Return existing promise if already loading
    if (this._loadPromise) return this._loadPromise;

    const fetcher = async (): Promise<PostItem[]> => {
      try {
        const resp = await firstValueFrom(this.loadRelatedPosts$(query));
        return (resp as PostItem[]) || [];
      } catch (err) {
        console.error('Error fetching related posts:', err);
        return [];
      }
    };

    const promise = (async () => {
      try {
        const res = await fetcher();
        this.set({ ...this.snapshot(), items: res });
        return res;
      } finally {
        this._loadPromise = null;
      }
    })();

    this._loadPromise = promise;
    return promise;
  }
}
