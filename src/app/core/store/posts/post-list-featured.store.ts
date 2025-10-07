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

interface PostHomeState {
  items: PostItem[] | null;
  itemsHighLight: PostItem[] | null;
}

@Injectable({ providedIn: 'root' })
export class PostListFeaturedStore extends BaseStoreSignal<PostHomeState> {
  protected getInitialState(): PostHomeState {
    return { items: null, itemsHighLight: null };
  }

  private readonly postsService = inject(PostsService);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private _loadPromise: Promise<PostItem[]> | null = null;
  private _loadHighLightPromise: Promise<PostItem[]> | null = null;

  readonly items: Signal<PostItem[] | null> = this.select((s) => s.items);
  readonly itemsHighLight: Signal<PostItem[] | null> = this.select(
    (s) => s.itemsHighLight,
  );

  get list() {
    return this.select((s) => s.items ?? []);
  }

  get listHighLight() {
    return this.select((s) => s.itemsHighLight ?? []);
  }

  // Generic Observable-based request that fetches posts and normalizes the payload to PostItem[]
  private postsRequest$(
    limit: number,
    query: { isFeatured?: boolean; isHighlighted?: boolean },
  ) {
    return defer(() =>
      this.postsService.getFeaturedPosts({ limit, ...query }).pipe(
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
  private loadPosts$(
    limit: number,
    query: { isFeatured?: boolean; isHighlighted?: boolean },
  ) {
    const maxRetries = 2;
    return this.postsRequest$(limit, query).pipe(
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

  // Public Observable version of loadHome with retry when result is empty
  loadHome$(limit = 3) {
    return this.loadPosts$(limit, { isFeatured: true });
  }

  // Public Observable version of loadPostHighLight with retry when result is empty
  loadPostHighLight$(limit = 8) {
    return this.loadPosts$(limit, { isHighlighted: true });
  }

  // Generic method to load posts
  private async loadPosts(
    limit: number,
    stateKey: string,
    currentItems: PostItem[] | null,
    loadPromise: Promise<PostItem[]> | null,
    observable$: () => Observable<PostItem[]>,
    setPromise: (promise: Promise<PostItem[]> | null) => void,
    updateState: (items: PostItem[]) => void,
  ): Promise<PostItem[]> {
    if (currentItems && Array.isArray(currentItems) && currentItems.length > 0)
      return currentItems;

    if (loadPromise) return loadPromise;

    const isBrowser = isPlatformBrowser(this.platformId);
    const transferStateKey = makeStateKey<PostItem[]>(stateKey);

    // CLIENT: Kiểm tra TransferState trước
    if (isBrowser) {
      const serverData = this.transferState.get(transferStateKey, null);
      if (serverData && Array.isArray(serverData) && serverData.length > 0) {
        updateState(serverData);
        this.transferState.remove(transferStateKey);
        return serverData;
      }
    }

    const fetcher = async (): Promise<PostItem[]> => {
      try {
        const resp = await firstValueFrom(observable$());
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

        updateState(res);

        // SERVER: Lưu vào TransferState
        if (!isBrowser && res && res.length > 0) {
          this.transferState.set(transferStateKey, res);
        }

        return res;
      } finally {
        setPromise(null);
      }
    })();

    setPromise(promise);
    return promise;
  }

  async loadHome(limit = 3) {
    return this.loadPosts(
      limit,
      `posts-home-${limit}`,
      this.snapshot().items,
      this._loadPromise,
      () => this.loadHome$(limit),
      (promise) => (this._loadPromise = promise),
      (items) => this.set({ ...this.snapshot(), items }),
    );
  }

  async loadPostHighlight(limit = 5) {
    return this.loadPosts(
      limit,
      `posts-highlight-${limit}`,
      this.snapshot().itemsHighLight,
      this._loadHighLightPromise,
      () => this.loadPostHighLight$(limit),
      (promise) => (this._loadHighLightPromise = promise),
      (items) => this.set({ ...this.snapshot(), itemsHighLight: items }),
    );
  }
}
