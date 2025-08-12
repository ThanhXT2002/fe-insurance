import {Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLayout } from "../../components/auth-layout/auth-layout";
import { CommonModule } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { Logo } from "../../components/logo/logo";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
    imports: [ReactiveFormsModule, InputIconModule, IconFieldModule, InputTextModule, FormsModule, FloatLabelModule, PasswordModule, AutoFocusModule, CommonModule, Logo, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {

  private fb = new FormBuilder();

  isSubmitting = signal(false);

  verifyForm!: FormGroup;
  constructor() {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  onSubmit() {
    if (this.verifyForm.valid) {
    }
  }

}
