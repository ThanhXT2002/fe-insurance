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
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SocialLoginButton } from '../../components/social-login-button/social-login-button';
import { PasswordValidators } from '@/core/validators/password.validator';
import { Divider } from 'primeng/divider';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  standalone: true,
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
    Divider,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isSubmitting = signal(false);
  // default to false; set to true only when we detect recovery flow
  isRecovery = false;

  form: FormGroup = this.fb.group({
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
  });

  constructor() {
    this.authService.authChanges((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        this.isRecovery = true;
        console.log(
          this.isRecovery
            ? 'Password recovery initiated'
            : 'Not in recovery mode',
        );
      }
    });

    // Also check query param in case Supabase already signed user in during redirect
    const qp = this.route.snapshot.queryParamMap.get('recovery');
    if (qp === '1') {
      this.isRecovery = true;
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      this.isSubmitting.set(true);
      const newPassword = this.form.value.password;

      const { data, error } =
        await this.authService.updateUserPassword(newPassword);
      this.isSubmitting.set(false);

      if (data) {
        this.router.navigate(['/login']);
        this.messageService.add({
          severity: 'success',
          summary: 'Đặt lại mật khẩu thành công',
        });
        this.form.reset();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Đặt lại mật khẩu thất bại',
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
