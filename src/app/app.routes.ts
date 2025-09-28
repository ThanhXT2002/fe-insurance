import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
        data: { title: 'Home' },
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
        data: { title: 'Trang chủ' },
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about-us/about-us').then((m) => m.AboutUs),
        data: { title: 'Giới thiệu' },
      },
      {
        path: 'posts',
        loadComponent: () => import('./pages/posts/posts').then((m) => m.Posts),
        data: { title: 'Bài viết' },
      },
      {
        path: 'post/:slug',
        loadComponent: () =>
          import('./pages/post-detail/post-detail').then((m) => m.PostDetail),
        data: { title: 'Chi tiết bài viết' },
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact-us/contact-us').then((m) => m.ContactUs),
        data: { title: 'Liên hệ' },
      },
      {
        path: 'faqs',
        loadComponent: () => import('./pages/faqs/faqs').then((m) => m.FAQs),
        data: { title: 'Câu hỏi thường gặp' },
      },

      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
        data: { title: 'Đăng nhập' },
        canActivate: [loginGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register').then((m) => m.Register),
        data: { title: 'Đăng ký' },
        canActivate: [loginGuard],
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password').then(
            (m) => m.ResetPassword,
          ),
        data: { title: 'Đặt lại mật khẩu' },
        canActivate: [loginGuard],
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/verify-account/verify-account').then(
            (m) => m.VerifyAccount,
          ),
        data: { title: 'Đặt lại mật khẩu' },
        canActivate: [loginGuard],
      },
      {
        path: 'verify-account',
        loadComponent: () =>
          import('./pages/verify-account/verify-account').then(
            (m) => m.VerifyAccount,
          ),
        data: { title: 'Xác minh tài khoản' },
        canActivate: [loginGuard],
      },
      {
        path: 'toast-demo',
        loadComponent: () =>
          import('./components/toast-demo/toast-demo.component').then(
            (m) => m.ToastDemoComponent,
          ),
        data: { title: 'Toast Demo' },
      },

      {
        path: 'order',
        loadComponent: () => import('./pages/order/order').then((m) => m.Order),
        data: { title: 'Đặt hàng' },
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./pages/privacy-policy/privacy-policy').then(
            (m) => m.PrivacyPolicy,
          ),
        data: { title: 'Chính sách bảo mật' },
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products').then((m) => m.Products),
        data: { title: 'Sản phẩm' },
      },
      {
        path: 'product-detail/:id',
        loadComponent: () =>
          import('./pages/product-detail/product-detail').then(
            (m) => m.ProductDetail,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile').then((m) => m.Profile),
        data: { title: 'Hồ sơ' },
        canActivate: [authGuard],
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./pages/search/search').then((m) => m.Search),
        data: { title: 'Tìm kiếm' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings').then((m) => m.Settings),
        data: { title: 'Cài đặt' }
      },
      {
        path: 'terms-of-service',
        loadComponent: () =>
          import('./pages/terms-of-service/terms-of-service').then(
            (m) => m.TermsOfService,
          ),
        data: { title: 'Điều khoản dịch vụ' },
      },
      {
        path: 'indemnify',
        loadComponent: () =>
          import('./pages/indemnify/indemnify').then(
            (m) => m.IndemnifyComponent,
          ),
        data: { title: 'Quy trình Bồi thường' },
      },
    ],
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound),
    data: { title: '404 - Not Found' },
  },
  {
    path: 'internet-error',
    loadComponent: () =>
      import('./pages/internet-error/internet-error').then(
        (m) => m.InternetError,
      ),
    data: { title: 'Lỗi Internet' },
  },
  {
    path: 'server-error',
    loadComponent: () =>
      import('./pages/server-error/server-error').then((m) => m.ServerError),
    data: { title: '505 - Lỗi máy chủ' },
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
