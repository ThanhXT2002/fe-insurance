import { BaseStoreSignal } from '@/core/base/base-store-signal';
import { PostItem } from '@/core/interfaces/post.interface';
import { Injectable, inject, Signal } from '@angular/core';
import { PostsService } from '@/core/services/api/posts.service';
import { firstValueFrom } from 'rxjs';

interface PostDetailEntry {
  data: PostItem | null;
  fetchedAt: number;
  accessingAt: number;
}

interface PostDetailState {
  entries: Record<string, PostDetailEntry>;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 50;

@Injectable({ providedIn: 'root' })
export class PostDetailStore extends BaseStoreSignal<PostDetailState> {
  protected getInitialState(): PostDetailState {
    return { entries: {} };
  }

  private readonly postsService = inject(PostsService);
  private _inFlight: Record<string, Promise<PostItem | null> | null> = {};
  private ttl = DEFAULT_TTL_MS;
  private maxEntries = DEFAULT_MAX_ENTRIES;

  configure(opts: { ttlMs?: number; maxEntries?: number }) {
    if (opts.ttlMs != null) this.ttl = opts.ttlMs;
    if (opts.maxEntries != null) this.maxEntries = opts.maxEntries;
  }

  private getEntry(slug: string): PostDetailEntry | null {
    const e = this.snapshot().entries[slug];
    if (!e) return null;
    const now = Date.now();
    if (this.ttl > 0 && now - e.fetchedAt > this.ttl) {
      this.delete(slug);
      return null;
    }
    e.accessingAt = now;
    this.patch({ entries: { ...this.snapshot().entries, [slug]: e } });
    return e;
  }

  get(slug: string): PostItem | null {
    const e = this.getEntry(slug);
    return e ? e.data : null;
  }

  getSignal(slug: string): Signal<PostItem | null> {
    return this.select((s) => s.entries[slug]?.data ?? null);
  }

  async load(slug: string): Promise<PostItem | null> {
    if (!slug) return null;
    const cached = this.get(slug);
    if (cached) return cached;

    if (this._inFlight[slug])
      return this._inFlight[slug] as Promise<PostItem | null>;

    const p = (async () => {
      try {
        const resp = await firstValueFrom(
          this.postsService.getPostBySlug(slug),
        );

        const payload: any = resp;
        const data: PostItem | null =
          payload && payload.status && payload.data ? payload.data : null;

        this.setEntry(slug, data);
        return data;
      } catch (err) {
        return null;
      } finally {
        this._inFlight[slug] = null;
      }
    })();

    this._inFlight[slug] = p;
    return p;
  }

  async refresh(slug: string): Promise<PostItem | null> {
    this.delete(slug);
    return this.load(slug);
  }

  delete(slug: string) {
    const entries = { ...this.snapshot().entries };
    if (entries[slug]) {
      delete entries[slug];
      this.patch({ entries });
    }
  }

  clearAll() {
    this.set({ entries: {} });
  }

  setData(slug: string, data: PostItem | null) {
    this.setEntry(slug, data);
  }

  private setEntry(slug: string, data: PostItem | null) {
    const now = Date.now();
    const entry: PostDetailEntry = {
      data,
      fetchedAt: now,
      accessingAt: now,
    };
    const entries = { ...this.snapshot().entries, [slug]: entry };
    this.patch({ entries });
    this.enforceMaxEntries(entries);
  }

  private enforceMaxEntries(entriesObj: Record<string, PostDetailEntry>) {
    const keys = Object.keys(entriesObj);
    if (keys.length <= this.maxEntries) return;
    const sorted = keys.sort(
      (a, b) => entriesObj[a].accessingAt - entriesObj[b].accessingAt,
    );
    const toRemove = sorted.slice(0, keys.length - this.maxEntries);
    if (toRemove.length === 0) return;
    const newEntries = { ...entriesObj };
    for (const k of toRemove) delete newEntries[k];
    this.set({ entries: newEntries });
  }
}
