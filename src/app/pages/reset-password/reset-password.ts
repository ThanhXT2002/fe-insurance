import {Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { Logo } from "../../components/logo/logo";
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SocialLoginButton } from "../../components/social-login-button/social-login-button";

@Component({
  selector: 'app-reset-password',
    imports: [ReactiveFormsModule, InputIconModule, IconFieldModule, InputTextModule, FormsModule, FloatLabelModule, PasswordModule, AutoFocusModule, CommonModule, Logo, RouterLink, SocialLoginButton],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {

    private fb = inject(FormBuilder);
  readonly authService = inject(AuthService);

  isSubmitting = signal(false);

  verifyForm!: FormGroup;
  constructor() {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  async onSubmit() {
    if (this.verifyForm.valid) {
      this.isSubmitting.set(true);
      try {
        const email = this.verifyForm.value.email!;
        await this.authService.resetPassword(email);
      } catch (error:unknown) {
        console.error('Reset password error:', error);
      }finally {
        // Luôn reset trạng thái submitting sau khi xử lý xong
        this.isSubmitting.set(false);
      }
    }else{
      this.verifyForm.markAllAsTouched();
    }
  }

}
