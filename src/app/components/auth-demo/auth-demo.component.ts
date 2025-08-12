import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, LoginCredentials, RegisterCredentials } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-demo',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Firebase Auth Demo</h2>

      <!-- Auth State Display -->
      <div class="mb-6 p-4 bg-gray-100 rounded">
        <h3 class="font-semibold mb-2">Auth State:</h3>
        @if (authService.isLoading()) {
          <p class="text-blue-600">Loading...</p>
        }
        @if (authService.user(); as user) {
          <div class="text-green-600">
            <p>✅ Logged in as: {{ user.email }}</p>
            <p>Display Name: {{ user.displayName || 'N/A' }}</p>
            <p>Email Verified: {{ user.emailVerified ? '✅' : '❌' }}</p>
            <p>Provider: {{ user.providerId }}</p>
          </div>
        } @else {
          <p class="text-red-600">❌ Not logged in</p>
        }
        @if (authService.error(); as error) {
          <p class="text-red-600 mt-2">Error: {{ error }}</p>
        }
      </div>

      <!-- Auth Actions -->
      @if (!authService.isAuthenticated()) {
        <!-- Login/Register Forms -->
        <div class="space-y-4">
          <!-- Tab Buttons -->
          <div class="flex space-x-2 mb-4">
            <button
              (click)="activeTab.set('login')"
              [class]="'px-4 py-2 rounded ' + (activeTab() === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200')"
            >
              Đăng nhập
            </button>
            <button
              (click)="activeTab.set('register')"
              [class]="'px-4 py-2 rounded ' + (activeTab() === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200')"
            >
              Đăng ký
            </button>
            <button
              (click)="activeTab.set('reset')"
              [class]="'px-4 py-2 rounded ' + (activeTab() === 'reset' ? 'bg-blue-500 text-white' : 'bg-gray-200')"
            >
              Quên MK
            </button>
          </div>

          <!-- Login Form -->
          @if (activeTab() === 'login') {
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
              <div>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="Email"
                  class="w-full p-3 border rounded-md"
                >
              </div>
              <div>
                <input
                  formControlName="password"
                  type="password"
                  placeholder="Mật khẩu"
                  class="w-full p-3 border rounded-md"
                >
              </div>
              <button
                type="submit"
                [disabled]="loginForm.invalid || authService.isLoading()"
                class="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                Đăng nhập
              </button>
            </form>
          }

          <!-- Register Form -->
          @if (activeTab() === 'register') {
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-4">
              <div>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="Email"
                  class="w-full p-3 border rounded-md"
                >
              </div>
              <div>
                <input
                  formControlName="password"
                  type="password"
                  placeholder="Mật khẩu"
                  class="w-full p-3 border rounded-md"
                >
              </div>
              <div>
                <input
                  formControlName="confirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  class="w-full p-3 border rounded-md"
                >
              </div>
              <button
                type="submit"
                [disabled]="registerForm.invalid || authService.isLoading()"
                class="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Đăng ký
              </button>
            </form>
          }

          <!-- Reset Password Form -->
          @if (activeTab() === 'reset') {
            <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()" class="space-y-4">
              <div>
                <input
                  formControlName="email"
                  type="email"
                  placeholder="Email"
                  class="w-full p-3 border rounded-md"
                >
              </div>
              <button
                type="submit"
                [disabled]="resetForm.invalid || authService.isLoading()"
                class="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                Gửi email reset
              </button>
            </form>
          }

          <!-- Social Login Buttons -->
          <div class="space-y-2 pt-4 border-t">
            <button
              (click)="onGoogleLogin()"
              [disabled]="authService.isLoading()"
              class="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              🔗 Đăng nhập với Google
            </button>
            <button
              (click)="onFacebookLogin()"
              [disabled]="authService.isLoading()"
              class="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              📘 Đăng nhập với Facebook
            </button>
          </div>
        </div>
      } @else {
        <!-- Logged In Actions -->
        <div class="space-y-4">
          @if (authService.user()?.providerId === 'email' && !authService.user()?.emailVerified) {
            <div class="space-y-2">
              <button
                (click)="onResendVerification()"
                [disabled]="authService.isLoading()"
                class="w-full bg-yellow-500 text-white p-3 rounded-md hover:bg-yellow-600 disabled:opacity-50"
              >
                Gửi lại email xác thực
              </button>
              <button
                (click)="onTestEmailVerification()"
                [disabled]="authService.isLoading()"
                class="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                🧪 Test Email Verification
              </button>
            </div>
          }

          <button
            (click)="onGetToken()"
            class="w-full bg-purple-500 text-white p-3 rounded-md hover:bg-purple-600"
          >
            Lấy ID Token
          </button>

          <button
            (click)="onLogout()"
            [disabled]="authService.isLoading()"
            class="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            Đăng xuất
          </button>
        </div>
      }

      <!-- Token Display -->
      @if (currentToken()) {
        <div class="mt-6 p-4 bg-gray-100 rounded">
          <h3 class="font-semibold mb-2">Current Token:</h3>
          <p class="text-xs break-all font-mono">{{ currentToken() }}</p>
        </div>
      }
    </div>
  `
})
export class AuthDemoComponent {
  private fb = inject(FormBuilder);

  readonly authService = inject(AuthService);
  readonly activeTab = signal<'login' | 'register' | 'reset'>('login');
  readonly currentToken = signal<string | null>(null);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  readonly resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  async onLogin() {
    if (this.loginForm.valid) {
      try {
        const credentials: LoginCredentials = this.loginForm.value as LoginCredentials;
        await this.authService.loginWithEmail(credentials);
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  }

  async onRegister() {
    if (this.registerForm.valid) {
      try {
        const credentials: RegisterCredentials = this.registerForm.value as RegisterCredentials;
        await this.authService.registerWithEmail(credentials);
      } catch (error) {
        console.error('Register error:', error);
      }
    }
  }

  async onResetPassword() {
    if (this.resetForm.valid) {
      try {
        const email = this.resetForm.value.email!;
        await this.authService.resetPassword(email);
      } catch (error) {
        console.error('Reset password error:', error);
      }
    }
  }

  async onGoogleLogin() {
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  async onFacebookLogin() {
    try {
      await this.authService.loginWithFacebook();
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  }

  async onResendVerification() {
    try {
      await this.authService.resendEmailVerification();
    } catch (error) {
      console.error('Resend verification error:', error);
    }
  }

  async onTestEmailVerification() {
    try {
      await this.authService.testSendEmailVerification();
    } catch (error) {
      console.error('Test email verification error:', error);
    }
  }

  async onGetToken() {
    try {
      const token = await this.authService.getCurrentToken();
      this.currentToken.set(token);
    } catch (error) {
      console.error('Get token error:', error);
    }
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.currentToken.set(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
