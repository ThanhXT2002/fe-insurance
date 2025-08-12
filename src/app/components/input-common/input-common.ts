import { Component, input, computed, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-common',
  imports: [],
  templateUrl: './input-common.html',
  styleUrl: './input-common.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCommon),
      multi: true
    }
  ]
})
export class InputCommon implements ControlValueAccessor {
  // Input properties
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  minlength = input<number | null>(null);
  maxlength = input<number | null>(null);
  autocomplete = input<string>('');
  id = input<string>('');
  control = input<AbstractControl | null>(null);

  // Internal state
  value = signal<string>('');
  private _touched = signal<boolean>(false);
  private _focused = signal<boolean>(false);

  // ControlValueAccessor methods
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by input() signal
  }

  // Computed properties
  hasError = computed(() => {
    const control = this.control();
    return control && control.invalid && (control.dirty || control.touched);
  });

  errorMessage = computed(() => {
    const control = this.control();
    if (!control || !this.hasError()) return '';

    const errors = control.errors;
    if (errors?.['required']) return `${this.label()} là bắt buộc`;
    if (errors?.['email']) return 'Email không hợp lệ';
    if (errors?.['minlength']) return `${this.label()} phải có ít nhất ${errors['minlength'].requiredLength} ký tự`;
    if (errors?.['maxlength']) return `${this.label()} không được vượt quá ${errors['maxlength'].requiredLength} ký tự`;
    if (errors?.['pattern']) return `${this.label()} không đúng định dạng`;
    if (errors?.['passwordMismatch']) return 'Mật khẩu nhập lại không khớp';

    return 'Có lỗi xảy ra';
  });

  inputClasses = computed(() => {
    const baseClasses = 'w-full px-4 py-3 border rounded-lg bg-white/90 backdrop-blur-sm transition-all duration-200 placeholder-gray-500';
    const focusClasses = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    const errorClasses = this.hasError() ? 'border-red-500 focus:ring-red-500' : 'border-gray-300';
    const disabledClasses = this.disabled() ? 'bg-gray-100 cursor-not-allowed' : '';

    return `${baseClasses} ${focusClasses} ${errorClasses} ${disabledClasses}`;
  });

  // Event handlers
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.value.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this._touched.set(true);
    this._focused.set(false);
    this.onTouched();
  }

  onFocus(): void {
    this._focused.set(true);
  }
}
