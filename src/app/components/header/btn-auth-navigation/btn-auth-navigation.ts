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

@Component({
  selector: 'app-btn-auth-navigation',
  imports: [
    RouterLink,
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
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  isShowProfile: boolean = false;
  isBoxUpdateInfo: boolean = false;

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  updateForm!: FormGroup;

  constructor() {
  this.updateForm = this.fb.group({
    displayName: ['', [Validators.required]],
    photoURL: ['assets/images/avatar-default.webp'],
  });

  effect(() => {
    const user = this.authService.userSignal();
    if (user) {
      this.updateForm.patchValue({
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? 'assets/images/avatar-default.webp',
      });
      if (user.photoURL) {
        this.hasImageError.set(false);
      }
    }
  });
}

  onAvatarClick(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const result = e.target.result;
          this.updateForm
            .get('photoURL')
            ?.setValue(result || 'assets/images/avatar-default.webp');
        };
        reader.readAsDataURL(file);
      }
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
    const displayName = this.updateForm.get('displayName')?.value;
    const photoURL = this.updateForm.get('photoURL')?.value;

    console.log('Updating profile with:', { displayName, photoURL });

    await this.authService.updateProfile(displayName, photoURL);
    this.isBoxUpdateInfo = false; // Đóng box sau khi cập nhật
  }

  async handleLogout(): Promise<void> {
    await this.authService.logout();
    this.handleShowProfile();
  }

  imgError(): void {
    this.updateForm
      .get('photoURL')
      ?.setValue('assets/images/avatar-default.webp');
  }

  private readonly hasImageError = signal(false);

  readonly imageUrl = computed(() => {
    if (this.hasImageError()) {
      return 'assets/images/avatar-default.webp';
    }
    return (
      this.authService.userSignal()?.photoURL ||
      'assets/images/avatar-default.webp'
    );
  });

  handleImageError(): void {
    this.hasImageError.set(true);
  }
}
