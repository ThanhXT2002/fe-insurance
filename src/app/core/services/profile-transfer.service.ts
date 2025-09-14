import {
  inject,
  Injectable,
  makeStateKey,
  TransferState,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

const PROFILE_KEY = makeStateKey<any>('APP_PROFILE');

@Injectable({ providedIn: 'root' })
export class ProfileTransferService {
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID) as Object;

  setProfileOnServer(profile: any) {
    if (isPlatformServer(this.platformId) && profile) {
      try {
        this.transferState.set(PROFILE_KEY, profile);
      } catch {
        /* ignore */
      }
    }
  }

  getProfileOnBrowser(): any | null {
    if (
      isPlatformBrowser(this.platformId) &&
      this.transferState.hasKey(PROFILE_KEY)
    ) {
      const p = this.transferState.get(PROFILE_KEY, null as any);
      this.transferState.remove(PROFILE_KEY);
      return p;
    }
    return null;
  }
}
