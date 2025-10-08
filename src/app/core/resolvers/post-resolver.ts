import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ResolveFn,
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import { PostDetailStore } from '../store/posts/post-detail.store';
import { catchError, of, from, timeout, tap } from 'rxjs';
import { PostItem } from '../interfaces/post.interface';

/**
 * Post resolver với TransferState cho SSR optimization
 */
export const postResolver: ResolveFn<PostItem | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const store = inject(PostDetailStore);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const slug = route.paramMap.get('slug') || '';

  if (!slug) {
    return of(null);
  }

  // 1. Kiểm tra cache trước
  const cached = store.getSignal(slug)();
  if (cached) {
    return of(cached);
  }

  const transferState = inject(TransferState);
  const stateKey = makeStateKey<PostItem | null>(`post-${slug}`);

  // 2. CLIENT: Kiểm tra TransferState
  if (isBrowser) {
    const serverData = transferState.get(stateKey, null);
    if (serverData) {
      store.setData(slug, serverData);
      transferState.remove(stateKey);
      return of(serverData);
    }
    return of(null);
  }
  // 3. SERVER: Load và lưu vào TransferState
  return from(store.load(slug)).pipe(
    timeout(1500),
    tap((data) => {
      if (data) transferState.set(stateKey, data);
    }),
    catchError(() => of(null)),
  );
};

@Injectable({ providedIn: 'root' })
export class PostResolver implements Resolve<PostItem | null> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return postResolver(route, state);
  }
}
