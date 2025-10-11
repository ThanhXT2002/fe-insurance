import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  provideAppInitializer,
  inject,
} from '@angular/core';
import {
  provideRouter,
  withViewTransitions,
  withInMemoryScrolling,
} from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { MyPreset } from './core/theme/my-preset';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

import { register as registerSwiperElements } from 'swiper/element/bundle';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { AuthStore } from './core/store/auth/auth.store';
import { AuthService } from './core/services/auth.service';
import { ScrollRestorationService } from './core/services/scroll-restoration.service';

registerSwiperElements();
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled', // Disable default scroll restoration
        anchorScrolling: 'enabled',
      }),
    ),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
    }),
    provideAnimations(),
    provideAuth(() => getAuth()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    MessageService, // Provider cho PrimeNG Toast
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      // Initialize scroll restoration service
      const scrollService = inject(ScrollRestorationService);

      // Make profile loading non-blocking to avoid delaying app bootstrap.
      // If a token exists, trigger loadProfile but don't await it here.
      const authStore = inject(AuthStore);
      const authService = inject(AuthService);
      (async () => {
        try {
          const token = await authService.getAccessToken();
          if (token) {
            // Fire-and-forget: authStore.loadProfile handles timeouts/caching internally
            authStore.loadProfile().catch(() => {});
          }
        } catch (e) {
          console.warn('auth initializer error', e);
        }
      })();
    }),
  ],
};
