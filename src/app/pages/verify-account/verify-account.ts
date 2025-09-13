import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { Logo } from '../../components/logo/logo';
import { RouterLink } from '@angular/router';
import { SocialLoginButton } from '../../components/social-login-button/social-login-button';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-verify-account',
  imports: [
    ReactiveFormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    PasswordModule,
    AutoFocusModule,
    CommonModule,
    Logo,
    RouterLink,
    SocialLoginButton,
  ],
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.scss',
})
export class VerifyAccount {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  readonly authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  verifyForm!: FormGroup;
  constructor() {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  isSubmitting = signal(false);
  // mode: 'verify' | 'reset' - determines which action to perform on submit
  mode: 'verify' | 'reset' = 'verify';

  ngOnInit() {
    // Determine mode from the current router URL (supports absolute paths)
    // Map '/forgot-password' -> 'reset' and '/verify-account' -> 'verify'
    const url = this.router.url || this.route.snapshot.routeConfig?.path || '';
    if (url.includes('forgot-password') || url.includes('reset')) {
      this.mode = 'reset';
    } else if (url.includes('verify-account') || url.includes('verify')) {
      this.mode = 'verify';
    }
  }

  private getEmail(): string {
    return this.verifyForm.get('email')?.value;
  }

  private async handleReset(email: string) {
    await this.authService.resetPassword(email);
    this.messageService.add({
      severity: 'success',
      summary:
        'Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.',
    });
  }

  private async handleResend(email: string) {
    await this.authService.resendVerificationEmail(email);
    this.messageService.add({
      severity: 'success',
      summary: 'Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư của bạn.',
    });
  }

  private showError() {
    this.messageService.add({
      severity: 'error',
      summary:
        this.mode === 'reset'
          ? 'Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại.'
          : 'Gửi lại email xác thực thất bại. Vui lòng thử lại.',
    });
  }

  private async submitAsync(email: string) {
    try {
      if (this.mode === 'reset') {
        await this.handleReset(email);
      } else {
        await this.handleResend(email);
      }
      this.verifyForm.reset();
    } catch (err) {
      console.error('Action failed', err);
      this.showError();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onSubmit() {
    if (!this.verifyForm.valid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const email = this.getEmail();
    void this.submitAsync(email);
  }
}
