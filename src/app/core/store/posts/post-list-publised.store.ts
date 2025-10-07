import { BaseStoreSignal } from '@/core/base/base-store-signal';
import { PostItem, PostType } from '@/core/interfaces/post.interface';
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
import { Observable, defer, of, firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface PublishedState {
  items: PostItem[] | null;
  page: number;
  limit: number;
  total: number | null;
}

@Injectable({ providedIn: 'root' })
export class PostListPublisedStore extends BaseStoreSignal<PublishedState> {
  protected getInitialState(): PublishedState {
    return { items: null, page: 1, limit: 4, total: null };
  }

  private readonly postsService = inject(PostsService);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  private _loadPromise: Promise<PostItem[]> | null = null;

  readonly items: Signal<PostItem[] | null> = this.select((s) => s.items);
  readonly page = this.select((s) => s.page);
  readonly limit = this.select((s) => s.limit);
  readonly total = this.select((s) => s.total);

  // Build observable request and normalize to { items, total }
  private publishedRequest$(opts: {
    page?: number;
    limit?: number;
    categoryId?: number;
    postType?: PostType;
  }): Observable<{ items: PostItem[]; total: number | null }> {
    const { page, limit, categoryId, postType } = opts;
    return defer(() =>
      this.postsService
        .getPublishedPosts({ page, limit, categoryId, postType })
        .pipe(
          map((resp: any) => {
            let items: PostItem[] = [];
            let total: number | null = null;
            // Handle different response shapes
            if (Array.isArray(resp)) {
              items = resp as PostItem[];
            } else if (resp && resp.data) {
              // ApiResponse wrapper with data field
              if (Array.isArray(resp.data)) {
                items = resp.data as PostItem[];
              } else if (resp.data.rows && Array.isArray(resp.data.rows)) {
                items = resp.data.rows as PostItem[];
                // Extract pagination info
                if (typeof resp.data.total === 'number')
                  total = resp.data.total;
              } else if (typeof resp.data === 'object' && resp.data.id) {
                items = [resp.data as PostItem];
              }
              // Extract total from response
              if (typeof resp.total === 'number') total = resp.total;
              else if (resp.meta && typeof resp.meta.total === 'number')
                total = resp.meta.total;
            } else if (resp && typeof resp === 'object' && resp.id) {
              items = [resp as PostItem];
              total = 1;
            } else {
              console.warn('Store: Unknown response format!', resp);
            }
            return { items, total };
          }),
          catchError((err) => {
            console.error('Error fetching published posts:', err);
            return of({ items: [] as PostItem[], total: null });
          }),
        ),
    );
  }

  // Public Observable wrapper - no retry here, let fetchWithRetry handle it
  loadPublished$(
    page = 1,
    limit = 4,
    categoryId?: number,
    postType?: PostType,
  ): Observable<{ items: PostItem[]; total: number | null }> {
    return this.publishedRequest$({ page, limit, categoryId, postType });
  }

  // Generic async loader with TransferState, caching and retry
  private async load(
    page: number,
    limit: number,
    categoryId: number | undefined,
    postType: PostType | undefined,
    loadPromise: Promise<PostItem[]> | null,
    setPromise: (p: Promise<PostItem[]> | null) => void,
  ): Promise<PostItem[]> {
    const currentState = this.snapshot();

    // Only use cache if page/limit match and items exist
    const isSamePage = currentState.page === page && currentState.limit === limit;
    if (
      isSamePage &&
      currentState.items &&
      Array.isArray(currentState.items) &&
      currentState.items.length > 0
    ) {
      return currentState.items;
    }

    if (loadPromise) return loadPromise;

    const isBrowser = isPlatformBrowser(this.platformId);
    const keyParts = [
      `posts-published`,
      page,
      limit,
      categoryId ?? 'all',
      postType ?? 'any',
    ];
    const transferStateKey = makeStateKey<any>(keyParts.join('-'));

    if (isBrowser) {
      const serverData = this.transferState.get(transferStateKey, null as any);
      if (
        serverData &&
        Array.isArray(serverData.items) &&
        serverData.items.length > 0
      ) {
        this.set({
          ...this.snapshot(),
          items: serverData.items,
          page,
          limit,
          total: serverData.total ?? null,
        });
        this.transferState.remove(transferStateKey);
        return serverData.items as PostItem[];
      }
    }


    const promise = (async () => {
      try {
        const resPayload = await this.fetchWithRetry<{
          items: PostItem[];
          total: number | null;
        }>(
          async () => {
            const obs = this.loadPublished$(page, limit, categoryId, postType);
            const v = await firstValueFrom(obs);
            return v as any;
          },
          2,
          // Only retry if we get null/undefined response, not empty array (empty is valid)
          (v) => !v || typeof v !== 'object',
        );

        const items = resPayload.items || [];
        const total = resPayload.total ?? null;

        this.set({ ...this.snapshot(), items, page, limit, total });

        if (!isBrowser && items && items.length > 0) {
          this.transferState.set(transferStateKey, { items, total });
        }

        return items;
      } finally {
        setPromise(null);
      }
    })();

    setPromise(promise);
    return promise;
  }

  async loadPublished(
    page = 1,
    limit = 4,
    categoryId?: number,
    postType?: PostType,
  ): Promise<PostItem[]> {
    return this.load(
      page,
      limit,
      categoryId,
      postType,
      this._loadPromise,
      (p) => (this._loadPromise = p),
    );
  }
}
