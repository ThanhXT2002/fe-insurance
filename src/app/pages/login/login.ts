import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayout } from "../../components/auth-layout/auth-layout";
import { CommonModule } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [AuthLayout,ReactiveFormsModule,InputIconModule, IconFieldModule, InputTextModule, FormsModule, FloatLabelModule, RouterLink, PasswordModule, AutoFocusModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = new FormBuilder();

  isSubmitting = signal(false);
  rememberMe = signal(false);

  loginForm!: FormGroup;
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6) ]],
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
    }
  }

    toggleRememberMe(): void {
    this.rememberMe.update(value => !value);
  }
}
