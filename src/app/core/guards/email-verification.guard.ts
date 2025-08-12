import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const emailVerificationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(user => {
      if (!user) {
        // Chưa đăng nhập
        router.navigate(['/login']);
        return false;
      }

      if (!user.emailVerified && user.providerId === 'email') {
        // Email chưa được verify (chỉ check cho email/password auth)
        router.navigate(['/email-verification']);
        return false;
      }

      return true;
    })
  );
};
