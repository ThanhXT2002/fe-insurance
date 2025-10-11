import { Injectable, PLATFORM_ID, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

export interface ScrollPosition {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class ScrollRestorationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  private scrollPositions = new Map<string, ScrollPosition>();
  private isPopStateNavigation = false;
  private currentUrl = '';
  private previousUrl = '';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeScrollRestoration();
    }
  }

  private initializeScrollRestoration(): void {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Track navigation start to determine if it's a popstate event
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        // Save current scroll position before navigation
        this.saveScrollPosition(this.currentUrl);
      });

    // Listen to navigation end
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        pairwise(),
      )
      .subscribe(([prev, curr]: [NavigationEnd, NavigationEnd]) => {
        this.previousUrl = prev?.url || '';
        this.currentUrl = curr.url;

        if (this.isPopStateNavigation) {
          // Browser back/forward - restore scroll position
          this.restoreScrollPosition(curr.url);
          this.isPopStateNavigation = false;
        } else {
          // Router navigation - scroll to top
          this.scrollToTop();
        }
      });

    // Handle first navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (!this.currentUrl) {
          this.currentUrl = event.url;
          this.scrollToTop(); // Always start at top
        }
      });

    // Listen to popstate (browser back/forward)
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('popstate', () => {
        this.ngZone.run(() => {
          this.isPopStateNavigation = true;
        });
      });
    });

    // Save scroll position before unload
    window.addEventListener('beforeunload', () => {
      this.saveScrollPosition(this.currentUrl);
    });

    // Save scroll position periodically while user scrolls
    let scrollTimer: number;
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          this.ngZone.run(() => {
            this.saveScrollPosition(this.currentUrl);
          });
        }, 150);
      });
    });
  }

  private saveScrollPosition(url: string): void {
    if (!url || !isPlatformBrowser(this.platformId)) return;

    const position: ScrollPosition = {
      x: window.scrollX || window.pageXOffset || 0,
      y: window.scrollY || window.pageYOffset || 0,
    };

    this.scrollPositions.set(url, position);

    // Also save to sessionStorage as backup
    try {
      sessionStorage.setItem(`scroll_${url}`, JSON.stringify(position));
    } catch (e) {
      console.warn('Could not save scroll position to sessionStorage:', e);
    }
  }

  private restoreScrollPosition(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let position = this.scrollPositions.get(url);

    // Try to get from sessionStorage if not in memory
    if (!position) {
      try {
        const saved = sessionStorage.getItem(`scroll_${url}`);
        if (saved) {
          position = JSON.parse(saved);
        }
      } catch (e) {
        console.warn(
          'Could not restore scroll position from sessionStorage:',
          e,
        );
      }
    }

    if (position) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo(position.x, position.y);
      });
    }
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  /**
   * Public method to manually save current scroll position
   */
  public saveCurrentPosition(): void {
    this.saveScrollPosition(this.currentUrl);
  }

  /**
   * Public method to clear saved scroll positions
   */
  public clearScrollPositions(): void {
    this.scrollPositions.clear();
    if (isPlatformBrowser(this.platformId)) {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith('scroll_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }

  /**
   * Public method to manually restore scroll position for a URL
   */
  public restorePosition(url: string): void {
    this.restoreScrollPosition(url);
  }
}
