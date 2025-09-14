import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-social-login-button',
  imports: [],
  templateUrl: './social-login-button.html',
  styleUrl: './social-login-button.scss',
})
export class SocialLoginButton {

  private readonly authService = inject(AuthService);
   isSubmittingGoogle = signal(false);
   isSubmittingFacebook = signal(false);

  async onLoginGoogle() {
    try {
      this.isSubmittingGoogle.set(true);
      await this.authService.loginWithGoogle();
      this.isSubmittingGoogle.set(false);
    } catch (error) {
      console.error('Google login error:', error);
      this.isSubmittingGoogle.set(false);
    }
  }

  async onLoginFacebook() {
    try {
      this.isSubmittingFacebook.set(true);
      await this.authService.loginWithFacebook();
      this.isSubmittingFacebook.set(false);
    } catch (error) {
      console.error('Facebook login error:', error);
      this.isSubmittingFacebook.set(false);
    }
  }
}
