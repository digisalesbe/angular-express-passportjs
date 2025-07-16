import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from '@angular/router';

import { environment } from '@environments/environment';
import { UserInterface } from '@models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = false;
  public currentUser$ = new BehaviorSubject<UserInterface | null>(null);

  constructor( private router: Router, private http: HttpClient ) {
    this.loggedIn = this.isLoggedIn();
  }

  confirmAccount( token: string ): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/confirm/${token}`);
  }

  getLoggedIn(): boolean | false {
    return this.loggedIn;
  }

  // Get the username
  getUserName(): string | null {
    const currentUser = this.currentUser$.getValue();
    const username = currentUser ? currentUser.username : null;
    return username;
  }

  // Get the user's name
  getName(): string | null {
    const currentUser = this.currentUser$.getValue();
    const payload =
      currentUser && currentUser.token
        ? JSON.parse( atob( currentUser.token.split('.')[1] ) )
        : null;
    return payload.name;
  }

  // Get the user's status
  getStatus(): string | null {
    const currentUser = this.currentUser$.getValue();
    const payload =
      currentUser && currentUser.token
        ? JSON.parse( atob( currentUser.token.split('.')[1] ) )
        : null;
    return payload.status;
  }

  // Set the current user
  setCurrentUser(user: UserInterface): void {
    this.currentUser$.next(user);
  }

  // Get the token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Set the token & loggedIn
  public setToken(token: string) {
    this.loggedIn = true;
    localStorage.setItem('token', token);
    console.log('Logged in');
  }

  // Remove the token
  public removeToken() {
    localStorage.removeItem('token');
    this.loggedIn = false;
  }

  isTokenExpired( token: string ): boolean {
    const payload = JSON.parse( atob( token.split('.')[1] ) );
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired( token );
  }

  checkTokenValidity(): void {
    const token = this.getToken();
    if (!token || this.isTokenExpired( token )) {
      this.logout();
    }
  }

  // Log out of the user account
  logout() {
    this.removeToken();
    this.router.navigate(['/']);
    console.log('Logged Out!');
  }
}