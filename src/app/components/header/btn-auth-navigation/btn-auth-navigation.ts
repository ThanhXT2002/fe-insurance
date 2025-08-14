import { Component, computed, effect, inject, signal } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { FloatLabel, FloatLabelModule } from "primeng/floatlabel";
import { IconField, IconFieldModule } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-auth-navigation',
  imports: [RouterLink, AvatarModule, DrawerModule, ButtonModule, FloatLabel, IconField, InputIcon, ReactiveFormsModule, IconFieldModule, InputTextModule,FormsModule, FloatLabelModule, CommonModule],
  templateUrl: './btn-auth-navigation.html',
  styleUrl: './btn-auth-navigation.scss',
  animations: [
    trigger('slideUpDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(32px)' }),
        animate('350ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'translateY(32px)' }))
      ])
    ])
  ]
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
    effect(() => {
      const user = this.authService.userSignal();
      if (user?.photoURL) {
        this.hasImageError.set(false);
      }
    });

    this.updateForm = this.fb.group({
      displayName: [ this.authService.userSignal()?.displayName, [Validators.required]],
      photoURL: [this.authService.userSignal()?.photoURL],
    });
  }

  handleShowProfile(): void {
    this.isShowProfile = !this.isShowProfile;
  }


  handleShowBoxUpdateInfo(): void {
    this.isBoxUpdateInfo = !this.isBoxUpdateInfo;
  }

  async handleLogout(): Promise<void> {
    await this.authService.logout();
    this.handleShowProfile();
  }

  imgError(): string {
    return 'assets/images/avatar-default.webp';
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
