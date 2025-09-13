import { Component, computed, effect, inject, signal } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { AuthStore } from '@/core/store/auth/auth.store';
import { AuthApiService } from '@/core/store/auth/auth.api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-btn-auth-navigation',
  imports: [
    AvatarModule,
    DrawerModule,
    ButtonModule,
    FloatLabel,
    IconField,
    InputIcon,
    ReactiveFormsModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './btn-auth-navigation.html',
  styleUrl: './btn-auth-navigation.scss',
  animations: [
    trigger('slideUpDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(32px)' }),
        animate(
          '350ms cubic-bezier(0.4,0,0.2,1)',
          style({ opacity: 1, transform: 'translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '250ms cubic-bezier(0.4,0,0.2,1)',
          style({ opacity: 0, transform: 'translateY(32px)' }),
        ),
      ]),
    ]),
  ],
})
export class BtnAuthNavigation {
  authStore = inject(AuthStore);
  authApiService = inject(AuthApiService);
  authService = inject(AuthService);
  private messageService = inject(MessageService);
  readonly isLogined = computed(() => !!this.authService.user());

  // Preview / optimistic UI signals
  private previewAvatar = signal<string | null>(null);
  uploading = signal(false);

  get avatarUrl(): string | undefined {
    const profile = this.authStore.profile();
    return profile?.avatarUrl ?? 'assets/images/avatar-default.webp';
  }

  // Displayed avatar: preview when available, otherwise store avatar
  get displayAvatar(): string {
    return this.previewAvatar() ?? this.avatarUrl!;
  }

  private fb = inject(FormBuilder);

  isShowProfile: boolean = false;
  isBoxUpdateInfo: boolean = false;

  updateForm!: FormGroup;

  constructor() {
    this.updateForm = this.fb.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      addresses: [''],
    });

    effect(() => {
      const user = this.authStore.profile();
      if (user) {
        this.updateForm.patchValue({
          name: user.name ?? '',
          phoneNumber: user.phoneNumber ?? '',
          addresses: user.addresses,
        });
        if (user.avatarUrl) {
          this.hasImageError.set(false);
        }
      }
    });
  }


  onAvatarClick(): void {
    if (this.uploading()) return; // prevent concurrent uploads

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file: File = event.target.files && event.target.files[0];
      if (!file) return;

      const oldAvatarUrl = this.avatarUrl;

      // create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewUrl = e.target.result as string;
        this.previewAvatar.set(previewUrl);
        this.uploading.set(true);

        // call API to upload
        this.authApiService.updateAvatar(file).subscribe({
          next: (res) => {
            this.uploading.set(false);
            if (res.status && res.data) {
              // update store with server profile (authoritative)
              this.authStore.setProfile(res.data);
              // clear preview so displayAvatar reads from store
              this.previewAvatar.set(null);
              this.messageService.add({
                severity: 'success',
                summary: 'Cập nhật avatar thành công',
              });
            } else {
              // revert preview
              this.previewAvatar.set(null);
              this.messageService.add({
                severity: 'error',
                summary: 'Cập nhật avatar thất bại',
                detail: res?.message || 'Vui lòng thử lại',
              });
            }
          },
          error: (err) => {
            this.uploading.set(false);
            this.previewAvatar.set(null);
            this.messageService.add({
              severity: 'error',
              summary: 'Cập nhật avatar thất bại',
              detail: err?.error?.message || 'Vui lòng thử lại',
            });
          },
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  handleShowProfile(): void {
    this.isShowProfile = !this.isShowProfile;
  }

  handleShowBoxUpdateInfo(): void {
    this.isBoxUpdateInfo = !this.isBoxUpdateInfo;
  }

  handleUpdateNow() {
    if (this.isBoxUpdateInfo) {
      this.handleUpdateProfile();
    } else {
      this.handleShowBoxUpdateInfo();
    }
  }

  async handleUpdateProfile(): Promise<void> {
    if (!this.updateForm.valid) {
      this.updateForm.markAllAsTouched();
    }
    this.uploading.set(true);
    const data = this.updateForm.value;
    this.authApiService.updateProfile(data).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this.authStore.setProfile(res.data);
          this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật thành công',
          });
          this.isBoxUpdateInfo = false; // Đóng box sau khi cập nhật
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cập nhật thất bại',
          detail: err?.error?.message || 'Vui lòng thử lại',
        });
      },
      complete: () => {
        this.uploading.set(false);
      },
    });
  }

  async handleLogout(): Promise<void> {
    await this.authService.logout();
    this.handleShowProfile();
  }

  private readonly hasImageError = signal(false);

  handleImageError(): void {
    this.hasImageError.set(true);
  }
}
