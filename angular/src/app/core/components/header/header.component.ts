import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '@services/auth.services';
import { UserInterface } from '@models/user.interface';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;

  constructor( private authService: AuthService ) {}
 
  ngOnInit(): void {
    this.loggedIn = this.authService.getLoggedIn();
  }

  getName(): string | null {
    return this.authService.getName();
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn = false;
  }

}
