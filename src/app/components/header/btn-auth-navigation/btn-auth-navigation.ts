import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-btn-auth-navigation',
  imports: [RouterLink],
  templateUrl: './btn-auth-navigation.html',
  styleUrl: './btn-auth-navigation.scss'
})
export class BtnAuthNavigation {
  private  authService = inject(AuthService);

  


}
