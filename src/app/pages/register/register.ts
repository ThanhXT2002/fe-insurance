import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { AuthLayout } from "../../components/auth-layout/auth-layout";
import { InputCommon } from "../../components/input-common/input-common";
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-register',
  imports: [AuthLayout, InputCommon, ReactiveFormsModule, IftaLabelModule, InputIconModule, IconFieldModule, InputTextModule, FormsModule, FloatLabelModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private fb = new FormBuilder();

  registerForm: FormGroup;
  isSubmitting = signal(false);
  rememberMe = signal(false);

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator để check mật khẩu nhập lại
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const repeatPassword = control.get('repeatPassword');

    if (password && repeatPassword && password.value !== repeatPassword.value) {
      repeatPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Xóa lỗi passwordMismatch nếu mật khẩu khớp
    if (repeatPassword?.hasError('passwordMismatch')) {
      const errors = { ...repeatPassword.errors };
      delete errors['passwordMismatch'];
      repeatPassword.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
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
}
