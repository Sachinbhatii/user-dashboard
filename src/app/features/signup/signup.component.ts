import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './signup.component.css',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  signup() {
    if (this.auth.signup(this.username, this.password)) {
      this.router.navigate(['/login']);
    } else {
      this.error = 'Username already taken';
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}