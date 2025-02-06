import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  isLoggedIn: boolean = false;
  user: UserInterface | null = null;

  constructor( private authService: AuthService, private router: Router ) {}
 
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: UserInterface | null) => {
      this.user = user;
      this.isLoggedIn = !!user;
    });
  }

  getName(): string | null {
    return this.authService.getName();
  }

  logout(){
    this.authService.removeToken();
    this.router.navigateByUrl('/home');
  }

}
