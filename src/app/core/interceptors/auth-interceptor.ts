import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // Danh sách các URL không cần token
  const excludedUrls = [
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/public'
  ];

  // Kiểm tra xem request có cần token không
  const needsAuth = !excludedUrls.some(url => req.url.includes(url));

  if (!needsAuth) {
    return next(req);
  }

  // Lấy token và thêm vào header
  return from(authService.getCurrentToken()).pipe(
    switchMap(token => {
      if (token) {
        // Clone request và thêm Authorization header
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      } else {
        // Nếu không có token, tiếp tục với request gốc
        return next(req);
      }
    }),
    catchError(error => {
      console.error('Error in auth interceptor:', error);
      return next(req); // Fallback: tiếp tục với request gốc
    })
  );
};
