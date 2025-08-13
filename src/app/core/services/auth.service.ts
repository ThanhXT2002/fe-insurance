import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  UserCredential,
  AuthError,
  updateProfile,
} from '@angular/fire/auth';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { Location } from '@angular/common';
import { NavigationService } from './navigation.service';

// Interfaces
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private navService = inject(NavigationService);
  private platformId = inject(PLATFORM_ID);

  // Signals for state management
  private readonly userSignal = signal<AuthUser | null>(null);
  private readonly loadingSignal = signal<boolean>(true);
  private readonly errorSignal = signal<string | null>(null);

  // Computed states
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Observable for compatibility with guards/interceptors
  readonly authState$ = new BehaviorSubject<AuthUser | null>(null);
  readonly isAuthenticated$ = this.authState$.pipe(map((user) => !!user));

  constructor() {
    // Tránh đăng ký listener trên server để giảm treo prerender
    if (isPlatformBrowser(this.platformId)) {
      onAuthStateChanged(
        this.auth,
        (firebaseUser) => {
          this.loadingSignal.set(true);

          if (firebaseUser) {
            const authUser = this.mapFirebaseUser(firebaseUser);
            // console.debug('Auth state changed:', authUser);
            this.userSignal.set(authUser);
            this.authState$.next(authUser);
          } else {
            this.userSignal.set(null);
            this.authState$.next(null);
          }

            this.loadingSignal.set(false);
        },
        (error) => {
          this.errorSignal.set(
            'Lỗi xác thực: ' + (error?.message ?? 'Không xác định'),
          );
          this.loadingSignal.set(false);
        },
      );
    } else {
      // Server: không block prerender; đánh dấu đã xong
      this.loadingSignal.set(false);
    }
  }

  /**
   * Đăng ký bằng email và mật khẩu với xác thực email
   */
  async registerWithEmail(credentials: RegisterCredentials): Promise<void> {
    try {
      this.setLoading(true);
      this.clearError();

      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Mật khẩu không khớp');
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      );

      // Kiểm tra user có tồn tại trước khi gửi email
      if (!userCredential.user) {
        throw new Error('Không thể tạo user');
      }

      // Cấu hình action code settings cho email verification
      const actionCodeSettings = {
        url: this.getOrigin() + '/login?emailVerified=true',
        handleCodeInApp: false,
      };

      // Gửi email xác thực với settings
      await sendEmailVerification(userCredential.user, actionCodeSettings);

      // Thông báo cho user check email bằng toast
      this.toastService.success(
        `Email xác thực đã được gửi đến ${credentials.email}. Vui lòng kiểm tra hộp thư đến và thư mục spam.`,
        'Đăng ký thành công'
      );

      // Tự động đăng xuất để user phải xác thực email trước
      await this.logout();
    } catch (error: any) {
      console.error('Registration error:', error);
      this.handleAuthError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Đăng nhập bằng email và mật khẩu
   */
  async loginWithEmail(credentials: LoginCredentials): Promise<void> {
    try {
      this.setLoading(true);
      this.clearError();

      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      );

      console.log('Login successful:', userCredential);

      // Kiểm tra email đã được verify chưa
      if (!userCredential.user.emailVerified) {
        console.log('Email chưa được xác thực');
        this.toastService.warn(
          `Tài khoản này chưa được xác thực. Vui lòng kiểm tra hộp thư đến và thư mục spam.`,
          'Chú ý'
        );
        await signOut(this.auth);
        return;
        // await this.logout();
      }

      // Redirect sau khi đăng nhập thành công
      this.toastLoginSuccess();
      // this.router.navigate(['/']);
      this.navService.back();
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Đăng nhập bằng Google
   */
  async loginWithGoogle(): Promise<void> {
    try {
      this.setLoading(true);
      this.clearError();

      const provider = new GoogleAuthProvider();
      // Thêm scope nếu cần
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });

      const userCredential = await signInWithPopup(this.auth, provider);

      console.log('Google login successful:', userCredential);

      // Redirect sau khi đăng nhập thành công
      this.toastLoginSuccess();
      this.navService.back();
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Đăng nhập bằng Facebook
   */
  async loginWithFacebook(): Promise<void> {
    try {
      this.setLoading(true);
      this.clearError();

      const provider = new FacebookAuthProvider();
      // Thêm scope nếu cần
      provider.addScope('email');

      const userCredential = await signInWithPopup(this.auth, provider);
      console.log('face login successful:', userCredential);

      this.toastLoginSuccess();
      this.navService.back();
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Quên mật khẩu - gửi email reset
   */
  async resetPassword(email: string): Promise<void> {
    try {
      this.setLoading(true);
      this.clearError();

      await sendPasswordResetEmail(this.auth, email);

      this.toastService.info(
        'Email reset mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư đến.',
        'Reset mật khẩu',
        'top-center',
      );
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Test method để force gửi email verification cho user hiện tại
   */
  async testSendEmailVerification(): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new Error('Không có user hiện tại để gửi email verification');
      }

      console.log('Testing email verification for user:', {
        uid: this.auth.currentUser.uid,
        email: this.auth.currentUser.email,
        emailVerified: this.auth.currentUser.emailVerified,
      });

      const actionCodeSettings = {
        url: `${this.getOrigin()}/login?emailVerified=true`,
        handleCodeInApp: false,
      };

      console.log('Sending email with settings:', actionCodeSettings);

      await sendEmailVerification(this.auth.currentUser, actionCodeSettings);

      console.log('Email verification sent successfully');

      this.toastService.success(
        `Email xác thực đã được gửi đến ${this.auth.currentUser.email}. Kiểm tra hộp thư đến và thư mục spam.`,
        'Test Email Verification'
      );
    } catch (error: any) {
      console.error('Test email verification failed:', error);
      this.toastService.error(
        `Lỗi gửi email: ${error.message}`,
        'Có lỗi'
      );
      throw error;
    }
  }

  /**
   * Gửi lại email xác thực
   */
  async resendEmailVerification(): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new Error('Không có user hiện tại');
      }

      this.setLoading(true);

      console.log(
        'Resending email verification for:',
        this.auth.currentUser.email,
      );

      // Cấu hình action code settings
      const actionCodeSettings = {
        url: this.getOrigin() + '/login?emailVerified=true',
        handleCodeInApp: false,
      };

      await sendEmailVerification(this.auth.currentUser, actionCodeSettings);

      console.log('Email verification resent successfully');

      this.toastService.info(
        `Email xác thực đã được gửi lại đến ${this.auth.currentUser.email}. Vui lòng kiểm tra hộp thư đến và thư mục spam.`,
        'Gửi lại email xác thực',
      );
    } catch (error: any) {
      console.error('Resend verification error:', error);
      this.handleAuthError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    try {
      this.setLoading(true);
      await signOut(this.auth);
      // this.router.navigate(['/login']);
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Lấy ID Token hiện tại để gửi lên backend
   */
  async getCurrentToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        // forceRefresh = true để đảm bảo token mới nhất
        return await user.getIdToken(true);
      } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
      }
    }
    return null;
  }

  // Private helper methods
  private mapFirebaseUser(firebaseUser: User): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.providerData[0]?.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      providerId: firebaseUser.providerData[0]?.providerId || 'email',
    };
  }

  /**
 * Cập nhật thông tin profile cho user hiện tại
 * @param displayName Tên hiển thị mới
 * @param photoURL Ảnh đại diện mới (tùy chọn)
 */
async updateProfile(displayName: string, photoURL?: string): Promise<void> {
  const user = this.auth.currentUser;
  if (!user) {
    this.toastService.error('Bạn chưa đăng nhập', 'Lỗi cập nhật', 'top-center');
    throw new Error('Không có user đang đăng nhập');
  }

  try {
    this.setLoading(true);
    await updateProfile(user, { displayName, photoURL });
    this.toastService.success('Cập nhật thông tin thành công', 'Profile', 'top-center');
    // Reload lại user để cập nhật state nếu cần
    const updatedUser = this.mapFirebaseUser(user);
    this.userSignal.set(updatedUser);
    this.authState$.next(updatedUser);
  } catch (error: unknown) {
    this.handleAuthError(error as Error);
    throw error;
  } finally {
    this.setLoading(false);
  }
}

  private handleAuthError(error: AuthError | Error): void {
    let errorMessage = 'Đã xảy ra lỗi không xác định';

    if ('code' in error) {
      // Firebase Auth Error
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Email không tồn tại trong hệ thống';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mật khẩu không chính xác';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Email đã được sử dụng';
          break;
        case 'auth/weak-password':
          errorMessage = 'Mật khẩu quá yếu (tối thiểu 6 ký tự)';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email không hợp lệ';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều lần thử. Vui lòng thử lại sau';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Lỗi kết nối mạng';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Đăng nhập bị hủy bởi người dùng';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Đăng nhập bị hủy';
          break;
        default:
          errorMessage = error.message;
      }
    } else {
      // Regular Error
      errorMessage = error.message;
    }

    this.errorSignal.set(errorMessage);
    console.error('Auth Error:', error);
  }

  private setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  private clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Lấy origin an toàn cho SSR (tránh tham chiếu window trên server)
   */
  private getOrigin(): string {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Fallback server – có thể cấu hình qua ENV
    return 'https://example.com';
  }

  toastLoginSuccess() {
    this.toastService.success(
      'Chào mừng bạn đến với hệ thống',
      'Đăng nhập thành công',
    );
  }
}
