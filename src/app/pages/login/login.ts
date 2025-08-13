import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayout } from "../../components/auth-layout/auth-layout";
import { CommonModule } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { AuthService, LoginCredentials } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [AuthLayout,ReactiveFormsModule,InputIconModule, IconFieldModule, InputTextModule, FormsModule, FloatLabelModule, PasswordModule, AutoFocusModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);

  readonly authService = inject(AuthService);

  isSubmitting = signal(false);

  loginForm!: FormGroup;
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6) ]],
    });
  }


  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isSubmitting.set(true);
      const credentials: LoginCredentials = this.loginForm.value as LoginCredentials;
      try {
        await this.authService.loginWithEmail(credentials);
      } catch (error: unknown) {
        console.error('Register error:', error);
      } finally {
        this.isSubmitting.set(false);
      }
    }else {
      this.loginForm.markAllAsTouched();
    }
  }
}
