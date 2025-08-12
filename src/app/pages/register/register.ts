import { Component, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { AuthLayout } from "../../components/auth-layout/auth-layout";
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RouterLink } from '@angular/router';
import { PasswordValidators } from '../../core/validators/password.validator';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  imports: [AuthLayout, ReactiveFormsModule, InputIconModule, IconFieldModule, InputTextModule, FormsModule, FloatLabelModule, RouterLink, PasswordModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register implements AfterViewInit {
  @ViewChild('emailInput') emailInput!: ElementRef;

  private fb = new FormBuilder();

  registerForm: FormGroup;
  isSubmitting = signal(false);
  rememberMe = signal(false);

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
      }
    );
  }

  ngAfterViewInit(): void {
    // Focus vào trường email sau khi view được khởi tạo
    setTimeout(() => {
      if (this.emailInput?.nativeElement) {
        this.emailInput.nativeElement.focus();
      }
    }, 100);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting.set(true);

      // Simulate API call
      console.log('Form submitted:', this.registerForm.value);
      console.log('Remember me:', this.rememberMe());

      // Reset submitting state after 2 seconds (simulate API response)
      setTimeout(() => {
        this.isSubmitting.set(false);
        // Handle success or error here
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.registerForm.markAllAsTouched();
    }
  }

  toggleRememberMe(): void {
    this.rememberMe.update(value => !value);
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
