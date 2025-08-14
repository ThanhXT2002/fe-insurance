import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { combineLatest } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Đợi auth state ổn định (không loading) trước khi quyết định
  return combineLatest([
    authService.isAuthenticated$,
    toObservable(authService.isLoading)
  ]).pipe(
    filter(([_, isLoading]) => !isLoading), // Chỉ proceed khi không loading
    take(1),
    map(([isAuthenticated, _]) => {
      if (isAuthenticated) {
        return true;
      } else {
        // Redirect về login page nếu chưa đăng nhập
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    }),
  );
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Đợi auth state ổn định trước khi quyết định
  return combineLatest([
    authService.isAuthenticated$,
    toObservable(authService.isLoading)
  ]).pipe(
    filter(([_, isLoading]) => !isLoading), // Chỉ proceed khi không loading
    take(1),
    map(([isAuthenticated, _]) => {
      if (isAuthenticated) {
        // Nếu đã đăng nhập, redirect về trang chủ
        router.navigate(['/']);
        return false;
      }
      return true;
    }),
  );
};

/**
 * Guard yêu cầu user phải đăng nhập VÀ đã verify email
 */
export const emailVerificationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([
    authService.isAuthenticated$,
    toObservable(authService.isLoading)
  ]).pipe(
    filter(([_, isLoading]) => !isLoading),
    take(1),
    map(([isAuthenticated, _]) => {
      if (!isAuthenticated) {
        // Chưa đăng nhập
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }

      if (!authService.isEmailVerified()) {
        // Đã đăng nhập nhưng chưa verify email
        router.navigate(['/verify-account'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }

      return true;
    }),
  );
};
