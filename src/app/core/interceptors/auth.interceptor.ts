import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { from, switchMap, catchError, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const platformId = inject(PLATFORM_ID);

  // Danh sách các URL không cần token
  const excludedUrls = [
    '/login',
    '/register',
    '/reset-password',
    '/public'
  ];

  // Kiểm tra xem request có cần token không
  const needsAuth = !excludedUrls.some(url => req.url.includes(url));

  if (!needsAuth || !isPlatformBrowser(platformId)) {
    // Không cần auth hoặc đang chạy trên server → bỏ qua interceptor
    return next(req);
  }

  // Inject Firebase Auth trực tiếp thay vì AuthService để tránh circular dependency
  const auth = inject(Auth);

  // Lấy current user
  const currentUser = auth.currentUser;

  if (!currentUser) {
    // Không có user đăng nhập → tiếp tục request gốc
    return next(req);
  }

  // Lấy token async từ Firebase (an toàn, không lưu localStorage)
  return from(currentUser.getIdToken()).pipe(
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
        // Không có token → tiếp tục request gốc
        return next(req);
      }
    }),
    catchError(error => {
      // Lỗi khi lấy token → tiếp tục request gốc để không block request
      console.warn('Error getting Firebase token in interceptor:', error);
      return next(req);
    })
  );
};
