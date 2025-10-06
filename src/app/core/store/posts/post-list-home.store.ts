import { BaseStoreSignal } from '@/core/base/base-store-signal';
import { PostItem } from '@/core/interfaces/post.interface';
import {
  Injectable,
  inject,
  Signal,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { PostsService } from '@/core/services/api/posts.service';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom, timeout, defer, of, throwError, timer } from 'rxjs';
import { map, mergeMap, catchError, retry } from 'rxjs/operators';

interface PostHomeState {
  items: PostItem[] | null;
}

@Injectable({ providedIn: 'root' })
export class PostListHomeStore extends BaseStoreSignal<PostHomeState> {
  protected getInitialState(): PostHomeState {
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

  // Observable-based request that fetches featured posts and normalizes the payload to PostItem[]
  private featuredPostsRequest$(limit: number) {
    return defer(() =>
      this.postsService.getFeaturedPosts({ limit, isFeatured: true }).pipe(
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

  // Public Observable version of loadHome with retry when result is empty
  loadHome$(limit = 3) {
    const maxRetries = 2;
    return this.featuredPostsRequest$(limit).pipe(
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

  async loadHome(limit = 3) {
    const current = this.snapshot().items;
    if (current && Array.isArray(current) && current.length > 0) return current;

    if (this._loadPromise) return this._loadPromise;

    const isBrowser = isPlatformBrowser(this.platformId);
    const stateKey = makeStateKey<PostItem[]>(`posts-home-${limit}`);

    // CLIENT: Kiểm tra TransferState trước
    if (isBrowser) {
      const serverData = this.transferState.get(stateKey, null);
      if (serverData && Array.isArray(serverData) && serverData.length > 0) {
        this.set({ items: serverData });
        this.transferState.remove(stateKey);
        return serverData;
      }
    }

    const fetcher = async (): Promise<PostItem[]> => {
      try {
        // Use Observable-based loader under the hood
        const resp = await firstValueFrom(this.loadHome$(limit));
        return resp ?? [];
      } catch (err) {
        return [];
      }
    };

    this._loadPromise = (async () => {
      try {
        const res = await this.fetchWithRetry<PostItem[]>(
          fetcher,
          2,
          (v) => !v || (Array.isArray(v) && v.length === 0),
        );

        this.set({ items: res });

        // SERVER: Lưu vào TransferState
        if (!isBrowser && res && res.length > 0) {
          this.transferState.set(stateKey, res);
        }

        return res;
      } finally {
        this._loadPromise = null;
      }
    })();

    return this._loadPromise;
  }
}
