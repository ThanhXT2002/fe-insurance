import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'center';

export interface ToastOptions {
  severity?: ToastSeverity;
  title?: string;
  message: string;
  position?: ToastPosition;
  life?: number; // Thời gian hiển thị (ms)
  sticky?: boolean; // Không tự động ẩn
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageService = inject(MessageService);

  // Tiêu đề mặc định cho từng loại toast
  private readonly defaultTitles: Record<ToastSeverity, string> = {
    success: 'Thành công',
    info: 'Thông tin',
    warn: 'Cảnh báo',
    error: 'Lỗi',
    secondary: 'Thông báo',
    contrast: 'Quan trọng'
  };

  /**
   * Hiển thị toast với các tùy chọn tùy chỉnh
   */
  show(options: ToastOptions): void {
    const {
      severity = 'info',
      title,
      message,
      position = 'bottom-center',
      life = 5000,
      sticky = false
    } = options;

    this.messageService.add({
      severity,
      summary: title || this.defaultTitles[severity],
      detail: message,
      life: sticky ? 0 : life,
      key: position // PrimeNG sử dụng key để xác định position
    });
  }

  /**
   * Hiển thị toast thành công
   */
  success(message: string, title?: string, position?: ToastPosition): void {
    this.show({
      severity: 'success',
      title,
      message,
      position
    });
  }

  /**
   * Hiển thị toast thông tin
   */
  info(message: string, title?: string, position?: ToastPosition): void {
    this.show({
      severity: 'info',
      title,
      message,
      position
    });
  }

  /**
   * Hiển thị toast cảnh báo
   */
  warn(message: string, title?: string, position?: ToastPosition): void {
    this.show({
      severity: 'warn',
      title,
      message,
      position
    });
  }

  /**
   * Hiển thị toast lỗi
   */
  error(message: string, title?: string, position?: ToastPosition): void {
    this.show({
      severity: 'error',
      title,
      message,
      position
    });
  }

  /**
   * Hiển thị toast secondary
   */
  secondary(message: string, title?: string, position?: ToastPosition): void {
    this.show({
      severity: 'secondary',
      title,
      message,
      position
    });
  }

  /**
   * Hiển thị toast contrast
   */
  contrast(message: string, title?: string, position?: ToastPosition): void {
    this.show({
      severity: 'contrast',
      title,
      message,
      position
    });
  }

  /**
   * Xóa tất cả toast hiện tại
   */
  clear(position?: ToastPosition): void {
    if (position) {
      this.messageService.clear(position);
    } else {
      this.messageService.clear();
    }
  }

  /**
   * Hiển thị toast sticky (không tự động ẩn)
   */
  showSticky(options: Omit<ToastOptions, 'sticky'>): void {
    this.show({
      ...options,
      sticky: true
    });
  }
}
