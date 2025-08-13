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
import { SocialLoginButton } from "../../components/social-login-button/social-login-button";
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verify-account',
  imports: [ReactiveFormsModule, InputIconModule, IconFieldModule, InputTextModule, FormsModule, FloatLabelModule, PasswordModule, AutoFocusModule, CommonModule, Logo, RouterLink, SocialLoginButton],
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.scss'
})
export class VerifyAccount {

  private fb = inject(FormBuilder);

  readonly authService = inject(AuthService);

  verifyForm!: FormGroup;
  constructor() {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required ]],
    });
  }

   isSubmitting = signal(false);

  onSubmit() {
    if (this.verifyForm.valid) {
    }
  }

}
