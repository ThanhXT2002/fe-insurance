import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthLayout } from '../../components/auth-layout/auth-layout';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordValidators } from '../../core/validators/password.validator';
import { PasswordModule } from 'primeng/password';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import {
  AuthService,
  RegisterCredentials,
} from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    AuthLayout,
    ReactiveFormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    PasswordModule,
    AutoFocusModule,
    DividerModule,
    CommonModule,
    InputGroupAddonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  readonly authService = inject(AuthService);

  registerForm: FormGroup;
  isSubmitting = signal(false);

  constructor() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            ...PasswordValidators.strongPassword(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: PasswordValidators.passwordMatch(),
      },
    );
  }

  async onSubmit(): Promise<void> {
    // Kiểm tra form hợp lệ
    if (this.registerForm.valid) {
      this.isSubmitting.set(true);
      // Lấy dữ liệu đăng ký từ form, đảm bảo đúng kiểu
      const credentials = this.registerForm.value as RegisterCredentials;
      try {
        // Gọi API đăng ký
        await this.authService.registerWithEmail(credentials);
      } catch (error: unknown) {
        console.error('Register error:', error);
      } finally {
        // Luôn reset trạng thái submitting sau khi xử lý xong
        this.isSubmitting.set(false);
      }
    } else {
      // Nếu form không hợp lệ, đánh dấu tất cả các trường là touched để hiển thị lỗi
      this.registerForm.markAllAsTouched();
    }
  }

  // Phương thức để kiểm tra lỗi
  hasError(controlName: string, errorName: string): boolean {
    const control = this.registerForm.get(controlName);
    return (
      !!control &&
      control.hasError(errorName) &&
      (control.dirty || control.touched)
    );
  }

  hasPasswordMismatch(): boolean | undefined {
    return (
      this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.dirty
    );
  }
}
