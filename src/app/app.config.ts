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

registerSwiperElements();
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
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
    provideAppInitializer(async () => {
      const authStore = inject(AuthStore);
      const authService = inject(AuthService);
      try {
        const token = await authService.getAccessToken();
        if (token) {
          // try loadProfile with a simple retry (2 attempts)
          let attempts = 0;
          const maxAttempts = 2;
          while (attempts < maxAttempts) {
            attempts++;
            try {
              await authStore.loadProfile();
              break;
            } catch (err) {
              console.warn(
                `auth initializer loadProfile attempt ${attempts} failed`,
                err,
              );
              if (attempts >= maxAttempts) {
                console.error('auth initializer failed to load profile');
              } else {
                // small backoff
                await new Promise((r) => setTimeout(r, 300));
              }
            }
          }
        }
      } catch (e) {
        console.warn('auth initializer error', e);
      }
    }),
  ],
};
