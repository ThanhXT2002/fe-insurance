import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-social-login-button',
  imports: [],
  templateUrl: './social-login-button.html',
  styleUrl: './social-login-button.scss',
})
export class SocialLoginButton {

  private readonly authService = inject(AuthService);

  async onLoginGoogle() {
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  async onLoginfacebook() {
    try {
      await this.authService.loginWithFacebook();
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  }
}
