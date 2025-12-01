import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '@services/auth.services';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loggedIn: boolean = false;

  constructor( private authService: AuthService ) {}

  // Need to check each time header component is called
  ngDoCheck(): void {
    this.loggedIn = this.authService.isLoggedIn();
  }

  getName(): string | null {
    return this.authService.getName();
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn = false;
  }

}
