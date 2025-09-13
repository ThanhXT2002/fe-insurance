import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthStore } from '../store/auth/auth.store';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const platformId = inject(PLATFORM_ID);

  // Danh sách các URL không cần token
  const excludedUrls = ['/login', '/register', '/reset-password', '/public'];

  // Kiểm tra xem request có cần token không
  const needsAuth = !excludedUrls.some((url) => req.url.includes(url));

  if (!needsAuth || !isPlatformBrowser(platformId)) {
    // Không cần auth hoặc đang chạy trên server → bỏ qua interceptor
    return next(req);
  }

  // Use AuthService (Supabase) to get access token so backend receives Supabase JWT
  const authService = inject(AuthService);

  // Retrieve access token (Supabase) and attach Authorization header if present
  return from(authService.getAccessToken()).pipe(
    switchMap((token: string | null) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
      return next(authReq).pipe(
        catchError((err: any) => {
          // If backend returns 401, clear client auth state and redirect to login
          if (err?.status === 401 || err?.statusCode === 401) {
            try {
              const authStore = inject(AuthStore);
              authStore.clear();
            } catch (e) {}
            try {
              const router = inject(Router);
              if (router.url !== '/login') {
                router.navigate(['/login']);
              }
            } catch (e) {}
          }
          return throwError(() => err);
        }),
      );
    }),
  );
};
