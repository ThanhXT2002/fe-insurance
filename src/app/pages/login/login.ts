import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthLayout } from '../../components/auth-layout/auth-layout';
import { CommonModule } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { AuthStore } from '@/core/store/auth/auth.store';

@Component({
  selector: 'app-login',
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
    CommonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  private messageService = inject(MessageService);
  private authStore = inject(AuthStore);

  isSubmitting = signal(false);

  loginForm!: FormGroup;
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isSubmitting.set(true);

    const showMessage = (severity: 'success' | 'error', summary: string) => {
      this.messageService.add({ severity, summary });
    };

    try {
      const { data, error } = await this.authService.signIn(email, password);

      if (error) {
        if (error.code == "invalid_credentials") {
          showMessage('error', 'Email hoặc mật khẩu không đúng');
        } else {
          showMessage('error', 'Đăng nhập thất bại');
        }
        return;
      }

      if (!data?.session) {
        showMessage('error', 'Đăng nhập thất bại!');
        return;
      }

      try {
        const profile = await this.authStore.loadProfile();
        if (profile?.active) {
          showMessage('success', 'Đăng nhập thành công!');
          // await this.router.navigate(['/']);
        }
      } catch {
        showMessage('error', 'Không load được profile');
      }
    } catch (err: any) {
      showMessage('error', 'Lỗi khi đăng nhập');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
