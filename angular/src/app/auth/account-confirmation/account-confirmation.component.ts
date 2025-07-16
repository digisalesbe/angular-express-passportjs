import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@services/auth.services';

@Component({
  selector: 'app-account-confirmation',
  standalone: true,
  templateUrl: './account-confirmation.component.html',
  styleUrls: ['./account-confirmation.component.css'],
  imports: [CommonModule]
})
export class AccountConfirmationComponent implements OnInit {
  message: string = '';
  loading = true;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const token = params.get('token');
      if (token) {
        this.authService.confirmAccount(token).subscribe({
          next: () => {
            this.message = 'Your account has been successfully confirmed !';
            this.success = true;
            this.loading = false;
          },
          error: err => {
            this.message = err?.error?.message || 'Invalid or expired confirmation token.';
            this.success = false;
            this.loading = false;
          }
        });
      } else {
        this.message = 'No confirmation token provided.';
        this.loading = false;
        this.success = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
