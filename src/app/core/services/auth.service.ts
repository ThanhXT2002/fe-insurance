import { inject, Injectable, signal } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthChangeEvent,
  Session,
  User,
} from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthStore } from '../store/auth/auth.store';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { registerDTO } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  readonly user = signal<User | null>(null);
  private http = inject(HttpClient);
  apiUrl = environment.apiUrl + '/auth';
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authStore = inject(AuthStore);

  constructor() {
    this.supabase = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      },
    );
    // Lắng nghe trạng thái đăng nhập
    this.supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        this.user.set(session?.user ?? null);
        // Nếu có session hợp lệ, trigger loadProfile để nạp profile từ backend.
        // Tuy nhiên, khi đang ở flow đặt lại mật khẩu (redirect có ?recovery=1
        // hoặc url chứa /reset-password), Supabase có thể tạo một session tạm
        // thời để cho phép cập nhật mật khẩu. Trong trường hợp này không nên
        // tự động load profile / điều hướng như flow đăng nhập bình thường.
        if (session?.user) {
          try {
            const currentUrl = this.router?.url || window.location.href || '';
            const isRecovery =
              currentUrl.includes('/reset-password') ||
              currentUrl.includes('recovery=1');
            if (isRecovery) {
              // Skip automatic loadProfile/navigation during recovery flow
              return;
            }
          } catch (e) {
            // ignore and proceed with normal flow
          }

          // không chờ, để không block event loop
          this.authStore.loadProfile().catch(() => {});
        }
      },
    );
    // NOTE: avoid calling getUser() here to prevent duplicate network requests on app reload.
    // onAuthStateChange will handle updating `user` when Supabase initializes the session.
    // console.log('access_token:', this.getAccessToken());
  }

  // Đăng nhập Google
  async loginWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // sau khi login sẽ quay lại app
      },
    });
    if (error) throw error;
    return data;
  }

  // Đăng nhập Facebook
  async loginWithFacebook() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  }

  // Đăng ký tài khoản mới
  async signUp(email: string, password: string) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/verify-email',
      },
    });
  }

  // Đăng nhập bằng email/password
  async signIn(email: string, password: string) {
    const res = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Nếu đăng nhập thành công (không có lỗi và có session),
    // nạp profile và điều hướng người dùng về trang chủ
    try {
      if (!res.error && res.data?.session) {
        // đảm bảo token/session sẵn sàng
        const token = await this.getAccessToken();
        if (token) {
          // force load profile from backend
          await this.authStore.loadProfile(true).catch(() => {});
          // điều hướng về trang chủ
          await this.router.navigate(['/']);
        }
      }
    } catch (e) {
      // swallow - return original res to caller
    }

    return res;
  }

  // Đăng xuất
  async logout() {
    try {
      await this.signOut();
      this.messageService.add({
        severity: 'success',
        summary: 'Đăng xuất thành công!',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Đăng xuất thất bại!',
      });
    }
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.user.set(null);
    // clear client-side auth store so guards and UI reflect logged-out state immediately
    try {
      this.authStore.clear();
    } catch (e) {
      console.warn('Failed to clear auth store on sign out', e);
    }
    await this.router.navigate(['/login']);
  }

  // Gửi email quên mật khẩu
  async resetPassword(email: string) {
    // include a query param so the app can detect recovery flow after redirect
    const redirect = window.location.origin + '/reset-password?recovery=1';
    return this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirect,
    });
  }

  // Cập nhật mật khẩu mới cho user (dùng cho reset password)
  async updateUserPassword(newPassword: string) {
    return this.supabase.auth.updateUser({ password: newPassword });
  }

  /**
   * Resend signup confirmation email.
   * Accepts either a plain email string or an object like { email: string }
   * Throws on error so callers can handle failures.
   */
  async resendVerificationEmail(emailOrPayload: string | { email: string }) {
    const email =
      typeof emailOrPayload === 'string'
        ? emailOrPayload
        : (emailOrPayload && (emailOrPayload as any).email) || '';

    const { error } = await this.supabase.auth.resend({
      email,
      type: 'signup',
    });

    if (error) {
      console.error('Lỗi khi gửi lại email xác minh:', error.message);
      // Rethrow so the UI caller can show an error
      throw error;
    }

    return;
  }

  // Lấy user hiện tại
  getCurrentUser() {
    return this.user();
  }

  // Lấy thông tin user thực tế từ Supabase (dùng cho guard)
  private pendingGetUser: Promise<User | null> | null = null;

  // Loại bỏ trùng lặp các cuộc gọi getUser đồng thời để nhiều caller khi tải lại không gửi nhiều yêu cầu
  async getUser() {
    if (this.pendingGetUser) return this.pendingGetUser;
    this.pendingGetUser = (async () => {
      try {
        const { data } = await this.supabase.auth.getUser();
        return data.user ?? null;
      } finally {
        // Xóa pending promise để các lần gọi sau có thể lấy lại dữ liệu khi cần
        this.pendingGetUser = null;
      }
    })();
    return this.pendingGetUser;
  }

  // Lắng nghe thay đổi trạng thái đăng nhập
  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await this.supabase.auth.getSession();
    // console.log('Current session:', data.session?.access_token);
    return data.session?.access_token ?? null;
  }

  register(data: registerDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, data);
  }
}
