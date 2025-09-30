import {
  mergeApplicationConfig,
  ApplicationConfig,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { SEOService } from './core/services/seo.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideAppInitializer(() => {
      try {
        const seo = inject(SEOService);
        // ensure homepage preset is applied during server render so OG/twitter meta are present
        // pass preset name explicitly so getPageSEO().homepage() is used
        seo.setSEO(undefined, 'homepage');
      } catch (e) {
        // don't block server rendering if seo cannot be initialized
        // eslint-disable-next-line no-console
        console.warn('server SEO initializer skipped', e);
      }
      return;
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
