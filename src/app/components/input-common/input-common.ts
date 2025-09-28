import {
  Component,
  Input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-input-common',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-common.html',
  styleUrls: ['./input-common.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCommon {
  @Input() control?: FormControl | null;
  @Input() id?: string | null;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: string = 'text';
  @Input() multiline = false;
  @Input() rows = 3;

  focused = signal(false);

  showError(): boolean {
    const c = this.control as FormControl | undefined | null;
    if (!c) return false;
    return !!(c.invalid && (c.touched || c.dirty));
  }

  errorMessages(): string[] {
    const c = this.control as FormControl | undefined | null;
    if (!c) return [] as string[];
    const errors: ValidationErrors | null = c.errors;
    if (!errors) return [] as string[];
    const messages: string[] = [];
    for (const key of Object.keys(errors)) {
      const value = errors[key];
      switch (key) {
        case 'required':
          messages.push('Trường này là bắt buộc.');
          break;
        case 'minlength':
          messages.push(`Tối thiểu ${value?.requiredLength} ký tự.`);
          break;
        case 'maxlength':
          messages.push(`Tối đa ${value?.requiredLength} ký tự.`);
          break;
        case 'email':
          messages.push('Email không hợp lệ.');
          break;
        case 'pattern':
          messages.push('Dữ liệu không đúng định dạng.');
          break;
        default:
          // Nếu value là string thì hiển thị trực tiếp, nếu là object thì stringify
          messages.push(
            typeof value === 'string' ? value : JSON.stringify(value),
          );
      }
    }
    return messages;
  }

  onFocus() {
    this.focused.set(true);
  }

  onBlur() {
    this.focused.set(false);
    if (this.control && this.control.markAsTouched) {
      this.control.markAsTouched();
    }
  }

  get errorId(): string | null {
    if (this.id) return this.id + '-error';
    if (!this.label) return null;
    return 'error-' + this.label.replace(/\s+/g, '-').toLowerCase();
  }
}
