import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';
import { InputCommon } from '../input-common/input-common';
import { ContactService } from '@/core/services/api/contact.service';
import { BtnCommon } from "../btn-common/btn-common";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule, ReactiveFormsModule, InputCommon, BtnCommon],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private messageService = inject(MessageService);
  form!: FormGroup;
  isLoading = false;

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
    });
  }

  get nameControl() {
    return this.form.get('name') as FormControl;
  }

  get phoneControl() {
    return this.form.get('phone') as FormControl;
  }

  get emailControl() {
    return this.form.get('email') as FormControl;
  }

  get messageControl() {
    return this.form.get('message') as FormControl;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    };
    this.isLoading = true;

    this.contactService.sendContact(this.form.value).subscribe({
      next: (response) => {
        // Xử lý phản hồi thành công từ server
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Gửi liên hệ thành công!' });
        this.form.reset(); // Đặt lại biểu mẫu sau khi gửi thành công
         this.isLoading = false;
      },
      error: (error) => {
        // Xử lý lỗi từ server
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã xảy ra lỗi khi gửi liên hệ. Vui lòng thử lại sau.' });
        this.isLoading = false;
      }
    });

    // Handle form submission
  }
}
